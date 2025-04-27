# AI Need Help - README

## Description
AI Need Help is an interactive educational platform designed to provide personalized tutoring and learning support for IGCSE Science students. The platform leverages advanced AI technologies, including Retrieval-Augmented Generation (RAG), to enhance student learning experiences through dynamic exercises, quizzes, report generation, and chat functionality.

## Overall Code Structure
The project is organized into the following main directories:

```
/bryanmelvison-kgv-ai-tutor/
├── README.md
├── backend/
│   ├── README.md
│   ├── requirements.txt
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── utilities/
│   │   └── routes/
├── frontend/
│   ├── README.md
│   ├── next.config.ts
│   └── ...
└── ...
```

## Running the Code

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a Conda environment:
   ```bash
   conda create --name ai_need_help python=3.9
   conda activate ai_need_help
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Install Ollama and pull the models:
   ```bash
   ollama install llama3.2
   ollama install bge-m3
   ```

5. Create a `.env` file in the `backend/app/` directory with the following content:
   ```
   LLAMA_CLOUD_API_KEY={API KEY HERE}
   MODEL_URL=http://localhost:11434
   DB_URL={DB URL, postgres pgadmin}
   MODEL_NAME=llama3.2
   ENCRYPTION_KEY={GENERATE KEY FOR HS256 ALGO}
   ```
   - **Explanation**:
     - `LLAMA_CLOUD_API_KEY`: Your API key for accessing the Llama cloud services.
     - `MODEL_URL`: The URL for the locally hosted model.
     - `DB_URL`: The connection string for your PostgreSQL database.
     - `MODEL_NAME`: The name of the model being used.
     - `ENCRYPTION_KEY`: A generated key used for HS256 algorithm encryption.

6. Run the Jupyter Notebook for business logic and chat session management:
   - Open `backend/app/test copy.ipynb` to populate business logic and manage chat sessions.

7. Create the vector database context by running the following Jupyter Notebook:
   - Open `backend/app/utilities/testingg_rag.ipynb`.

8. To populate exercise-related data, run this code:
   ```bash
   python -m app.utilities.exercise_related.run_pipeline
   ```

9. Finally, start the FastAPI server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```

Now you're ready to explore the AI Need Help platform!