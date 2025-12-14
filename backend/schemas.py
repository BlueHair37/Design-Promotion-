from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class DistrictAnalysisBase(BaseModel):
    district_code: str
    year: str
    housing_score: float
    env_score: float
    transport_score: float
    safety_score: float
    culture_score: float
    industry_score: float
    welfare_score: float
    education_score: float

class DistrictAnalysis(DistrictAnalysisBase):
    id: int
    class Config:
        orm_mode = True

class InsightBase(BaseModel):
    district_code: str
    year: str
    type: str
    title: str
    description: str
    icon: Optional[str] = None
    image_url: Optional[str] = None
    severity: Optional[str] = None
    date: Optional[str] = None
    proposer: Optional[str] = None
    latitude: float
    longitude: float
    category: Optional[str] = None

class Insight(InsightBase):
    id: int
    class Config:
        orm_mode = True

class PersonaBase(BaseModel):
    district_code: str
    year: str
    name: str
    age: int
    gender: Optional[str] = None
    job: str
    image_emoji: str
    quote: str
    full_quote: str
    tags: List[str] = []
    pain_points: List[str] = []
    suggestions: List[str] = []
    expected_effects: List[str] = []
    stats: Dict[str, Any] = {}

class Persona(PersonaBase):
    id: int
    class Config:
        orm_mode = True

# Dashboard Response Models
class DashboardSummary(BaseModel):
    score: float
    grade: str
    trend: str

class AnalysisChartData(BaseModel):
    name: str # district name
    housing: float
    env: float
    transport: float
    safety: float
    # ... extensible
