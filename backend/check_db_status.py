from database import SessionLocal
import models
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

db = SessionLocal()
try:
    person_count = db.query(models.Persona).count()
    insight_count = db.query(models.DistrictInsight).count()
    analysis_count = db.query(models.DistrictAnalysis).count()
    print(f"Personas: {person_count}")
    print(f"Insights: {insight_count}")
    print(f"Analysis: {analysis_count}")
finally:
    db.close()
