from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db  
from app.utilities.business_logic.personality_service import PersonalityService
from app.utilities.business_logic.jwt_service import JWTService
from pydantic import BaseModel


router = APIRouter()
jwt = JWTService()

# Assume jawabannya kek: {"Learning Style": "Simple", "Interest": "Football", "Personality": "Introvert"}
class PersonalityRequest(BaseModel):
    personality: dict

@router.get("/first-login")
def check_first_login(request: Request, db: Session = Depends(get_db), auth_data: dict = Depends(jwt.verify_token)):
    user_id = auth_data.get("sub")
    login_service = PersonalityService(db)
    return login_service.check_first_login(user_id)

@router.post("/push-student-personality")
def push_student_personality(request: PersonalityRequest, db: Session = Depends(get_db), auth_data: dict = Depends(jwt.verify_token)):
    user_id = auth_data.get("sub")
    personality_service = PersonalityService(db)
    return personality_service.push_student_personality(user_id, request.personality)