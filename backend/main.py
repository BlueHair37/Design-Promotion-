import os
from typing import List, Optional

import pymysql
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

load_dotenv()


def get_db_connection():
  connection = pymysql.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "civic_portal"),
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True,
  )
  return connection


app = FastAPI(title="Civic Portal API", version="0.1.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


class SignupRequest(BaseModel):
  name: str = Field(..., min_length=2, max_length=80)
  email: EmailStr
  password: str = Field(..., min_length=4, max_length=100)


class LoginRequest(BaseModel):
  email: EmailStr
  password: str


class Petition(BaseModel):
  id: Optional[int] = None
  title: str
  status: str
  signatures: int = 0
  tag: str
  due: str


def ensure_tables():
  with get_db_connection() as conn, conn.cursor() as cur:
    cur.execute(
      """
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(80) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      """
    )
    cur.execute(
      """
      CREATE TABLE IF NOT EXISTS petitions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(40) NOT NULL,
        signatures INT DEFAULT 0,
        tag VARCHAR(40),
        due VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      """
    )


@app.on_event("startup")
def on_startup():
  ensure_tables()


@app.get("/health")
def health():
  return {"status": "ok"}


@app.post("/users/signup")
def signup(body: SignupRequest):
  with get_db_connection() as conn, conn.cursor() as cur:
    cur.execute("SELECT id FROM users WHERE email=%s", (body.email,))
    if cur.fetchone():
      raise HTTPException(status_code=400, detail="Email already exists")
    cur.execute(
      "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
      (body.name, body.email, body.password),
    )
    return {"status": "created", "email": body.email}


@app.post("/users/login")
def login(body: LoginRequest):
  with get_db_connection() as conn, conn.cursor() as cur:
    cur.execute("SELECT id, name, email FROM users WHERE email=%s AND password=%s", (body.email, body.password))
    row = cur.fetchone()
    if not row:
      raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"id": row["id"], "name": row["name"], "email": row["email"]}


@app.get("/petitions", response_model=List[Petition])
def list_petitions():
  with get_db_connection() as conn, conn.cursor() as cur:
    cur.execute("SELECT id, title, status, signatures, tag, due FROM petitions ORDER BY created_at DESC LIMIT 50")
    rows = cur.fetchall()
    return [Petition(**row) for row in rows]


@app.post("/petitions", response_model=Petition)
def create_petition(body: Petition):
  with get_db_connection() as conn, conn.cursor() as cur:
    cur.execute(
      "INSERT INTO petitions (title, status, signatures, tag, due) VALUES (%s, %s, %s, %s, %s)",
      (body.title, body.status, body.signatures, body.tag, body.due),
    )
    cur.execute("SELECT id, title, status, signatures, tag, due FROM petitions WHERE id = LAST_INSERT_ID()")
    row = cur.fetchone()
    return Petition(**row)
