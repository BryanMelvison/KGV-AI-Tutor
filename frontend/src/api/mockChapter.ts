export interface ChapterData {
  title: string;
  mastery: string[];
  exercises: string[];
  progress: number;
  chats: {
    title: string;
    time: string;
    summary: string;
  }[];
  chapters: {
    id: string;
    title: string;
  }[];
}

const chapterDatabase: Record<string, { id: string; title: string }[]> = {
  biology: [
    { id: "cell-biology", title: "Cell Biology" },
    { id: "human-physiology", title: "Human Physiology" },
    { id: "ecology-environment", title: "Ecology & Environment" },
  ],
  chemistry: [
    { id: "atomic-structure", title: "Atomic Structure" },
    { id: "chemical-reactions", title: "Chemical Reactions" },
    { id: "periodic-table", title: "Periodic Table" },
  ],
  physics: [
    { id: "mechanics", title: "Mechanics" },
    { id: "optics", title: "Optics" },
    { id: "thermodynamics", title: "Thermodynamics" },
  ],
};

export const getChapterData = async (
  subject: string,
  chapter: string
): Promise<ChapterData> => {
  const chapters = chapterDatabase[subject.toLowerCase()] || [];

  return {
    title: chapter,
    mastery: ["Describe core concepts", "Explain real-world applications"],
    exercises: ["A", "B", "C", "D", "E", "F", "G", "H"],
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
    chapters,
  };
};
