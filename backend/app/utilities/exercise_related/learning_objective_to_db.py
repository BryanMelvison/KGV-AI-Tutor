import re
from pathlib import Path
from fuzzywuzzy import fuzz
from nltk.stem import WordNetLemmatizer
import nltk
nltk.download('wordnet')
from app.database import get_session, engine, Base
from app.models import Syllabus, LearningObjective

Base.metadata.tables['learning_objectives'].create(engine)

current_dir = Path(__file__).parent
CHAPTER_FOLDER = current_dir.parent / "book" 

lemmatizer = WordNetLemmatizer() # for a better word matching

def extract_words(text):
    cleaned_text = re.sub(r'[^\w\s]', '', text.lower())
    words = cleaned_text.split()
    words = [lemmatizer.lemmatize(word) for word in words]
    return set(words)

# tagging function with ranking system
def tag_objective(objective, syllabus_entries):
    obj_words = extract_words(objective)
    obj_word_count = len(obj_words)
    potential_matches = []
    
    for entry in syllabus_entries:
        syllabus_words = extract_words(entry.statement_text)
        
        matching_words = obj_words.intersection(syllabus_words)
        match_count = len(matching_words)
        match_percentage = (match_count / obj_word_count) * 1000
        potential_matches.append({
            'entry': entry,
            'match_percentage': match_percentage
        })
    
    potential_matches.sort(key=lambda x: x['match_percentage'], reverse=True)
    
    tags = []
    id = []
    if potential_matches:
        top_percentage = potential_matches[0]['match_percentage']
        
        for match in potential_matches:
            if match['match_percentage'] >= top_percentage:
                tags.append(match['entry'].statement_code)
                id.append(match['entry'].id)
    return tags, id if tags else None

session = get_session()
syllabus_entries = session.query(Syllabus).all()
session.close()

try:
    session = get_session()

    for chapter_file in CHAPTER_FOLDER.iterdir():
        if chapter_file.suffix == '.txt':
            chapter_num = int(re.search(r'chapter_(\d+)', chapter_file.name).group(1))
            with open(chapter_file, 'r') as f:
                lines = f.readlines()

            # find "LEARNING OBJECTIVES" section
            for i, line in enumerate(lines):
                if re.search(r'learning\s+objectives?', line.strip(), re.IGNORECASE):
                    for j in range(1, 4): # look at the next 3 lines for statements
                        if i + j < len(lines):
                            next_line = lines[i + j].strip()
                            if next_line.startswith('-'):
                                objectives = []
                                for k in range(i + j, len(lines)):
                                    line_k = lines[k].strip()
                                    if line_k.startswith('-'):
                                        objectives.append(line_k[1:].strip())
                                    elif line_k and not line_k.startswith('#'):  # stop at next section or empty line
                                        break
                                break

                    # process each objective and tag them with syllabus codes
                    for objective in objectives:
                        tags, id = tag_objective(objective, syllabus_entries)
                        
                        ### manual mapping due to noise in syllabus
                        if objective == "Understand the characteristics shared by living organisms": 
                            tags = ['1.1']
                            id = [1]
                        if objective == "Describe the features common to viruses and recognise examples such as the influenza virus, the HIV virus and the tobacco mosaic virus": 
                            tags = ['1.4']
                            id = [4]
                        if objective == "Understand the difference between eukaryotic and prokaryotic organisms": 
                            tags = ['1.2', '1.3']
                            id = [2, 3]
                        ###            
                        
                        entry = LearningObjective(
                            chapter=chapter_num,
                            learning_objective_text=objective,
                            syllabus_tags=tags,
                            syllabus_ids= id
                        )
                        session.add(entry)
                    break 

    session.commit()
    print("Learning objectives inserted successfully!")

except Exception as e:
    print(f"Error: {e}")
    session.rollback()

finally:
    session.close()