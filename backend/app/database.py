from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import config

engine = create_engine(config.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base() # for SQLAlchemy ORM models

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
