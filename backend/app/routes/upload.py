from fastapi import Request, HTTPException, APIRouter
import aiofiles
from pathlib import Path
import os
from uuid import uuid4

router = APIRouter()

APP_DIR = Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = APP_DIR / 'tempStorage'
MAX_FILE_SIZE = 1024 * 1024 * 400  # 400MB

@router.post('/')
async def upload(request: Request):
    if 'filename' not in request.headers:
        raise HTTPException(status_code=400, detail='Filename header is required')
    
    filename = os.path.basename(request.headers['filename'])
    if not filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Only PDF files are allowed')   

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    unique_id = str(uuid4())
    upload_dir = UPLOAD_FOLDER / unique_id
    os.makedirs(upload_dir, exist_ok=True) 
    saved_file_path = upload_dir / filename

    try:
        current_size = 0
        async with aiofiles.open(saved_file_path, 'wb') as f:
            async for chunk in request.stream():
                current_size += len(chunk)
                if current_size > MAX_FILE_SIZE:
                    raise HTTPException(status_code=400, detail='File size exceeds 400MB')
                await f.write(chunk)
    except IOError as e:
        raise HTTPException(status_code=500, detail=f'File write error: {str(e)}')
    except Exception as e:
        if upload_dir.exists():
            import shutil
            shutil.rmtree(upload_dir)
        raise HTTPException(status_code=500, detail=f'Error: {str(e)}')
    
    return {
        "message": "Successfully uploaded file",
        "filename": filename,
        "path": str(saved_file_path),
        "id": unique_id
    }