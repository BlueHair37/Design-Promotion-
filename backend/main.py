from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="부산시 지능형 공공디자인 통합 진단 플랫폼 API")

# CORS 설정
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from . import models, database
from .routers import auth, dashboard, ai

@app.on_event("startup")
def startup_event():
    print("Startup: Creating tables...")
    models.Base.metadata.create_all(bind=database.engine)
    print("Startup: Tables created.")

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(ai.router)
