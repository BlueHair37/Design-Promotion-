import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/dashboard"

def check(endpoint, params):
    try:
        url = f"{BASE_URL}/{endpoint}"
        print(f"Checking {url} with {params}...")
        resp = requests.get(url, params=params)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            print(f"Count: {len(data)}")
            if len(data) > 0:
                print("First Item Sample:", json.dumps(data[0], ensure_ascii=False)[:200])
            else:
                print("EMPTY RESPONSE")
        else:
            print("ERROR RESPONSE:", resp.text)
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    check("personas", {"year": "2026", "district": "all"})
    check("insights", {"year": "2026", "district": "all"})
    check("analysis", {"year": "2026", "district": "all"})
