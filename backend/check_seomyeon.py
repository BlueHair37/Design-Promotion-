
from database import SessionLocal
from models import DistrictInsight

db = SessionLocal()
# Check for insights with '서면' or '부산진구' in title or address if any
# Also checking specific known problem spots
results = db.query(DistrictInsight).filter(DistrictInsight.title.like('%서면%')).all()

print(f"Found {len(results)} insights with '서면' in title.")
for r in results[:5]:
    print(f"ID: {r.id}, Code: {r.district_code}, Title: {r.title}")

# Check general count for Busanjin-gu code
count_21050 = db.query(DistrictInsight).filter(DistrictInsight.district_code == '21050').count()
print(f"Total records for Code 21050 (Busanjin-gu): {count_21050}")

db.close()
