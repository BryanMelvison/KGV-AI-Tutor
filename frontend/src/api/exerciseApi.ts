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
