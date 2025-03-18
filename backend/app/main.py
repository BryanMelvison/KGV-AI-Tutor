from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload
from app.routes import message_generation

app = FastAPI(title="KGV AI TUTOR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(message_generation.router, prefix="/chat", tags=["chat"])


@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}

