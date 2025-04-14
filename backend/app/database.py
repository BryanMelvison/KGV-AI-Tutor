from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import Settings
engine = create_engine(Settings().DB_URL, echo=True)
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