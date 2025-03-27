export interface Question {
  number: string;
  title: string;
}

export const fetchExerciseQuestions = async (
  subject: string,
  chapter: string,
  exercise: string
) => {
  // Simulate different questions per exercise
  return [
    { number: "1", title: `${exercise}.1 What is the definition of X?` },
    { number: "2", title: `${exercise}.2 Explain how Y works.` },
    { number: "3", title: `${exercise}.3 Provide an example of Z.` },
  ];
};
