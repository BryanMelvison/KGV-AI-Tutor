export interface Subject {
  name: string;
  icon: string;
  color: string;
  progress: number;
}

export const mockSubjects: Subject[] = [
  {
    name: "Biology",
    icon: "/biology-icon.svg",
    color: "#F9A3A4",
    progress: 50,
  },
  {
    name: "Chemistry",
    icon: "/chemistry-icon.svg",
    color: "#F2F3FD",
    progress: 70,
  },
  {
    name: "Physics",
    icon: "/physics-icon.svg",
    color: "#FDFAF2",
    progress: 30,
  },
];

//palsu
export const getSubjectsData = (): Promise<Subject[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSubjects);
    }, 1000);
  });
};
