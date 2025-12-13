from database import SessionLocal
from models import DistrictAnalysis, Persona

def check():
    db = SessionLocal()
    count_analysis = db.query(DistrictAnalysis).filter_by(year='2026').count()
    count_personas = db.query(Persona).filter_by(year='2026').count()
    print(f"Analysis 2026 Count: {count_analysis}")
    print(f"Personas 2026 Count: {count_personas}")
    db.close()

if __name__ == "__main__":
    check()
