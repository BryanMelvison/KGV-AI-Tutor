from datetime import datetime, timedelta
import jwt
from fastapi import HTTPException
from app.config import Settings
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


class JWTService:
    def __init__(self):
        self.secret_key = Settings().ENCRYPTION_KEY
        self.algorithm = Settings().ENCRYPT_ALGORITHM

    def create_access_token(self, data: dict, expires_delta: timedelta = timedelta(minutes=30)):
        try: 
            to_encode = data.copy()
            expire = datetime.utcnow() + expires_delta
            to_encode.update({"exp": expire})
            encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
            return encoded_jwt
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error creating access token")

    def verify_token(self, token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.exceptions.PyJWTError:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
