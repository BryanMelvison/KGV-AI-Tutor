from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import Users, FirstTimeLogin, PersonalityUser
from app.utilities.business_logic.jwt_service import JWTService
from app.models import Role

class PersonalityService:
    def __init__(self, db: Session):
        self.db = db
        self.jwt_service = JWTService()
    
    def _verify_student(self, user_id: str):
        # Check if the user is a student
        user = self.db.query(Users).filter_by(id=user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.role.roleName != Role.STUDENT:
            raise HTTPException(status_code=403, detail="User is not a student")

    def check_first_login(self, user_id: str):
        try:
            # Check if the user is a student & exists in the database
            self._verify_student(user_id)

            first_time_login_record = self.db.query(FirstTimeLogin).filter_by(userId=user_id).first()
            
            if first_time_login_record:
                # Check the current value of firstTimeLogin
                if first_time_login_record.firstTimeLogin:  # Check the actual value (is it True or False)
                    # If firstTimeLogin is True, then change it to False
                    self.db.query(FirstTimeLogin).filter_by(userId=user_id).update({"firstTimeLogin": False}) 
                    self.db.commit() 
                    return {"first_login": True}

            # If first_login is False, or record does not exist
            return {"first_login": False}
 
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    def push_student_personality(self, user_id: str, personality: dict):
        try:
            # Check if the user is a student & exists in the database
            self._verify_student(user_id)

            # Check if the personality data is valid
            if not isinstance(personality, dict):
                raise HTTPException(status_code=400, detail="Invalid personality data format")
            
            # Since the column in the database is an array, we need to convert the dictionary to a string, for each key 
            personality_str = ", ".join(f"{key}: {value}" for key, value in personality.items())

            # Create a new PersonalityUser instance
            personality_user = PersonalityUser(
                userId=user_id,
                personalityType=personality_str 
            )

            # Add the new instance to the session
            self.db.add(personality_user)
            self.db.commit()  

            return {"message": "Personality data updated successfully"}

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))