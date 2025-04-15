from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db  
from pydantic import BaseModel
from app.utilities.business_logic.login_auth import LoginService
from app.utilities.business_logic.jwt_service import JWTService
import datetime

router = APIRouter()

class MessageRequest(BaseModel): # Pindah ke Pydantic
    email: str
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/verify")
def verify_account(request: MessageRequest, db: Session = Depends(get_db)):
    try:
        login_service = LoginService(db)
        return login_service.verify_user(request.email, request.password)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh")
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    login_service = LoginService(db)
    return login_service.refresh_token(request.refresh_token)

@router.post("/logout")
def logout(request: Request, db: Session = Depends(get_db)):
    login_service = LoginService(db)
    auth_header = request.headers.get("Authorization")
    return login_service.logout(auth_header)