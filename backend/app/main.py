from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, message_generation, exercise_route, chapter_route, login_route, student_route
from contextlib import contextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from app.database import get_db
from app.utilities.business_logic.token_blacklist import TokenBlacklist

app = FastAPI(title="KGV AI TUTOR")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a scheduler instance
scheduler = BackgroundScheduler()

@contextmanager
def get_db_context():
    """Context manager for database sessions"""
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

def cleanup_expired_tokens():
    """Job to clean up expired tokens from the blacklist"""
    with get_db_context() as db:
        blacklist = TokenBlacklist(db)
        tokens_removed = blacklist.cleanup_expired_tokens()
        print(f"Cleaned up {tokens_removed} expired tokens from blacklist")

@app.on_event("startup")
def start_scheduler():
    """Start the scheduler when the application starts"""
    # Run every day at midnight
    scheduler.add_job(cleanup_expired_tokens, 'cron', hour=0, minute=0)
    # For testing, you can also run it on an interval
    # scheduler.add_job(cleanup_expired_tokens, 'interval', minutes=60)
    scheduler.start()
    print("Token cleanup scheduler started")

@app.on_event("shutdown")
def shutdown_scheduler():
    """Shut down the scheduler when the application stops"""
    scheduler.shutdown()
    print("Token cleanup scheduler shut down")


api_router = APIRouter(prefix="/api")
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(message_generation.router, prefix="/chat", tags=["chat"])
api_router.include_router(exercise_route.router, prefix="/exercise", tags=["exercise"])
api_router.include_router(login_route.router, prefix="/login", tags=["login"])
api_router.include_router(chapter_route.router, prefix="/chapter", tags=["chapter"])
api_router.include_router(student_route.router, prefix="/student", tags=["student"])

app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Welcome to KGV AI TUTOR API"}