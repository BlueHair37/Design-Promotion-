
import pandas as pd
import os

BASE_DIR = r"c:\Users\kang\Desktop\디자인진흥원 v1\busan_data"
FILE_PUBLIC = "2차진단_일반인_251210.xlsx"

path = os.path.join(BASE_DIR, FILE_PUBLIC)
df = pd.read_excel(path)

print("\n--- Searching for '부산역' (Busan Station) in dataset ---")
# Check multiple columns
keywords = ['부산역', '초량']
matches = df[
    df['진단지역'].astype(str).str.contains('|'.join(keywords)) | 
    df['리뷰'].astype(str).str.contains('|'.join(keywords))
]

print(f"Rows containing '부산역' or '초량': {len(matches)}")
if len(matches) > 0:
    print(matches[['진단지역', '위도', '경도']].head(10).to_string())
    print("\nLat Stats:")
    print(matches['위도'].describe())
