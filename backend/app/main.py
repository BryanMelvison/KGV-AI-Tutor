from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, message_generation, exercise_route

app = FastAPI(title="KGV AI TUTOR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 Declare a parent router with global prefix `/api`
api_router = APIRouter(prefix="/api")

# 👇 Include your individual routers inside it
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(message_generation.router, prefix="/chat", tags=["chat"])
api_router.include_router(exercise_route.router, prefix="/exercise", tags=["exercise"])

# 👇 Mount the API router to the app
app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}
