from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import Users 
from app.utilities.business_logic.jwt_service import JWTService

class LoginService:
    def __init__(self, db: Session):
        self.db = db
        self.jwt_service = JWTService()

    def verify_user(self, email: str, password: str):
        try: 
            user = self.db.query(Users).filter_by(email=email).first()
            if not user:
                raise HTTPException(status_code=400, detail="Invalid credentials")
            
            result = self.db.execute(
                text("SELECT crypt(:plain_password, :hashed_password) = :hashed_password"),
                {
                    'plain_password': password,
                    'hashed_password': user.password
                }
            )
            is_valid = result.scalar()
            if not is_valid:
                raise HTTPException(status_code=400, detail="Invalid credentials")
            # Create token data
            token_data = {
                "sub": str(user.id),
                "role": str(user.role.roleName),
            }
            # Generate access token
            access_token = self.jwt_service.create_access_token(token_data)
            return {
                "access_token": access_token,
                "token_type": "bearer",
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_user_name(self, user_id: str):
        try:
            user = self.db.query(Users).filter_by(id=user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user.displayName
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))