import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const fetchLatestExercise = async () => {
  try {
    const response = await fetch("/api/latest-exercise"); // Replace with actual backend API
    if (!response.ok) {
      throw new Error("Failed to fetch latest exercise");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching latest exercise:", error);
    return null;
  }
};

export const getExerciseData = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exercise/initialize`);
    if (response.status !== 200) {
      throw new Error("Failed to get exercise data");
    }
    return response.data.data.response;
  } catch (error) {
    console.error("Error getting exercise data:", error);
    return null;
  }
};

export const AIExerciseResponse = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exercise/response`, {
      prompt: message,
    });
    return response.data.data.response;
  } catch (error) {
    console.error("Error getting AI exercise response:", error);
    return "Failed to get AI response";
  }
};
