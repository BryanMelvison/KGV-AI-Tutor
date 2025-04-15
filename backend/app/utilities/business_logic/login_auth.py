from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import Users 
from app.utilities.business_logic.jwt_service import JWTService
import datetime
from app.utilities.business_logic.token_blacklist import TokenBlacklist


class LoginService:
    def __init__(self, db: Session):
        self.db = db
        self.jwt_service = JWTService()

    def verify_user(self, email: str, password: str):
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
            "email": user.email,
            "role": str(user.role.roleName),
        }
        # Generate access token
        access_token = self.jwt_service.create_access_token(token_data)
        # Generate refresh token
        refresh_token = self.jwt_service.create_refresh_token(token_data)

        print({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "role": user.role.roleName,
            "displayName": user.displayName,
            "id": user.id,
        })

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "role": user.role.roleName,
            "displayName": user.displayName,
            "id": user.id,
        }

    def refresh_token(self, refresh_token_str: str):
            # Validate a refresh token and issue new access and refresh tokens
            try:
                # Verify the refresh token
                payload = self.jwt_service.verify_token(refresh_token_str, self.db)
                
                # Verify this is a refresh token
                if not payload.get("token_type") == "refresh":
                    raise HTTPException(status_code=401, detail="Invalid token type")
                
                # Blacklist the used refresh token to prevent replay attacks
                blacklist = TokenBlacklist(self.db)
                expiry = datetime.datetime.fromtimestamp(payload["exp"])
                blacklist.blacklist_token(refresh_token_str, expiry)
                
                # Create new token data
                token_data = {
                    "sub": payload["sub"],
                    "email": payload["email"],
                    "role": payload["role"],
                }
                
                # Generate new access token
                access_token = self.jwt_service.create_access_token(token_data)
                
                # Generate new refresh token (token rotation)
                new_refresh_token = self.jwt_service.create_refresh_token(token_data)
                
                return {
                    "access_token": access_token,
                    "refresh_token": new_refresh_token,
                    "token_type": "bearer"
                }
            except HTTPException as e:
                # Re-raise HTTP exceptions
                raise e
            except Exception as e:
                # Log the error for debugging
                print(f"Refresh token error: {str(e)}")
                raise HTTPException(status_code=500, detail="Error refreshing token")
    
    def logout(self, auth_header: str):
        # Logout a user by blacklisting their token
        try:
            # Validate the authorization header
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="Invalid authentication credentials")
                
            token = auth_header.split(" ")[1]
            
            # Verify the token
            payload = self.jwt_service.verify_token(token, self.db)
            
            # Get token expiry
            expiry = datetime.datetime.fromtimestamp(payload["exp"])
            
            # Blacklist the token
            blacklist = TokenBlacklist(self.db)
            blacklist.blacklist_token(token, expiry)
            
            return {"message": "Successfully logged out"}
        except HTTPException as e:
            # Re-raise HTTP exceptions
            raise e
        except Exception as e:
            # Log the error
            print(f"Logout error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error during logout")