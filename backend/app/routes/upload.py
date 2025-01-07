from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from tuspy import TusServer
from pathlib import Path
import os

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = os.path.join(BASE_DIR, "temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

tus_server = TusServer(
    data_dir=str(UPLOAD_DIR),
    upload_url="/upload",
    allow_extensions=['.pdf'],
    max_size=500 * 1024 * 1024  # 500MB limit
)

@router.post("/upload")
async def handle_upload(request):
    try:
        response = await tus_server.handle_request(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# # Optional: Endpoint to check upload status
# @router.get("/upload/{upload_id}")
# async def check_upload_status(upload_id: str):
#     try:
#         status = tus_server.get_upload_status(upload_id)
#         return {"status": status}
#     except Exception as e:
#         raise HTTPException(status_code=404, detail="Upload not found")

# # Optional: Cleanup endpoint
# @router.delete("/upload/{upload_id}")
# async def delete_upload(upload_id: str):
#     try:
#         tus_server.delete_upload(upload_id)
#         return {"message": "Upload deleted successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=404, detail="Upload not found")