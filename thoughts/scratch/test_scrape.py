import requests
from bs4 import BeautifulSoup
import re

url = "https://brunch.co.kr/@drbrooks/196"
headers = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')
body = soup.find('div', class_='wrap_body')
island = body.find('astro-island') if body else None
content_root = island if island else body

# Content Extraction
markdown_blocks = []

def parse_inline_elements(element) -> str:
    inline_md = ""
    for child in element.children:
        if child.name is None:
            inline_md += child.string if child.string else ""
        elif child.name in ['strong', 'b']:
            inline_md += f"**{child.get_text(strip=True)}**"
        elif child.name in ['em', 'i']:
            inline_md += f"*{child.get_text(strip=True)}*"
        elif child.name == 'a':
            href = child.get('href', '')
            inline_md += f"[{child.get_text(strip=True)}]({href})"
        elif child.name == 'br':
            inline_md += "\n"
        else:
            inline_md += parse_inline_elements(child)
    inline_md = re.sub(r'[ \t]+', ' ', inline_md)
    return inline_md.strip()

if content_root:
    # Collect block elements
    block_elements = []
    for el in content_root.find_all(True):
        classes = el.get('class', [])
        class_str = " ".join(classes) if classes else ""
        is_block = False
        if any(k in class_str for k in ["item_type_text", "item_type_title", "item_type_img", "item_type_quote", "item_type_hr"]) or el.name in ['p', 'h1', 'h2', 'h3', 'h4', 'blockquote']:
            is_block = True
        
        if is_block:
            # Check if it has a parent that is also a block element
            has_block_parent = False
            parent = el.parent
            while parent and parent != content_root:
                p_classes = parent.get('class', [])
                p_class_str = " ".join(p_classes) if p_classes else ""
                if any(k in p_class_str for k in ["item_type_text", "item_type_title", "item_type_img", "item_type_quote", "item_type_hr"]) or parent.name in ['p', 'h1', 'h2', 'h3', 'h4', 'blockquote']:
                    has_block_parent = True
                    break
                parent = parent.parent
            
            if not has_block_parent:
                block_elements.append(el)

    print(f"Collected {len(block_elements)} block elements.")
    for child in block_elements:
        classes = child.get('class', [])
        class_str = " ".join(classes) if classes else ""

        # 1. Text Block
        if "item_type_text" in class_str or child.name == 'p':
            text = parse_inline_elements(child)
            if text.strip():
                markdown_blocks.append(text)

        # 2. Heading Block
        elif "item_type_title" in class_str or child.name in ['h1', 'h2', 'h3', 'h4']:
            text = parse_inline_elements(child)
            if text.strip():
                markdown_blocks.append(f"## {text}")

        # 3. Image Block
        elif "item_type_img" in class_str:
            img_tag = child.find('img')
            if img_tag:
                src = img_tag.get('src') or img_tag.get('data-src') or ""
                if src.startswith('//'):
                    src = 'https:' + src
                alt = img_tag.get('alt', 'Image')

                img_md = f"![{alt}]({src})"

                # Caption check
                caption_tag = child.find('span', class_='text_caption')
                if caption_tag:
                    caption = caption_tag.get_text(strip=True)
                    if caption:
                        img_md += f"\n*{caption}*"

                markdown_blocks.append(img_md)

        # 4. Quote Block
        elif "item_type_quote" in class_str or child.name == 'blockquote':
            text = parse_inline_elements(child)
            if text.strip():
                lines = text.split('\n')
                quoted = "\n".join([f"> {line}" for line in lines])
                markdown_blocks.append(quoted)

        # 5. Divider Block
        elif "item_type_hr" in class_str:
            markdown_blocks.append("---")

body_markdown = "\n\n".join(markdown_blocks)
print("\n--- Extracted Markdown (first 500 chars) ---")
print(body_markdown[:500])
print("\n--- Extracted Markdown (last 200 chars) ---")
print(body_markdown[-200:])
