interface Exercise {
  id: string;
  objective: string;
  attempts: number[];
  completed: boolean;
}

export interface MasteryChecklistItem {
  chapter: string;
  objective: string;
  completed: boolean;
}

interface SmartQuizStats {
  averageScore: number;
  commonMistakes: string;
  weakObjectives: string[];
}

export interface Student {
  id: string;
  name: string;
  subject: string;
  exercises: Exercise[];
  masteryChecklist: MasteryChecklistItem[];
  llmComments: string;
  smartQuizStats: SmartQuizStats;
}

export const mockStudents: Record<string, Student> = {
  s1: {
    id: "s1",
    name: "Alicia Sutikno",
    subject: "Biology",
    exercises: [
      {
        id: "ex1",
        objective: "Understand Newton’s Laws",
        attempts: [4, 3, 2, 1],
        completed: true,
      },
      {
        id: "ex2",
        objective: "Identify Parts of a Cell",
        attempts: [2, 2, 1],
        completed: true,
      },
      {
        id: "ex3",
        objective: "Interpret pH Levels",
        attempts: [5, 4],
        completed: false,
      },
    ],
    masteryChecklist: [
      {
        chapter: "01. Life Processes",
        objective: "Describe cell structures and their functions",
        completed: true,
      },
      {
        chapter: "01. Life Processes",
        objective: "Understand diffusion",
        completed: false,
      },
      {
        chapter: "02. The Variety Of Living Organisms",
        objective: "Explain classification systems",
        completed: true,
      },
      {
        chapter: "02. The Variety Of Living Organisms",
        objective: "Understand biodiversity",
        completed: true,
      },
      {
        chapter: "03. Breathing And Gas Exchange",
        objective: "Describe gas exchange in alveoli",
        completed: false,
      },
    ],
    llmComments:
      "Alicia excels with visual aids and real-world context problems. She tends to perform better on conceptual questions but needs reinforcement on numeric-based reasoning.",
    smartQuizStats: {
      averageScore: 82,
      commonMistakes: "Confuses 2nd and 3rd Law of Newton when time-pressured.",
      weakObjectives: ["Forces and Motion", "Momentum"],
    },
    s2: {
      id: "s2",
      name: "Nico R.",
      subject: "Chemistry",
      exercises: [
        {
          id: "ex1",
          objective: "Balancing Chemical Equations",
          attempts: [5, 4, 2, 1],
          completed: true,
        },
      ],
      masteryChecklist: [
        {
          chapter: "01. Life Processes",
          objective: "Describe cell structures and their functions",
          completed: true,
        },
        {
          chapter: "01. Life Processes",
          objective: "Understand diffusion",
          completed: false,
        },
        {
          chapter: "02. The Variety Of Living Organisms",
          objective: "Explain classification systems",
          completed: true,
        },
        {
          chapter: "02. The Variety Of Living Organisms",
          objective: "Understand biodiversity",
          completed: true,
        },
        {
          chapter: "03. Breathing And Gas Exchange",
          objective: "Describe gas exchange in alveoli",
          completed: false,
        },
      ],
      llmComments:
        "Nico shows resilience in problem-solving. Performs best with repetition and guided examples.",
      smartQuizStats: {
        averageScore: 72,
        commonMistakes: "Fails to double-check atom counts.",
        weakObjectives: ["Stoichiometry"],
      },
    },
  },
};
