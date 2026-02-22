import requests
import re
import json

def test_scrape():
    query = "iphone"
    url = f"https://www.aliexpress.com/wholesale?SearchText={query}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }
    
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            content = response.text
            print(f"Content Length: {len(content)}")
            
            # Check for common blocking messages
            if "captcha" in content.lower() or "login" in content.lower():
                print("Possible blocking/captcha detected.")
            
            # Try to find product data
            # AliExpress often puts data in window.runParams or similar
            match = re.search(r'window\.runParams\s*=\s*({.*?});', content, re.DOTALL)
            if match:
                print("Found window.runParams!")
                # It might be huge and complex JSON, but let's see
            else:
                print("Did not find window.runParams.")
                
            # Try to find a price or title
            if "price" in content.lower():
                print("Found 'price' keyword in content.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_scrape()
