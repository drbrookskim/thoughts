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
    except Exception as e:
        print(f"Error parsing metadata for {filepath}: {e}")
    return title, date_str, url

articles = []
for filename in os.listdir(ARTICLES_DIR):
    if not filename.endswith('.md'): continue
    filepath = os.path.join(ARTICLES_DIR, filename)
    try:
        id_part = filename.split('_')[0]
        article_id = int(id_part)
        title, date_str, url = parse_markdown_metadata(filepath)
        size_kb = round(os.path.getsize(filepath) / 1024, 1)
        
        articles.append({
            "id": article_id,
            "title": title,
            "date": date_str,
            "url": url,
            "filename": filename,
            "size_kb": size_kb
        })
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        article_data = {
            "id": article_id,
            "title": title,
            "date": date_str,
            "url": url,
            "filename": filename,
            "size_kb": size_kb,
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

print("Static API generated successfully.")
