from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from typing import Annotated
from fastapi import Depends as Depend
from sqlalchemy.orm import Session

DATABASE_URL = "mysql+pymysql://root:@localhost/dimensionnement_gsm?charset=utf8mb4"

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
try:
    conn= engine.connect()
    print("Database connection successful!")
except Exception as e:
    print(f"Error connecting to the database: {e}")

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depend(get_db)]