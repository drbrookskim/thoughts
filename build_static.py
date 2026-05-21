import os
import json
import re

ARTICLES_DIR = 'brunch_articles'
API_DIR = 'api'

os.makedirs(API_DIR, exist_ok=True)
os.makedirs(os.path.join(API_DIR, 'article'), exist_ok=True)

def parse_markdown_metadata(filepath):
    title = "제목 없음"
    date_str = "N/A"
    url = ""
    category = None
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()[:10]
        content_snippet = "".join(lines)
        for line in lines:
            if line.startswith('# '):
                title = line.replace('# ', '').strip()
                break
        date_match = re.search(r'작성일\*\*:?\s*([^\s\n\r]+)', content_snippet)
        if date_match:
            date_str = date_match.group(1)
            if 'T' in date_str:
                date_str = date_str.split('T')[0]
        url_match = re.search(r'원문 주소\*\*:?\s*([^\s\n\r]+)', content_snippet)
        if url_match:
            url = url_match.group(1)
        category_match = re.search(r'카테고리\*\*:?\s*([^\n\r]+)', content_snippet)
        if category_match:
            category = category_match.group(1).strip()
    except Exception as e:
        print(f"Error parsing metadata for {filepath}: {e}")
    return title, date_str, url, category

def classify_article(filename, title):
    t = (filename + " " + title).lower()
    
    # 1. AI와 기술 (AI & Tech)
    if any(k in t for k in ["ai", "웹", "스마트폰", "기술", "프로그래머", "페이지랭크", "토큰", "인공지능", "llm", "rag", "추론", "pruning", "컴퓨터", "코드", "딥시크", "deepseek", "기기 생태계", "커맨드라인", "p-np", "양자역학"]):
        return "AI와 기술"
        
    # 2. 상품기획 (Product Planning)
    if any(k in t for k in ["상품기획", "상품 기획", "대체재", "보완재", "쇼핑카트", "서비스에 대한 단상", "워치", "여행 상품", "경험과 상품기획", "상품의 운명", "스마트폰 경쟁"]):
        return "상품기획"
        
    # 3. 경제와 가치 (Economy & Value)
    if any(k in t for k in ["경제", "가치", "가격", "돈", "노동", "한계효용", "유료", "보상", "환산", "소유", "점유", "토큰사회", "3대 500", "따밥"]):
        return "경제와 가치"
        
    # 4. 관계와 사회 (Relationship & Society)
    if any(k in t for k in ["관계", "사회", "리더", "무례", "권위", "조직", "동료", "타인", "공생", "예절", "계급", "지정학", "평등", "친분", "양의 군집", "군집본능", "회사", "소통의 부재", "소통의 본질", "인간관계", "역할"]):
        return "관계와 사회"

    # 5. 사고와 언어 (Thought & Language)
    if any(k in t for k in ["사고", "언어", "생각", "비판적", "문장", "말맛", "소통", "질문", "듣기", "대화", "설득", "고집", "이해", "분석", "해석", "맥락", "본성", "지능", "의식"]):
        return "사고와 언어"
        
    # 6. 인간과 심리 (Human & Psychology)
    if any(k in t for k in ["인간", "심리", "감정", "외로움", "고독", "죽음", "선택", "책임", "의지", "행복", "나를", "정체성", "마인드", "이해", "아는 것", "자아", "두 얼굴", "착각", "기억", "뇌", "생물학", "개인차", "나이", "배움", "인생", "눈과 비", "굳은살", "그리했다면", "버티는", "소소한", "쓸쓸함", "경험"]):
        return "인간과 심리"
        
    # 7. 기획론 (Planning Theory)
    if any(k in t for k in ["기획", "기획자", "기획력", "기획의", "기획론", "기획적", "기획다움", "기획관점", "핍진성", "시나리오", "성공", "실패", "결정", "판단", "지능", "상수제어", "의도된"]):
        return "기획론"
        
    return "기획론"

# Mapping to filenames as requested
category_filenames = {
    "기획론": "기획론.md",
    "상품기획": "상품기획.md",
    "AI와 기술": "AI와기술.md",
    "인간과 심리": "인간과심리.md",
    "사고와 언어": "사고와언어.md",
    "관계와 사회": "관계와사회.md",
    "경제와 가치": "경제와가치.md"
}

category_descriptions = {
    "기획론": "기획의 본질과 원리, 기획론 및 이론적 고찰에 관한 성찰",
    "상품기획": "실제 상품기획, 시장 경쟁 및 서비스 기획 실무 분석",
    "AI와 기술": "인공지능(AI), 대형 언어 모델(LLM), 웹 및 최신 기술 생태계에 관한 고찰",
    "인간과 심리": "선택, 책임, 감정, 인생의 나이 듦과 자기 이해 등 인간의 심리와 본성",
    "사고와 언어": "비판적 사고, 소통, 언어와 맥락, 설득과 이해에 관한 지적 탐색",
    "관계와 사회": "인간관계, 리더십, 조직 문화, 지정학 및 공동체적 조율",
    "경제와 가치": "노동의 가치 변화, 가격 민감도, 경제적 보상과 소유권"
}

articles = []
category_groups = {cat: [] for cat in category_filenames.keys()}

for filename in os.listdir(ARTICLES_DIR):
    if not filename.endswith('.md'): continue
    filepath = os.path.join(ARTICLES_DIR, filename)
    try:
        id_part = filename.split('_')[0]
        article_id = int(id_part)
        title, date_str, url, category = parse_markdown_metadata(filepath)
        size_kb = round(os.path.getsize(filepath) / 1024, 1)
        
        if not category:
            category = classify_article(filename, title)
        
        item_meta = {
            "id": article_id,
            "title": title,
            "date": date_str,
            "url": url,
            "filename": filename,
            "size_kb": size_kb,
            "category": category
        }
        articles.append(item_meta)
        category_groups[category].append(item_meta)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        article_data = {
            "id": article_id,
            "title": title,
            "date": date_str,
            "url": url,
            "filename": filename,
            "size_kb": size_kb,
            "category": category,
            "content": content
        }
        
        with open(os.path.join(API_DIR, 'article', f'{article_id}.json'), 'w', encoding='utf-8') as f:
            json.dump(article_data, f, ensure_ascii=False)
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

# Sort by id descending
articles.sort(key=lambda x: x['id'], reverse=True)

with open(os.path.join(API_DIR, 'articles.json'), 'w', encoding='utf-8') as f:
    json.dump(articles, f, ensure_ascii=False)

# Compile and write premium category Markdown index files
for cat, items in category_groups.items():
    items.sort(key=lambda x: x['id'], reverse=True)
    outfile = category_filenames[cat]
    desc = category_descriptions[cat]
    
    md_lines = [
        f"# {cat}",
        "",
        f"> **{desc}**",
        "",
        f"이 카테고리에는 서로 깊은 연관성이 있는 **총 {len(items)}개**의 아티클이 연결되어 있습니다.",
        "각 글은 단순 분절된 정보가 아닌, 생각의 깊이를 유기적으로 엮어내어 지식 그래프를 형성합니다.",
        "",
        "## 아티클 색인표",
        "",
        "| 번호 (ID) | 작성일자 | 아티클 명제 (Brunch Link) | 저장된 로컬 문서 | 크기 |",
        "| :--- | :--- | :--- | :--- | :--- |"
    ]
    
    for item in items:
        # standard markdown link
        escaped_filename = item['filename'].replace(" ", "%20")
        brunch_link = f"[{item['title']}]({item['url']})" if item['url'] else item['title']
        md_lines.append(
            f"| `ID {item['id']}` | {item['date']} | **{brunch_link}** | [{item['filename']}](brunch_articles/{escaped_filename}) | `{item['size_kb']} KB` |"
        )
        
    with open(outfile, 'w', encoding='utf-8') as f:
        f.write("\n".join(md_lines) + "\n")
    print(f"Generated category index: {outfile} ({len(items)} articles)")

print("Static API and Category Index files generated successfully.")
