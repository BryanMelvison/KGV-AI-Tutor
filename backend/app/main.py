from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload
from app.routes import message_generation
from app.routes import exercise_route
from app.routes import login

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
app.include_router(exercise_route.router, prefix="/exercise", tags=["exercise"])
app.include_router(login.router, prefix="/login", tags=["exercise"])


@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}

