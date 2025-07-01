from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

DATABASE_URL = "mysql+pymysql://gsm:passer123@localhost/dimensionnement_gsm"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()
try:
    conn= engine.connect()
    print("Database connection successful!")
except Exception as e:
    print(f"Error connecting to the database: {e}")