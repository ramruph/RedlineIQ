import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_database():
    database = SessionLocal()

    try:
        yield database
    finally:
        database.close()

# Helper function to execute query on multiple rows and return list of dicts
def find_all(database: Session, sql: str, params: dict | None = None):
    if params is None:
        params = {}

    result = database.execute(text(sql), params)
    result_dicts = [dict(row) for row in result.mappings().all()]
    return result_dicts


# Helper function to execute query on single row and return dict
def find_one(database: Session, sql: str, params: dict | None = None):
    if params is None:
        params = {}
    result = database.execute(text(sql), params)

    row = result.mappings().first()

    response = dict(row) if row else None
    return response

# Helper function to execute INSERT/UPDATE/DELETE queries
def execute_sql(database: Session, sql: str, params: dict | None = None) -> None:

    if params is None:
        params = {}
    database.execute(text(sql), params)
    database.commit()
