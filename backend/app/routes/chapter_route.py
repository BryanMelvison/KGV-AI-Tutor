# from fastapi import APIRouter, HTTPException, Query
# from pydantic import BaseModel
# from app.utilities.chapter import ChapterService

# router = APIRouter()
# chapter_service = ChapterService()

# @router.post("/learning-objective")
# def get_learning_objective(
#     subject: str = Query(..., description="Subject name"),
#     chapter: int = Query(..., description="Chapter number")
# ):
#     try:        
#         response = chapter_service.get_learning_objective(chapter, subject)
#         return response
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # make an api call to get chapter number
# @router.post("/chapter-number")
# def get_chapter_number(
#     chapter: str = Query(..., description="Chapter name")
# ):
#     try:
#         response = chapter_service.get_chapter_number(chapter)
#         return response
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# # make an api call to get all chapter name
# @router.post("/all-chapter-name")
# def get_all_chapter_name(
#     subject: int = Query(..., description="Subject name")
# ):
#     try:
#         response = chapter_service.get_all_chapter_name(subject)
#         return response
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# # make an api call to get all subject number
# @router.post("/subject-number")
# def get_subject_number(
#     subject: str = Query(..., description="Subject name")
# ):
#     try:
#         response = chapter_service.get_subject_number(subject)
#         return response
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException, Query, Depends, Request
from pydantic import BaseModel
from app.utilities.chapter import ChapterService
from app.utilities.business_logic.jwt_service import JWTService
from app.middleware.auth_middleware import AuthMiddleware
from app.database import get_db

router = APIRouter()
jwt_service = JWTService()

# Create auth dependency
auth_handler = AuthMiddleware(jwt_service)

@router.post("/learning-objective")
def get_learning_objective(
    request: Request,
    subject: str = Query(..., description="Subject name"),
    chapter: int = Query(..., description="Chapter number"),
    auth_data: dict = Depends(auth_handler),
    db = Depends(get_db)
):
    # Get user ID from the token
    user_id = auth_data.get("sub")
        
    # Create service with DB session
    chapter_service = ChapterService(db)
        
    # Pass user ID to service method
    response = chapter_service.get_learning_objective(user_id, chapter, subject)
    return response

@router.post("/chapter-number")
def get_chapter_number(
    request: Request,
    chapter: str = Query(..., description="Chapter name"),
    auth_data: dict = Depends(auth_handler),
    db = Depends(get_db)
):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    response = chapter_service.get_chapter_number(user_id, chapter)
    return response

    
@router.post("/all-chapter-name")
def get_all_chapter_name(
    request: Request,
    subject: int = Query(..., description="Subject ID"),
    auth_data: dict = Depends(auth_handler),
    db = Depends(get_db)
):
    user_id = auth_data.get("sub")
    chapter_service = ChapterService(db)
    response = chapter_service.get_all_chapter_name(user_id, subject)
    return response
 
    
@router.post("/subject-number")
def get_subject_number(
    request: Request,
    subject: str = Query(..., description="Subject name"),
    auth_data: dict = Depends(auth_handler),
    db = Depends(get_db)
):
    print("Hi")

    user_id = auth_data.get("sub")
    print("Hi")
    print(user_id)
    chapter_service = ChapterService(db)
    response = chapter_service.get_subject_number(user_id, subject)
    return response
 