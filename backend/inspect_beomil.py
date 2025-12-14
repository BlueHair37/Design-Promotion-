
import pandas as pd
import os

BASE_DIR = r"c:\Users\kang\Desktop\디자인진흥원 v1\busan_data"
FILE_PUBLIC = "2차진단_일반인_251210.xlsx"

path = os.path.join(BASE_DIR, FILE_PUBLIC)
df = pd.read_excel(path)

print("\n--- Searching for '범일' (Beomil) or '부산역' (Busan Station) in dataset ---")
# Check multiple columns
keywords = ['범일', '부산역']
for kw in keywords:
    matches = df[
        df['진단지역'].astype(str).str.contains(kw) | 
        df['리뷰'].astype(str).str.contains(kw) |
        df['중분류'].astype(str).str.contains(kw)
    ]
    print(f"Rows containing '{kw}': {len(matches)}")
    if len(matches) > 0:
        print(matches[['진단지역', '위도', '경도']].head(5).to_string())
        # Print lat/lng stats
        print(f"Lat Range: {matches['위도'].min()} - {matches['위도'].max()}")

