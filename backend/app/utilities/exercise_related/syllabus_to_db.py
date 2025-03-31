import re
from pathlib import Path
from app.database import get_session, init_db, Base, engine
from app.models import Syllabus

Syllabus.__table__.drop(engine, checkfirst=True)
init_db()

current_dir = Path(__file__).parent
syllabus_file = current_dir / 'syllabus_clean.txt'

with open(syllabus_file, 'r') as file:
    syllabus_text = file.read()

current_topic_id = None
current_topic_name = None
current_subtopic_id = None
current_subtopic_name = None
current_category = None

session = get_session()

try:
    for line in syllabus_text.splitlines():
        line = line.strip()
        if not line:
            continue

        # Match Topic (e.g., "1 The nature and variety of living organisms")
        topic_match = re.match(r'^(\d+)\s+(.+)$', line)
        if topic_match:
            current_topic_id = int(topic_match.group(1))
            current_topic_name = topic_match.group(2)
            current_subtopic_id = None
            current_subtopic_name = None
            current_category = None
            continue

        # Match Subtopic (e.g., "(a) Characteristics of living organisms")
        subtopic_match = re.match(r'^\((\w)\)\s+(.+)$', line)
        if subtopic_match:
            current_subtopic_id = subtopic_match.group(1)
            current_subtopic_name = subtopic_match.group(2)
            current_category = None
            continue

        # Match Category (e.g., "Flowering plants" or "Humans" - indented, no number)
        category_match = re.match(r'^([A-Z][a-z]+(?:\s+[a-z]+)*)$', line)
        if category_match and not re.match(r'^\d+\.\d+', line):
            current_category = category_match.group(1)
            continue

        # Match Statement (e.g., "1.1 understand how living organisms share...")
        statement_match = re.match(r'^(\d+\.\d+)\s+(.+)$', line)
        if statement_match:
            statement_code = statement_match.group(1)
            statement_text = statement_match.group(2)

            syllabus_entry = Syllabus(
                topic_id=current_topic_id,
                topic_name=current_topic_name,
                subtopic_id=current_subtopic_id,
                subtopic_name=current_subtopic_name,
                subtopic_category=current_category,
                statement_code=statement_code,
                statement_text=statement_text
            )
            session.add(syllabus_entry)

    session.commit()
    print("Syllabus data successfully inserted into the database!")

except Exception as e:
    print(f"Error inserting data: {e}")
    session.rollback()

finally:
    session.close()