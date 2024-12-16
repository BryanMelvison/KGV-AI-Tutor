# clear_chat_history.py
import sys
import os
from pathlib import Path

# Get the absolute path to the backend directory
backend_dir = str(Path(__file__).resolve().parents[3])
sys.path.append(backend_dir)

from app.models import ChatHistory
from app.database import get_db

def clear_chat_history():
    try:
        # Get database session using your existing get_db function
        db = next(get_db())

        # Delete all records
        deleted_count = db.query(ChatHistory).delete()
        db.commit()

        print(f"Successfully deleted {deleted_count} records from chat_history table")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_chat_history()