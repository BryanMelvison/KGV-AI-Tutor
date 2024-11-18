from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .utilities import ollamaChat
from .database import engine
from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="KGV AI TUTOR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ollamaChat.router, prefix="/api/v1", tags=["chat"]) # nanti prefix diubah" aja

@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}