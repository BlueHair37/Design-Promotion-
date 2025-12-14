import pandas as pd
import os

BASE_DIR = r"c:\Users\kang\Desktop\디자인진흥원 v1\busan_data"

def inspect_file(filename, f_out):
    path = os.path.join(BASE_DIR, filename)
    f_out.write(f"--- Inspecting {filename} ---\n")
    try:
        if filename.endswith('.xlsx'):
            df = pd.read_excel(path)
        else:
            try:
                df = pd.read_csv(path, encoding='cp949')
            except:
                df = pd.read_csv(path, encoding='utf-8')
        
        f_out.write(f"Columns: {list(df.columns)}\n")
        f_out.write(f"Head:\n{df.head(2).to_string()}\n")
        f_out.write("\n")
    except Exception as e:
        f_out.write(f"Error reading {filename}: {e}\n\n")

files = [
    "2차진단_일반인_251210.xlsx",
    "2차진단_전문가_251210.xlsx",
    "users_rows.csv",
    "questions_rows.csv",
    "category_rows.csv",
    "criteria_rows.csv"
]

with open("data_preview.txt", "w", encoding="utf-8") as f_out:
    for f in files:
        inspect_file(f, f_out)
