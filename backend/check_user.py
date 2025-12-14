
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import sys

def check_user():
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == "test_verify@example.com").first()
        if user:
            print(f"User found: {user.username}, {user.email}")
        else:
            print("User NOT found")
    finally:
        db.close()

if __name__ == "__main__":
    check_user()
