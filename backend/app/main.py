from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models.base import Base
from app.routes import chat
from app.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="KGV AI TUTOR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix=settings.API_V1_PREFIX, tags=["chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}