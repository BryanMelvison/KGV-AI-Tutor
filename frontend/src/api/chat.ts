import api from "@/helpers/axios";
import axios from "axios";
import { getChapterNumber, getSubjectNumber } from "./chapter";

const API_BASE_URL = "http://localhost:8000/api";

interface ChatResponse {
  status: string;
  data: {
    response: {
      response: string;
      memory: Array<{ role: "human" | "ai"; content: string }>; // ini buat nunjukin memory chat yg diinget si llm, blum digunain
    };
  };
}

export interface ChatSession {
  sessionId: string;
  sessionName: string;
  timestamp: string;
  message: string | null;
}

export const createChatSession = async (
  sessionName: string,
  subjectName: string,
  chapterName: string
): Promise<string> => {
  const subjectId = await getSubjectNumber(subjectName);
  const chapterId = await getChapterNumber(chapterName);

  const { data } = await api.post("/chat/add-chat-session", {
    sessionName,
    chapterId,
    subjectId,
  });

  return data.sessionId;
};

export const getChatSessions = async (
  subject: string,
  chapter: string
): Promise<ChatSession[]> => {
  const subjectId = await getSubjectNumber(subject);
  const chapterId = await getChapterNumber(chapter);

  console.log("GET /chat/get-chat-session", { subjectId, chapterId });

  const { data } = await api.get("/chat/get-chat-session", {
    params: { subjectId, chapterId },
  });

  console.log("This is data:", data);

  return data || [];
};

export const AIResponse = async (
  message: string,
  sessionId: string = "default", // nanti diganti jadi random id gitu buat bedain session
  subject: string,
  chapter: string
): Promise<string> => {
  try {
    const res = await axios.post<ChatResponse>(
      `${API_BASE_URL}/chat/messages`,
      {
        prompt: message,
        session_id: sessionId,
        subject: subject,
        chapter: chapter,
      }
    );
    return res.data.data.response; // Ini ud bener, jgn diubah response nya
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to send message");
    }
    throw error;
  }
};

export const clearMemory = async (
  sessionId: string = "default" // nanti diganti jadi random id gitu buat bedain session
): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/chat/clear`, {
      session_id: sessionId,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail || "Failed to clear chat history"
      );
    }
    throw error;
  }
};
