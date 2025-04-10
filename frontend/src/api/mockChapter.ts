export interface ChapterData {
  title: string;
  mastery: string[];
  mastery_status: boolean[];
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
    { id: "life-processes", title: "Life Processes" },
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
    mastery: [
      "Understand the characteristics shared by living organisms",
      "Describe cell structures and their functions, including the nucleus, cytoplasm, cell membrane, cell wall, mitochondria, chloroplasts, ribosomes and vacuole",
      "Know the similarities and differences in the structures of plant and animal cells",
      "Understand the role of enzymes as biological catalysts in metabolic reactions",
      "Understand how temperature changes can affect enzyme function, including changes to the shape of the active site",
      "Understand how enzyme function can be affected by changes in pH altering the active site",
      "Investigate how enzyme activity can be affected by changes in temperature",
      "Describe the differences between aerobic and anaerobic respiration",
      "Understand how the process of respiration produces ATP in living organisms",
      "Know that ATP provides energy for cells",
      "Know the word equation and balanced chemical symbol equation for aerobic respiration",
      "Know the word equations for anaerobic respiration",
      "Investigate the evolution of carbon dioxide and heat from respiring seeds or other suitable living organisms",
      "Understand the processes of diffusion, osmosis and active transport by which substances move into and out of cells",
      "Understand how factors affect the rate of movement of substances into and out of cells",
      "Investigate diffusion in a non-living system (agar jelly)",
      "Describe the levels of organisation within organisms – organelles, cells, tissues, organ systems",
    ],
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
