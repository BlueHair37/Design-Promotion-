
import pandas as pd
import os

BASE_DIR = r"c:\Users\kang\Desktop\디자인진흥원 v1\busan_data"
FILE_PUBLIC = "2차진단_일반인_251210.xlsx"

path = os.path.join(BASE_DIR, FILE_PUBLIC)
df = pd.read_excel(path)

print(f"Total Rows: {len(df)}")
print("\n--- Inspecting First 10 Rows ---")
# Select relevant columns
cols = ['진단지역', '대분류', '중분류', '리뷰']
subset = df[cols].head(10)
print(subset.to_string())

print("\n--- Searching for '서면' in dataset ---")
seomyeon_rows = df[
    df['진단지역'].astype(str).str.contains('서면') | 
    df['리뷰'].astype(str).str.contains('서면') |
    df['중분류'].astype(str).str.contains('서면')
]
print(f"Rows containing '서면': {len(seomyeon_rows)}")
if len(seomyeon_rows) > 0:
    print(seomyeon_rows[['진단지역', '리뷰', '중분류']].head(5).to_string())
