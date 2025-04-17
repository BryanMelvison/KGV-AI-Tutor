from app.utilities.chapter import ChapterService
from app.database import get_db
db = get_db()
chapter = ChapterService(db)
print(chapter.get_chapter_number("4", "1"))
