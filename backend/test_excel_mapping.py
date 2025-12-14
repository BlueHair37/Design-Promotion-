
import pandas as pd
import os

BASE_DIR = r"c:\Users\kang\Desktop\디자인진흥원 v1\busan_data"
FILE_PUBLIC = "2차진단_일반인_251210.xlsx"

path = os.path.join(BASE_DIR, FILE_PUBLIC)

# Mapping Logic Copy
BUSAN_DISTRICTS = [
    {"id": "21010", "name": "중구"}, {"id": "21020", "name": "서구"}, {"id": "21030", "name": "동구"},
    {"id": "21040", "name": "영도구"}, {"id": "21050", "name": "부산진구"}, {"id": "21060", "name": "동래구"},
    {"id": "21070", "name": "남구"}, {"id": "21080", "name": "북구"}, {"id": "21090", "name": "해운대구"},
    {"id": "21100", "name": "사하구"}, {"id": "21110", "name": "금정구"}, {"id": "21120", "name": "강서구"},
    {"id": "21130", "name": "연제구"}, {"id": "21140", "name": "수영구"}, {"id": "21150", "name": "사상구"},
    {"id": "21310", "name": "기장군"}
]

DISTRICT_MAPPING = {d['name']: d['id'] for d in BUSAN_DISTRICTS}
DISTRICT_MAPPING.update({
    "부산역": "21030", "초량": "21030",
    "서면": "21050", "전포": "21050", "부전": "21050",
    "광안리": "21140", "수영": "21140",
    "해운대": "21090", "센텀": "21090",
    "자갈치": "21010", "남포": "21010",
    "사상": "21150", "덕천": "21080"
})

def get_district_code(raw_name):
    if pd.isna(raw_name): return "21050 (Default)" 
    s = str(raw_name).strip()
    if s in DISTRICT_MAPPING: return f"{DISTRICT_MAPPING[s]} (Match: {s})"
    for name, code in DISTRICT_MAPPING.items():
        if name in s: return f"{code} (Partial: {name} in {s})"
    return f"21050 (Fallback for {s})"

df = pd.read_excel(path)
print(f"Total Rows: {len(df)}")
print("\n--- Sample Mapping Test ---")
for val in df['진단지역'].unique()[:20]:
    print(f"Raw: '{val}' -> Mapped: {get_district_code(val)}")
