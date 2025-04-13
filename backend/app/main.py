from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, message_generation, exercise_route, login

app = FastAPI(title="KGV AI TUTOR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api_router = APIRouter(prefix="/api")
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(message_generation.router, prefix="/chat", tags=["chat"])
api_router.include_router(exercise_route.router, prefix="/exercise", tags=["exercise"])
api_router.include_router(login.router, prefix="/login", tags=["login"])

app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}
