# Backend (FastAPI + MariaDB)

## Quick start
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your MariaDB credentials
uvicorn main:app --reload --port 8000
```

## Environment
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Schema
The app creates tables at startup if they do not exist:
- `users (id, name, email, password, created_at)`
- `petitions (id, title, status, signatures, tag, due, created_at)`

## API
- `GET /health` — basic health check
- `POST /users/signup` — `{name, email, password}` -> create user
- `POST /users/login` — `{email, password}` -> returns user data on success
- `GET /petitions` — list latest petitions
- `POST /petitions` — create a petition

For production, replace plain password storage with hashed passwords and add auth tokens (JWT/session).
