#!/usr/bin/env python3
"""
Brunch to Markdown Scraper Module
This module crawls articles from Kakao Brunch for a specific author and date range,
converting the articles into beautifully clean Markdown (.md) files.

Author: Antigravity AI
Date: 2026-05-17
"""

import os
import sys
import re
import time
import argparse
from datetime import datetime
import requests
from bs4 import BeautifulSoup, Comment


class BrunchMarkdownConverter:
    """
    Parses Kakao Brunch HTML and formats it into clean, premium Markdown.
    """

    @staticmethod
    def parse_inline_elements(element) -> str:
        """
        Recursively converts inline formatting (strong, em, a, br) to Markdown,
        while completely ignoring hydration comments.
        """
        inline_md = ""
        for child in element.children:
            if isinstance(child, Comment):
                continue  # Ignore Astro framework hydration comments

            if child.name is None:
                # Leaf text node
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
                # Fallback for unexpected inline nesting
                inline_md += BrunchMarkdownConverter.parse_inline_elements(child)

        # Standardize spaces but keep newlines
        inline_md = re.sub(r'[ \t]+', ' ', inline_md)
        return inline_md.strip()

    @classmethod
    def convert(cls, html_text: str, url: str) -> tuple:
        """
        Converts Brunch post HTML into a structured Markdown document.
        Returns:
            (title, pub_date, markdown_content)
        """
        soup = BeautifulSoup(html_text, 'html.parser')

        # Extract Title
        title_tag = soup.find('h1', class_='cover_title')
        title = title_tag.get_text(strip=True) if title_tag else None
        if not title:
            title_meta = soup.find('meta', property='og:title')
            title = title_meta['content'] if title_meta else "No Title"

        # Extract Publish Time
        published_time_meta = soup.find('meta', property='article:published_time')
        published_time_str = published_time_meta['content'] if published_time_meta else None

        pub_date = None
        if published_time_str:
            try:
                date_part = published_time_str.split('T')[0]
                pub_date = datetime.strptime(date_part, "%Y-%m-%d").date()
            except Exception:
                pub_date = None

        # Content Extraction
        body = soup.find('div', class_='wrap_body')
        island = body.find('astro-island') if body else None
        content_root = island if island else body

        markdown_blocks = []

        if content_root:
            children = content_root.find_all(recursive=False)
            for child in children:
                classes = child.get('class', [])
                class_str = " ".join(classes) if classes else ""

                # 1. Text Block
                if "item_type_text" in class_str or child.name == 'p':
                    text = cls.parse_inline_elements(child)
                    if text.strip():
                        markdown_blocks.append(text)

                # 2. Heading Block
                elif "item_type_title" in class_str or child.name in ['h1', 'h2', 'h3', 'h4']:
                    text = cls.parse_inline_elements(child)
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
                    text = cls.parse_inline_elements(child)
                    if text.strip():
                        lines = text.split('\n')
                        quoted = "\n".join([f"> {line}" for line in lines])
                        markdown_blocks.append(quoted)

                # 5. Divider Block
                elif "item_type_hr" in class_str:
                    markdown_blocks.append("---")

        body_markdown = "\n\n".join(markdown_blocks)

        # Build clean metadata header
        meta_header = f"""# {title}

- **작성일**: {published_time_str if published_time_str else 'N/A'}
- **원문 주소**: {url}

---
"""

        final_markdown = f"{meta_header}\n{body_markdown}\n"
        final_markdown = re.sub(r'\n{3,}', '\n\n', final_markdown)

        return title, pub_date, final_markdown


class BrunchScraper:
    """
    Scrapes and filters articles from a Brunch author profile.
    """

    def __init__(self, author_id: str, delay: float = 0.5):
        self.author_id = author_id
        self.delay = delay
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }

    def clean_filename(self, title: str) -> str:
        """
        Replaces characters that are illegal in file names.
        """
        cleaned = re.sub(r'[\/:*?"<>|]', '_', title)
        return cleaned.strip()

    def scrape_by_id_range(
        self,
        start_id: int,
        start_date: datetime.date,
        end_date: datetime.date,
        output_dir: str
    ) -> int:
        """
        Crawls sequentially from a starting post ID.
        Stops when 5 consecutive 404 responses are encountered.
        """
        os.makedirs(output_dir, exist_ok=True)
        current_id = start_id
        consecutive_404 = 0
        max_consecutive_404 = 30
        saved_count = 0

        print(f"[*] Crawling Brunch author '@{self.author_id}' starting from post ID {start_id}...")
        print(f"[*] Target range: {start_date} to {end_date}")
        print(f"[*] Output directory: {output_dir}\n")

        while consecutive_404 < max_consecutive_404:
            # Check if this ID is already scraped
            existing_files = [f for f in os.listdir(output_dir) if f.startswith(f"{current_id}_") and f.endswith(".md")]
            if existing_files:
                print(f"[ ] ID {current_id}: Already crawled and saved as '{existing_files[0]}'. Skipping request.")
                consecutive_404 = 0
                current_id += 1
                continue

            url = f"https://brunch.co.kr/@{self.author_id}/{current_id}"
            try:
                response = requests.get(url, headers=self.headers, timeout=10)
            except Exception as e:
                print(f"[!] ID {current_id}: Connection error: {e}")
                time.sleep(1.0)
                current_id += 1
                continue

            if response.status_code == 404:
                consecutive_404 += 1
                print(f"[-] ID {current_id}: 404 Not Found (consecutive: {consecutive_404})")
                current_id += 1
                continue

            if response.status_code != 200:
                print(f"[!] ID {current_id}: Unexpected status code {response.status_code}")
                consecutive_404 = 0
                current_id += 1
                continue

            # Reset consecutive 404 on successful response
            consecutive_404 = 0
            title, pub_date, markdown_content = BrunchMarkdownConverter.convert(response.text, url)

            # Date check
            if pub_date:
                if pub_date < start_date:
                    print(f"[ ] ID {current_id}: Skipped (Written on {pub_date}, before {start_date})")
                elif pub_date > end_date:
                    print(f"[ ] ID {current_id}: Skipped (Written on {pub_date}, after {end_date})")
                else:
                    # Within target range
                    safe_title = self.clean_filename(title)
                    filename = f"{current_id}_{safe_title}.md"
                    filepath = os.path.join(output_dir, filename)

                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(markdown_content)

                    print(f"[+] ID {current_id}: Saved! '{filename}' (Date: {pub_date})")
                    saved_count += 1
            else:
                # Save anyway if date cannot be parsed to avoid missing data
                print(f"[!] ID {current_id}: Warning: Date could not be determined. Saving '{title}' anyway.")
                safe_title = self.clean_filename(title)
                filename = f"{current_id}_{safe_title}.md"
                filepath = os.path.join(output_dir, filename)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(markdown_content)
                saved_count += 1

            time.sleep(self.delay)
            current_id += 1

        print(f"\n[*] Finished. Successfully processed and saved {saved_count} articles.")
        return saved_count


def main():
    parser = argparse.ArgumentParser(
        description="Crawls a Brunch blog and saves posts as beautiful Markdown files."
    )
    parser.add_argument(
        "--author",
        type=str,
        default="drbrooks",
        help="Brunch author ID (e.g., 'drbrooks' for brunch.co.kr/@drbrooks)"
    )
    parser.add_argument(
        "--start-date",
        type=str,
        default="2025-12-14",
        help="Start date in YYYY-MM-DD format (default: '2025-12-14')"
    )
    parser.add_argument(
        "--end-date",
        type=str,
        default="2026-05-17",
        help="End date in YYYY-MM-DD format (default: '2026-05-17')"
    )
    parser.add_argument(
        "--start-id",
        type=int,
        default=164,
        help="Starting post ID (default: 164)"
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="./brunch_articles",
        help="Directory to save Markdown files (default: './brunch_articles')"
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.5,
        help="Delay in seconds between requests to be polite (default: 0.5)"
    )

    args = parser.parse_args()

    # Parse dates
    try:
        start_date = datetime.strptime(args.start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(args.end_date, "%Y-%m-%d").date()
    except ValueError as e:
        print(f"[!] Date format error: {e}. Please use YYYY-MM-DD.")
        sys.exit(1)

    scraper = BrunchScraper(author_id=args.author, delay=args.delay)
    
    # Resolve relative paths relative to current execution context
    output_path = os.path.abspath(args.output_dir)

    try:
        scraper.scrape_by_id_range(
            start_id=args.start_id,
            start_date=start_date,
            end_date=end_date,
            output_dir=output_path
        )
    except KeyboardInterrupt:
        print("\n[!] Execution interrupted by user.")
        sys.exit(1)


if __name__ == "__main__":
    main()
