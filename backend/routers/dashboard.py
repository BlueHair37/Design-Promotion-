from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)

@router.get("/summary")
def get_dashboard_summary():
    return {
        "status": "Grade B (78.5)",
        "trend": "+3.2% vs last year",
        "alerts": [
            {"id": 1, "type": "safety", "message": "Saha-gu: Steep slope pedestrian risk"},
            {"id": 2, "type": "transport", "message": "Busanjin-gu: Seomyeon intersection congestion"},
            {"id": 3, "type": "environment", "message": "Yeongdo-gu: Aging housing conflict"}
        ]
    }
