from dataclasses import dataclass
from llama_parse import LlamaParse
import nest_asyncio
import asyncio
from dotenv import load_dotenv 
import os
import requests
from ollama import Client
from pathlib import Path
from prompt import classifier_front_content_agent_prompt, classifier_content_back_matter_agent_prompt, classifier_content_chapter_agent_prompt, content_reformatter_prompt
from contentDatabase.rag import textbookRAG

load_dotenv()
nest_asyncio.apply()

@dataclass
class LLMConfig:
    api_url: str = os.getenv("PARSER_LLM_API_URL")

@dataclass
class ParserConfig:
    instruction: str = """This is a school textbook aimed at Secondary School students, where content is presented in an unstructured layout mixing text blocks, images, captions, highlighted terms, headers, and information boxes. The layout doesn't follow a strict linear format, instead scattering different elements across the page. Try to reconstruct this text in a cohesive way."""

class PDFParser():
    def __init__(self, path, instruction=None, llm_config=None, metadata=None):
        self.path = path
        self.metadata = metadata or {} # Ini itu buat orang2 kalo kirim sesuatu ke backend, kirim metadata juga (Contoh: Subject, totalChapters  "textbook": {"subject": "Biology","totalChapters": 21,"chapters": [{"chapterNumber": 1,"title": "Life Processes"}]""
        self.instruction = instruction or ParserConfig().instruction
        self._parsed_content = None
        self.book_dir = Path(__file__).parent.parent / "book"
        self.book_dir.mkdir(exist_ok=True)

        # LLM Configuration and Client
        self.llm_config = llm_config or LLMConfig()
        self.llm_client = Client(self.llm_config.api_url)

    
    async def _parse_job(self):
        try:
            parsed_content = LlamaParse(
                result_type="markdown",
                parsing_instruction=self.instruction
            ).load_data(self.path)
            
            self._parsed_content = parsed_content
            return self._parsed_content

        except Exception as e:
            print(f"Error parsing PDF: {str(e)}")
            raise

    async def parse_job(self):
        if not self._parsed_content:
            return await self._parse_job()
        return self._parsed_content
            
    def llm_agent(self, prompt: str, text: str) -> str:
        response = self.llm_client.chat(
            model='pdfParser',
            messages=[
                {'role': 'system', 'content': prompt},
                {'role': 'user', 'content': text},
            ]
        )
        # For safety, do some normalization
        return response['message']['content'].strip().upper()
    
    def classify_front_matter_or_chapter(self, text: str, subject: str) -> str:
        classified_output = self.llm_agent(
            classifier_front_content_agent_prompt.format(subject=subject),
            text
        )
        # Validate the output to ensure it's one word
        if len(classified_output.split()) != 1:
            classified_output = "CHAPTER_CONTENT"
        return classified_output

    def is_content_about_chapter(
        self, text: str, subject: str, chapter_name: str, chapter_number: int
    ) -> bool:
        bool_flag = self.llm_agent(
            classifier_content_chapter_agent_prompt.format(
                subject=subject,
                chapterName=chapter_name,
                chapterNumber=chapter_number
            ),
            text
        )
        # Normalize the response
        if bool_flag not in ["TRUE", "FALSE"]:
            bool_flag = "TRUE"
        return (bool_flag == "TRUE")

    def classify_back_matter_or_chapter(self, text: str, subject: str) -> str:
        classified_output = self.llm_agent(
            classifier_content_back_matter_agent_prompt.format(subject=subject),
            text
        )
        # Validate the output to ensure it's one word
        if len(classified_output.split()) != 1:
            classified_output = "BACK_MATTER"
        return classified_output

    def reformat_content(self, text: str) -> str:
        reformatted = self.llm_agent(content_reformatter_prompt, text)
        return reformatted

    def write_content_to_chapter(
        self, 
        chapter_idx: int, 
        chapters: list, 
        content_reformatted: str, 
    ) -> None:
        chapter_file = self.book_dir / f"chapter_{chapters[chapter_idx]['chapterNumber']}.txt"
        mode = 'a' if chapter_file.exists() else 'w'
        with open(chapter_file, mode) as f:
            f.write(content_reformatted + '\n')

    async def process_textbook_content(self, content_list: list):
        if "textbook" not in self.metadata:
            # If no textbook metadata is given, do a simple pass
            return

        subject = self.metadata["textbook"].get("subject", "Unknown")
        chapters = self.metadata["textbook"].get("chapters", [])
        current_chapter_idx = -1  # -1 to indicate front matter

        # Create a directory named "book" relative to this .py file’s parent 
        for page_idx, content in enumerate(content_list):
            raw_text = content["text"].strip() if "text" in content else ""
            if not raw_text:
                continue

            # Reformat text first
            reformatted_text = self.reformat_content(raw_text)

            if current_chapter_idx == -1:
                # We are in the front matter territory
                front_or_chapter = self.classify_front_matter_or_chapter(raw_text, subject)
                if front_or_chapter == "CHAPTER_CONTENT":
                    # Check if it's about the first chapter
                    if chapters and self.is_content_about_chapter(
                        reformatted_text,
                        subject,
                        chapters[0]["title"],
                        chapters[0]["chapterNumber"]
                    ):
                        current_chapter_idx = 0
                        self.write_content_to_chapter(
                            current_chapter_idx,
                            chapters,
                            reformatted_text,
                        )
            elif current_chapter_idx < len(chapters):
                # Inside a known chapter
                if self.is_content_about_chapter(
                    reformatted_text,
                    subject,
                    chapters[current_chapter_idx]["title"],
                    chapters[current_chapter_idx]["chapterNumber"]
                ):
                    # Still the same chapter
                    self.write_content_to_chapter(
                        current_chapter_idx,
                        chapters,
                        reformatted_text,
                    )
                else:
                    # Possibly next chapter or back matter
                    if current_chapter_idx + 1 < len(chapters):
                        # Check next chapter
                        if self.is_content_about_chapter(
                            reformatted_text,
                            subject,
                            chapters[current_chapter_idx + 1]["title"],
                            chapters[current_chapter_idx + 1]["chapterNumber"]
                        ):
                            current_chapter_idx += 1
                            self.write_content_to_chapter(
                                current_chapter_idx,
                                chapters,
                                reformatted_text,
                            )
                        else:
                            # Not about the next chapter → fallback to current
                            self.write_content_to_chapter(
                                current_chapter_idx,
                                chapters,
                                reformatted_text,
                            )
                    else:
                        # We are at the last chapter, check for back matter
                        back_or_chapter = self.classify_back_matter_or_chapter(
                            reformatted_text,
                            subject
                        )
                        if back_or_chapter == "BACK_MATTER":
                            break
                        else:
                            # Still appended to last chapter
                            self.write_content_to_chapter(
                                current_chapter_idx,
                                chapters,
                                reformatted_text,
                            )
            else:
                # We might have run out of chapters
                back_or_chapter = self.classify_back_matter_or_chapter(
                    reformatted_text,
                    subject
                )
                if back_or_chapter == "CHAPTER_CONTENT" and chapters:
                    # Double-check if it pertains to last known chapter
                    if self.is_content_about_chapter(
                        reformatted_text,
                        subject,
                        chapters[-1]["title"],
                        chapters[-1]["chapterNumber"]
                    ):
                        self.write_content_to_chapter(
                            len(chapters) - 1,
                            chapters,
                            reformatted_text,
                        )
                else:
                    # If definitely back matter, we can break
                    break
                
    async def get_structured_content(self):
        try:
            # Ensure content is parsed
            if self._parsed_content is None:
                await self._parse_job()
            
            if not isinstance(self._parsed_content, list):
                print("Parsed content is not a list; skipping classification.")
                return None
            
            # Process content
            result = {
                "success": True,
                "content": self._parsed_content,
                "rag_status": "not_attempted"
            }
            
            # Process and store in RAG if metadata exists
            if self.metadata:
                try:
                    # Process textbook content and write to files
                    await self.process_textbook_content(self._parsed_content)
                    
                    # Store to RAG
                    rag = textbookRAG(metadata=self.metadata, book_dir=self.book_dir)
                    rag.extract_from_metadata()
                    result["rag_status"] = "success"
                    
                    print("Successfully processed content and stored in RAG.")
                except Exception as e:
                    print(f"Error during content processing or RAG storage: {str(e)}")
                    result["rag_status"] = f"error: {str(e)}"
            else:
                print("No metadata provided, skipping chapter processing and RAG storage.")
                result["rag_status"] = "skipped_no_metadata"
            
            return result
            
        except Exception as e:
            print(f"Error in get_structured_content: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


