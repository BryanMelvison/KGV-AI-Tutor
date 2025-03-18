from fastapi import APIRouter, Request, HTTPException, UploadFile, File, Form
from pathlib import Path
import os
from uuid import uuid4
import aiofiles
import json
import app.utilities.pdfparser as parser

router = APIRouter()

APP_DIR = Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = APP_DIR / 'temp_storage'
MAX_FILE_SIZE = 1024 * 1024 * 400  # 400MB

@router.post("/")
async def upload(
    request: Request,
    file: UploadFile = File(None),          
    json_data: str = Form(None)               
):
    # 1. Handle JSON data part.
    parsed_json = {}
    if json_data:
        try:
            parsed_json = json.loads(json_data)
        except Exception as e:
            raise HTTPException(400, detail=f"Invalid JSON data: {str(e)}")

    # 2. Handle PDF file part with chunking logic.
    if file is not None:
        filename = file.filename
        # Check if content is not PDF
        if not filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Create the upload directory
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        unique_id = str(uuid4())
        upload_dir = UPLOAD_FOLDER / unique_id
        os.makedirs(upload_dir, exist_ok=True)
        saved_file_path = upload_dir / filename

        try:
            current_size = 0
            chunk_size = 1024 * 1024  # 1 MB chunk size

            # Read the file in chunks from the UploadFile object
            async with aiofiles.open(saved_file_path, 'wb') as out_file:
                while True:
                    chunk = await file.read(chunk_size)
                    if not chunk:
                        break

                    current_size += len(chunk)
                    if current_size > MAX_FILE_SIZE:
                        # Clean up if file is too large
                        if upload_dir.exists():
                            import shutil
                            shutil.rmtree(upload_dir)
                        raise HTTPException(
                            status_code=400, 
                            detail="File size exceeds 400MB"
                        )
                    
                    await out_file.write(chunk)

        except IOError as e:
            # File write error
            raise HTTPException(
                status_code=500,
                detail=f"File write error: {str(e)}"
            )
        except Exception as e:
            # Clean up if anything else fails
            if upload_dir.exists():
                import shutil
                shutil.rmtree(upload_dir)
            raise HTTPException(
                status_code=500,
                detail=f"Error: {str(e)}"
            )
        finally:
            # At this point, we have fully saved the PDF, and we will now parse it using the PDFParser class. 
            # async function: get_structured_content
            structured_content = await parser.get_structured_content(saved_file_path)
            # Clean up the uploaded file
            if upload_dir.exists():
                import shutil
                shutil.rmtree(upload_dir)
    
        return {
            "message": "Successfully uploaded Textbook PDF file and Textbook Information.",
            "filename": filename,
            "id": unique_id,
            "parsed_json": parsed_json
        }

