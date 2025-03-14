Very basic, here is my plan, 

Created upload endpoint to upload textbook then:
Through the endpoint, we then let it run a process on PDFParser class, where it extracts the text, understanding the layout, before being passed to a local mini LLM, where the LLM can then extract the main content, and if it notices a title page then it creates its own separator. 


2 options, explicit define through use of Ollama ModelFile OR define in text


For the ollama ModelFile, we only updated the context window (from 2048 to 4096), to create the modelfile run this (though this will be automated soon) (Need to create bashscript soon)


bge-m3

To run: 
-----------
First we need to modify and download ollama:
pip imstall -r requiremets.txt
ollama pull huihui_ai/deepseek-r1-abliterated:8b-llama-distill
echo "FROM huihui_ai/deepseek-r1-abliterated:8b-llama-distill
PARAMETER num_ctx 4096" > Modelfile

ollama create pdfParser -f ./Modelfile

Next, we run backend:
uvicorn app.main:app --reload     

These processes here will be automated by bashscript
----------
More advanced version of the plan:

The plan is to allow teachers (with limited manual intervention) to upload a textbook, and the backend will automatically, segregate each chapter, and then put them all in for chunking, with the metadata containing the chapter of the contet.

So when the teacher wants to upload a textbook, the teacher will be shown a questionnaire which includes these questions in the front end:
1. What is the subject covered by the textbook?
2. How many chapters are in the textbook?
3. What are the chapter titles (List in order)

Once the teachers fill in the questionnaire, the teachers can finally upload the PDF file of the textbook. 

Then our upload API will take in the questionnaire and the PDF file of the textbook, and upload it to the server, at the moment it is done locally, once we are done with the interim report we will move it to cloud solutions.

Once the PDF file and the JSON file are both uploaded, we will then run a Llamaparse job for the PDF, extracting them as an array of documents, where each document corresponds to each page. As the parsed information are messy, incoherent, and also contain front and back matter, we will be running it through some sort of agentic logic. 

Our logic as it stands includes:
1. Manual Classification -> For each document, we want the LLM to classify if it's a FRONT MATTER, BACK MATTER, or CONTENT. 
2. Run through a verifier LLM where it will try to verify the authenticity of the method. 
3. We will then, using the corrected logic (We will check if it is part of the chapter, if it isn't part of the chapter, then we will add separation logic.)

At the moment, this process assumes:
1. PDF content isn't scanned (No OCR involved)
2. Supports only English textbooks 
3. Assumes textbook pages is in order
4. We don't need the images contained




---- 
For the vector database, 
ollama pull bge-m3
