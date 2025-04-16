import api from "@/helpers/axios";
import { getChapterNumber } from "@/api/chapter";

export interface Question {
  number: string;
  title: string;
}

export const fetchExerciseQuestions = async (
  subject: string,
  chapter: string,
  exercise: string
): Promise<Question[]> => {
  try {
    const chapter_num = await getChapterNumber(chapter);

    const { data } = await api.post(
      `/exercise/get-exercise-questions?subject=${subject}&chapter=${chapter_num}&exerciseLetter=${exercise}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching exercise questions:", error);
    return [];
  }
};
