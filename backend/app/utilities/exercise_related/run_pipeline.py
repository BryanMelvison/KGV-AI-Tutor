import subprocess
import os
from pathlib import Path

def run_script(script_name: str) -> bool:
    """Run a Python script and return True if successful."""
    try:
        print(f"\n{'='*50}")
        print(f"Running {script_name}...")
        print(f"{'='*50}")
        
        result = subprocess.run(
            ['python3', '-m', f'app.utilities.exercise_related.{script_name}'],
            check=True,
            cwd=Path(__file__).parent.parent.parent.parent
        )
        
        if result.returncode == 0:
            print(f"\n✅ {script_name} completed successfully!")
            return True
        else:
            print(f"\n❌ {script_name} failed with return code {result.returncode}")
            return False
            
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error running {script_name}: {str(e)}")
        return False

def main():
    # Pipeline steps in order
    steps = [
        'syllabus_to_db',
        'learning_objective_to_db',
        'populate_exercise',
        'qna_generation',
        'student_attempt_mastery'
    ]
    
    print("Starting pipeline execution...\n")
    
    for step in steps:
        if not run_script(step):
            print(f"\n❌ Pipeline failed at step: {step}")
            break
    else:
        print("\n✅ Exercise Pipeline completed successfully!")

if __name__ == "__main__":
    main()