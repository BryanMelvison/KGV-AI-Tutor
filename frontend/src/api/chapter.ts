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
  const student_id = 4; // assume student_id is 4 for now, later change when udh ada session per student

  return {
    title: chapter,
    mastery: await getLearningObjectives(subject, chapter),
    mastery_status: await getStudentMasteryStatus(student_id, subject, chapter),
    exercises: await getExercises(student_id, subject, chapter),
    progress: Math.floor(
      await getStudentMasteryStatus(student_id, subject, chapter).then(
        (status) => (status.filter((s) => s).length / status.length) * 100
      )
    ),
    chats: [
      // QUESTIONABLE, ini buat apa
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
      "/chapter/all-chapter-name",
      {},
      {
        params: { subject: subject_number },
      }
    );

    return data || [];
  } catch (error) {
    console.error("Error getting all chapter names:", error);
    return [];
  }
};

export const getSubjectNumber = async (subject: string): Promise<number> => {
  const { data } = await api.post(
    "/chapter/subject-number",
    {},
    {
      params: { subject },
    }
  );
  return data;
};

export const getChapterNumber = async (
  chapter_name: string
): Promise<number> => {
  try {
    const { data } = await api.post(
      "/chapter/chapter-number",
      {},
      {
        params: { chapter: chapter_name },
      }
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
      "/chapter/learning-objective",
      {},
      {
        params: { subject, chapter: chapter_num },
      }
    );
    return data || [];
  } catch (error) {
    console.error("Error getting learning objectives:", error);
    return [];
  }
};

export const getStudentMasteryStatus = async (
  student_id: number,
  subject: string,
  chapter_name: string
): Promise<boolean[]> => {
  try {
    const chapter_num = await getChapterNumber(chapter_name);
    const { data } = await api.post(
      "/student/mastery-status",
      {},
      {
        params: { studentId: student_id, subject, chapter: chapter_num },
      }
    );
    return data || [];
  } catch (error) {
    console.error("Error getting student mastery status:", error);
    return [];
  }
};

export const getExercises = async (
  student_id: number,
  subject: string,
  chapter_name: string
): Promise<{ id: string; completed: boolean; secretLetter: string }[]> => {
  try {
    const chapter_num = await getChapterNumber(chapter_name);
    const { data } = await api.post(
      "/exercise/get-exercises",
      {},
      {
        params: { studentId: student_id, subject, chapter: chapter_num },
      }
    );
    return data || [];
  } catch (error) {
    console.error("Error getting exercises:", error);
    return [];
  }
};
