from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
load_dotenv()
import os
url = os.getenv('DB_URL')
engine = create_engine(url, echo=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base() # for SQLAlchemy ORM models

def init_db():
    Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_session():
    return SessionLocal()