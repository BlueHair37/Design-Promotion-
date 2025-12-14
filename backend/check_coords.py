
from database import SessionLocal
from models import DistrictInsight
from sqlalchemy import func

db = SessionLocal()

stats = db.query(
    func.min(DistrictInsight.latitude),
    func.max(DistrictInsight.latitude),
    func.avg(DistrictInsight.latitude),
    func.min(DistrictInsight.longitude),
    func.max(DistrictInsight.longitude),
    func.avg(DistrictInsight.longitude)
).filter(DistrictInsight.district_code == '21030').one()

print("--- Stats for Code 21030 (Dong-gu / Busan Station) ---")
print(f"Lat: Min {stats[0]}, Max {stats[1]}, Avg {stats[2]}")
print(f"Lng: Min {stats[3]}, Max {stats[4]}, Avg {stats[5]}")

# Count points north of 35.14 (likely Busanjin-gu/Seomyeon)
north_count = db.query(DistrictInsight).filter(
    DistrictInsight.district_code == '21030',
    DistrictInsight.latitude > 35.14
).count()
print(f"Points with Lat > 35.14 (Likely Seomyeon/Busanjin): {north_count}")

db.close()
