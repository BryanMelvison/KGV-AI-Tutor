from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db  
from pydantic import BaseModel
from app.utilities.business_logic.login_auth import LoginService
from app.utilities.business_logic.jwt_service import JWTService

router = APIRouter()
jwt = JWTService()

class MessageRequest(BaseModel): # Pindah ke Pydantic
    email: str
    password: str

@router.post("/verify")
def verify_account(request: MessageRequest, db: Session = Depends(get_db)):
    login_service = LoginService(db)
    return login_service.verify_user(request.email, request.password)

@router.get("/user-name")
def get_user_name(request: Request, db: Session = Depends(get_db), auth_data: dict = Depends(jwt.verify_token)):
    user_id = auth_data.get("sub")
    login_service = LoginService(db)
    return login_service.get_user_name(user_id)

@router.get("/user-role")
def get_user_name(request: Request, auth_data: dict = Depends(jwt.verify_token)):
    return auth_data.get("role")