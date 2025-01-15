import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

interface ChatResponse {
  status: string;
  data: {
    response: {
      response: string;
      memory: Array<{ role: "human" | "ai"; content: string }>; // ini buat nunjukin memory chat yg diinget si llm, blum digunain
    };
  };
}

export const AIResponse = async (
  message: string,
  sessionId: string = "default" // nanti diganti jadi random id gitu buat bedain session
): Promise<string> => {
  try {
    const res = await axios.post<ChatResponse>(
      `${API_BASE_URL}/chat/messages`,
      {
        prompt: message,
        session_id: sessionId,
      }
    );
    return res.data.data.response.response;
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
