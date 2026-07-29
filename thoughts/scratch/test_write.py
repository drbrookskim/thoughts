import requests
import os
import subprocess
import sys

def run_test():
    url = "http://127.0.0.1:5050/api/article"
    payload = {
        "title": "자동 검증 테스트 아티클",
        "date": "2026-05-21",
        "category": "AI와 기술",
        "content": "이것은 에이전트 검증용 테스트 본문 내용입니다.",
        "password": "drbrooks123"
    }
    
    print("[*] Sending POST to /api/article...")
    res = requests.post(url, json=payload)
    print(f"[*] Response Status: {res.status_code}")
    print(f"[*] Response JSON: {res.json()}")
    
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    new_id = data["id"]
    filename = data["filename"]
    print(f"[+] Successfully created article with ID {new_id}, filename {filename}")
    
    # 2. Verify articles.json
    print("[*] Verifying articles.json includes new article...")
    res_list = requests.get("http://127.0.0.1:5050/api/articles.json")
    articles = res_list.json()
    found = [a for a in articles if a["id"] == new_id]
    assert len(found) > 0, "New article not found in articles.json"
    assert found[0]["title"] == "자동 검증 테스트 아티클"
    assert found[0]["category"] == "AI와 기술"
    print("[+] Verified in articles.json!")
    
    # 3. Verify article JSON content
    print(f"[*] Verifying article {new_id}.json...")
    res_art = requests.get(f"http://127.0.0.1:5050/api/article/{new_id}.json")
    art_data = res_art.json()
    assert art_data["filename"] == filename
    assert "이것은 에이전트 검증용 테스트 본문 내용입니다." in art_data["content"]
    print("[+] Verified article content JSON!")
    
    # 4. Clean up
    print("[*] Cleaning up created file...")
    filepath = os.path.join("../brunch_articles", filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        print(f"[+] Removed file {filepath}")
    else:
        # try absolute path or relative from root
        filepath = os.path.join("brunch_articles", filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"[+] Removed file {filepath}")
            
    # Rebuild static to clean list
    subprocess.run([sys.executable, "build_static.py"], cwd="..")
    print("[+] Rebuild static completed, system is clean.")

if __name__ == "__main__":
    try:
        run_test()
        print("\n[SUCCESS] All verification tests passed perfectly!")
    except Exception as e:
        print(f"\n[FAILURE] Verification failed: {e}")
        sys.exit(1)
