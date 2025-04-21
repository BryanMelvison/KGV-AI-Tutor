from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, exercise_route, chapter_route, login_route, student_route, message_generation_route, chat_session_route, personality_route

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
api_router.include_router(message_generation_route.router, prefix="/chat", tags=["chat"])
api_router.include_router(exercise_route.router, prefix="/exercise", tags=["exercise"])
api_router.include_router(login_route.router, prefix="/login", tags=["login"])
api_router.include_router(chapter_route.router, prefix="/chapter", tags=["chapter"])
api_router.include_router(student_route.router, prefix="/student", tags=["student"])
api_router.include_router(chat_session_route.router, prefix="/chat", tags=["chat"])
api_router.include_router(personality_route.router, prefix="/personality", tags=["personality"])


app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}

@app.get("/cors-test")
def cors_test():
    return {"message": "CORS is working!"}