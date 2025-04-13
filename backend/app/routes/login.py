from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db  
from app.models import Users 
from pydantic import BaseModel

router = APIRouter()

class MessageRequest(BaseModel):
    email: str
    password: str

@router.post("/verify")
def verify_account(request: MessageRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(Users).filter_by(email=request.email).first()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        result = db.execute(
            text("SELECT crypt(:plain_password, :hashed_password) = :hashed_password"),
            {
                'plain_password': request.password,
                'hashed_password': user.password
            }
        )
        is_valid = result.scalar()
        if is_valid:
            return {
                "status": "success",
                "message": "Login successful",
                "role": user.role.roleName,  # Assuming roleName is the name of the role
                "displayName": user.displayName
            }
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid credentials")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

