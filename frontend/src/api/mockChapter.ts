import api from "@/helpers/axios";

export interface ChapterData {
  title: string;
  mastery: string[];
  mastery_status: boolean[];
  exercises: {
    id: string;
    completed: boolean;
    secretLetter: string;
  }[];
  progress: number;
  chats: {
    title: string;
    time: string;
    summary: string;
  }[];
}

export interface LearningObjective {
  id: number;
  chapter: number;
  learning_objective_text: string;
  syllabus_tags: string[] | null;
  syllabus_ids: number[];
}

export const getChapterData = async (
  subject: string,
  chapter: string
): Promise<ChapterData> => {
  return {
    title: chapter,
    mastery: await getLearningObjectives(subject, chapter),
    mastery_status: [
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    exercises: [
      { id: "A", completed: false, secretLetter: "Z" },
      { id: "B", completed: true, secretLetter: "X" },
      { id: "C", completed: false, secretLetter: "M" },
      { id: "D", completed: true, secretLetter: "K" },
    ],

    progress: Math.floor(Math.random() * 100), // simulate varying progress
    chats: [
      {
        title: "Example Chat 1",
        time: "12:09 AM",
        summary: "Discussion on fundamentals and key takeaways.",
      },
      {
        title: "Example Chat 2",
        time: "1:15 PM",
        summary: "Advanced insights and summary of concepts.",
      },
    ],
  };
};

export const getChapter = async (subject: string): Promise<string[]> => {
  try {
    const subject_number = await getSubjectNumber(subject);

    const { data } = await api.post(
      `chapter/all-chapter-name?subject=${subject_number}`
    );
    return data || [];
  } catch (error) {
    console.error("Error getting all chapter names:", error);
    return [];
  }
};

export const getSubjectNumber = async (subject: string): Promise<number> => {
  const response = await api.post(`chapter/subject-number?subject=${subject}`);
  return response.data;
};

export const getChapterNumber = async (
  chapter_name: string
): Promise<number> => {
  try {
    const { data } = await api.post(
      `/chapter/chapter-number?chapter=${chapter_name}`
    );
    return data;
  } catch (error) {
    console.error("Error getting chapter number:", error);
    throw error;
  }
};

export const getLearningObjectives = async (
  subject: string,
  chapter_name: string
): Promise<string[]> => {
  try {
    const chapter_num = await getChapterNumber(chapter_name);

    const { data } = await api.post(
      `/chapter/learning-objective?subject=${subject}&chapter=${chapter_num}`
    );
    return data || [];
  } catch (error) {
    console.error("Error getting learning objectives:", error);
    return [];
  }
};
