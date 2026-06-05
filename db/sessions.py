from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

"""
This layer isolates all DB connection logic.

You will reuse get_db() in FastAPI endpoints later.
"""

engine = create_engine(
    settings.database_url,
    echo=False,
    future=True)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()