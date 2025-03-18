export const mockAIResponse = async (message: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    "This is a mock AI response. Replace this with real API integration when ready. The user said: " +
    message
  );
};
