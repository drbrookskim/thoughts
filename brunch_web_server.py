import os
import re
import threading
from datetime import datetime
from flask import Flask, jsonify, request, render_template, send_from_directory
from brunch_scraper import BrunchScraper, BrunchMarkdownConverter

app = Flask(__name__, template_folder='.', static_folder='static')

# Constants
ARTICLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'brunch_articles'))
os.makedirs(ARTICLES_DIR, exist_ok=True)
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "drbrooks123")

# Global scraper status to support real-time progress tracking
scraper_status = {
    "is_running": False,
    "current_id": 0,
    "saved_count": 0,
    "log": [],
    "finished": False,
    "error": None
}

def parse_markdown_metadata(filepath):
    """
    Parses title, date, and url from a saved markdown file header.
    """
    title = "제목 없음"
    date_str = "N/A"
    url = ""
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()[:10]  # Only read first few lines for meta
            
        content_snippet = "".join(lines)
        
        # Parse title (Line 1: # Title)
        for line in lines:
            if line.startswith('# '):
                title = line.replace('# ', '').strip()
                break
                
        # Parse date (- **작성일**: date)
        date_match = re.search(r'작성일\*\*:?\s*([^\s\n\r]+)', content_snippet)
        if date_match:
            date_str = date_match.group(1)
            # Remove timezone offset or 'T' if present
            if 'T' in date_str:
                date_str = date_str.split('T')[0]
                
        # Parse url (- **원문 주소**: url)
        url_match = re.search(r'원문 주소\*\*:?\s*([^\s\n\r]+)', content_snippet)
        if url_match:
            url = url_match.group(1)
            
    except Exception as e:
        print(f"Error parsing metadata for {filepath}: {e}")
        
    return title, date_str, url

def run_scraper_thread(author, start_date_str, end_date_str, start_id, output_dir):
    global scraper_status
    
    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError as e:
        scraper_status["is_running"] = False
        scraper_status["finished"] = True
        scraper_status["error"] = f"날짜 형식 오류: {e}"
        return

    scraper = BrunchScraper(author_id=author, delay=0.4)
    scraper_status["is_running"] = True
    scraper_status["finished"] = False
    scraper_status["saved_count"] = 0
    scraper_status["log"] = [f"[*] Brunch Scraper started for @{author}..."]
    
    current_id = start_id
    consecutive_404 = 0
    max_consecutive_404 = 10
    saved_count = 0
    
    while consecutive_404 < max_consecutive_404:
        # Check if this ID is already scraped
        existing_files = [f for f in os.listdir(output_dir) if f.startswith(f"{current_id}_") and f.endswith(".md")]
        if existing_files:
            scraper_status["log"].append(f"[ ] ID {current_id}: 이미 수집되어 저장되어 있습니다. 건너뜁니다.")
            consecutive_404 = 0
            current_id += 1
            continue

        scraper_status["current_id"] = current_id
        url = f"https://brunch.co.kr/@{author}/{current_id}"
        
        scraper_status["log"].append(f"[진행 중] 글 ID {current_id} 분석 요청...")
        
        try:
            response = requests_get_helper(url, scraper.headers)
        except Exception as e:
            scraper_status["log"].append(f"[오류] ID {current_id}: 연결 실패 ({e})")
            time_delay = 1.0
            import time
            time.sleep(time_delay)
            current_id += 1
            continue

        if response.status_code == 404:
            consecutive_404 += 1
            scraper_status["log"].append(f"[!] ID {current_id}: 404 Not Found (연속: {consecutive_404})")
            current_id += 1
            continue

        if response.status_code != 200:
            scraper_status["log"].append(f"[경고] ID {current_id}: 응답 오류 {response.status_code}")
            consecutive_404 = 0
            current_id += 1
            continue

        # Valid article found
        consecutive_404 = 0
        title, pub_date, markdown_content = BrunchMarkdownConverter.convert(response.text, url)

        if pub_date:
            if pub_date < start_date:
                scraper_status["log"].append(f"[제외] ID {current_id}: '{title}' - 시작일({start_date}) 이전 작성 ({pub_date})")
            elif pub_date > end_date:
                scraper_status["log"].append(f"[제외] ID {current_id}: '{title}' - 종료일({end_date}) 이후 작성 ({pub_date})")
            else:
                # Save
                safe_title = scraper.clean_filename(title)
                filename = f"{current_id}_{safe_title}.md"
                filepath = os.path.join(output_dir, filename)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(markdown_content)
                
                saved_count += 1
                scraper_status["saved_count"] = saved_count
                scraper_status["log"].append(f"[저장] ID {current_id}: '{title}' 변환 및 저장 완료! ({pub_date})")
        else:
            # Fallback save
            safe_title = scraper.clean_filename(title)
            filename = f"{current_id}_{safe_title}.md"
            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
            saved_count += 1
            scraper_status["saved_count"] = saved_count
            scraper_status["log"].append(f"[저장] ID {current_id}: '{title}' (날짜 불명 - 강제 저장)")

        import time
        time.sleep(scraper.delay)
        current_id += 1
        
    scraper_status["is_running"] = False
    scraper_status["finished"] = True
    scraper_status["log"].append(f"[*] 크롤링이 안전하게 완료되었습니다! 총 {saved_count}개 글 저장 완료.")

def requests_get_helper(url, headers):
    import requests
    return requests.get(url, headers=headers, timeout=10)


def get_brunch_article_count(author_id):
    """
    Scrapes ONLY the author's main profile page to extract total post count.
    Extremely lightweight, robust, and safe (takes <0.2s).
    """
    url = f"https://brunch.co.kr/@{author_id}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    try:
        import requests
        from bs4 import BeautifulSoup
        
        response = requests.get(url, headers=headers, timeout=8)
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 1. Primary: Search Brunch's specific TestID tab identifier
        tab = soup.find(attrs={"data-testid": "profile-tab-articles"})
        if tab:
            match = re.search(r'글\s*(\d+)', tab.text)
            if match:
                return int(match.group(1))
                
        # 2. Secondary Fallback: Any anchor tag containing '글' and digits
        for a in soup.find_all('a'):
            if a.text and '글' in a.text:
                match = re.search(r'글\s*(\d+)', a.text)
                if match:
                    return int(match.group(1))
                    
        # 3. Tertiary Fallback: Any span tag containing '글' and digits
        for span in soup.find_all('span'):
            if span.text and '글' in span.text:
                match = re.search(r'글\s*(\d+)', span.text)
                if match:
                    return int(match.group(1))
                    
    except Exception as e:
        print(f"[!] Error fetching profile article count: {e}")
    return None


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/check_new', methods=['GET'])
def check_new_articles():
    """
    Compares the real-time article count on Brunch profile against local MD files.
    Fires off seamlessly in the background during page initialization.
    """
    author = request.args.get("author", "drbrooks")
    
    online_count = get_brunch_article_count(author)
    if online_count is None:
        return jsonify({
            "success": False,
            "error": "브런치 프로필 조회 실패 (네트워크 연결 혹은 플랫폼 레이아웃 개편 감지)"
        }), 500

    # Read current local markdown file count
    local_count = 0
    if os.path.exists(ARTICLES_DIR):
        for filename in os.listdir(ARTICLES_DIR):
            if filename.endswith('.md') and re.match(r'^(\d+)_', filename):
                local_count += 1
                
    has_new = online_count > local_count
    
    return jsonify({
        "success": True,
        "has_new": has_new,
        "online_count": online_count,
        "local_count": local_count,
        "diff": max(0, online_count - local_count)
    })


@app.route('/api/articles', methods=['GET'])
def get_articles():
    """
    Scans the articles directory and returns a sorted list of articles.
    """
    articles = []
    
    if not os.path.exists(ARTICLES_DIR):
        return jsonify([])
        
    for filename in os.listdir(ARTICLES_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(ARTICLES_DIR, filename)
            
            # Extract ID from filename (e.g. 164_title.md -> 164)
            match = re.match(r'^(\d+)_', filename)
            article_id = int(match.group(1)) if match else 0
            
            title, date_str, url = parse_markdown_metadata(filepath)
            
            articles.append({
                "id": article_id,
                "filename": filename,
                "title": title,
                "date": date_str,
                "url": url,
                "size_kb": round(os.path.getsize(filepath) / 1024, 2)
            })
            
    # Sort articles by ID in descending order (newest first)
    articles.sort(key=lambda x: x['id'], reverse=True)
    return jsonify(articles)


@app.route('/api/article/<int:article_id>', methods=['GET'])
def get_article_content(article_id):
    """
    Returns the markdown content of a specific article.
    """
    if not os.path.exists(ARTICLES_DIR):
        return jsonify({"error": "저장소가 존재하지 않습니다."}), 404
        
    target_filename = None
    for filename in os.listdir(ARTICLES_DIR):
        if filename.endswith('.md') and filename.startswith(f"{article_id}_"):
            target_filename = filename
            break
            
    if not target_filename:
        return jsonify({"error": f"글 ID {article_id}를 찾을 수 없습니다."}), 404
        
    filepath = os.path.join(ARTICLES_DIR, target_filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({
            "id": article_id,
            "filename": target_filename,
            "content": content
        })
    except Exception as e:
        return jsonify({"error": f"파일 읽기 오류: {e}"}), 500


def get_latest_local_id():
    """
    Scans the articles directory for markdown files and returns the maximum numeric ID.
    """
    max_id = 0
    if os.path.exists(ARTICLES_DIR):
        for filename in os.listdir(ARTICLES_DIR):
            if filename.endswith('.md'):
                match = re.match(r'^(\d+)_', filename)
                if match:
                    max_id = max(max_id, int(match.group(1)))
    return max_id


@app.route('/api/scrape', methods=['POST'])
def start_scraping():
    """
    Triggers a background thread to crawl Brunch articles.
    """
    global scraper_status
    
    if scraper_status["is_running"]:
        return jsonify({"error": "이미 크롤링이 진행 중입니다."}), 400
        
    data = request.json or {}
    password = data.get("password")
    
    if password != ADMIN_PASSWORD:
        return jsonify({"error": "비밀번호가 올바르지 않습니다."}), 401
        
    author = data.get("author", "drbrooks")
    start_id = get_latest_local_id() + 1
    start_date = "2000-01-01"
    end_date = datetime.today().strftime('%Y-%m-%d')
    
    # Initialize status
    scraper_status = {
        "is_running": True,
        "current_id": start_id,
        "saved_count": 0,
        "log": [],
        "finished": False,
        "error": None
    }
    
    # Start thread
    thread = threading.Thread(
        target=run_scraper_thread,
        args=(author, start_date, end_date, start_id, ARTICLES_DIR)
    )
    thread.daemon = True
    thread.start()
    
    return jsonify({"message": "크롤링 백그라운드 작업이 시작되었습니다.", "status": scraper_status})


@app.route('/api/scrape/status', methods=['GET'])
def get_scraping_status():
    """
    Returns the real-time status and logs of the background scraper thread.
    """
    global scraper_status
    return jsonify(scraper_status)


if __name__ == '__main__':
    print("[*] Starting Brunch Scraper Web App on http://127.0.0.1:5050 ...")
    app.run(host='127.0.0.1', port=5050, debug=True)
