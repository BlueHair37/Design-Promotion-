
from database import SessionLocal
from models import DistrictInsight
from sqlalchemy import func

db = SessionLocal()

# Count total
total = db.query(DistrictInsight).count()
print(f"Total Insights: {total}")

# Group by District Code
print("\n--- Insights by District Code ---")
counts = db.query(DistrictInsight.district_code, func.count(DistrictInsight.id)).group_by(DistrictInsight.district_code).all()
for code, count in counts:
    print(f"Code: {code}, Count: {count}")

db.close()
