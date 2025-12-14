
import pandas as pd
import os

BASE_DIR = r"c:\Users\kang\Desktop\디자인진흥원 v1\busan_data"
FILE_PUBLIC = "2차진단_일반인_251210.xlsx"

path = os.path.join(BASE_DIR, FILE_PUBLIC)
try:
    df = pd.read_excel(path)
    print("Unique District Names:", df['진단지역'].unique())
except Exception as e:
    print(e)
