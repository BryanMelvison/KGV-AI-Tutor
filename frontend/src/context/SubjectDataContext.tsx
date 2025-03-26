"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getChapterData } from "@/api/mockChapter";
import { getSubjectsData, Subject } from "@/api/mockSubject";

type SubjectWithChapters = {
  name: string;
  chapters: { id: string; title: string }[];
};

interface SubjectDataContextProps {
  subjects: SubjectWithChapters[];
  loading: boolean;
}

const SubjectDataContext = createContext<SubjectDataContextProps>({
  subjects: [],
  loading: true,
});

export const useSubjectData = () => useContext(SubjectDataContext);

export const SubjectDataProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<SubjectWithChapters[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectsOnce = async () => {
      const baseSubjects = await getSubjectsData();

      const subjectsWithChapters = await Promise.all(
        baseSubjects.map(async (subject: Subject) => {
          const chapterData = await getChapterData(
            subject.name.toLowerCase(),
            "latest"
          );

          return {
            name: subject.name,
            chapters: chapterData.chapters,
          };
        })
      );

      setSubjects(subjectsWithChapters);
      setLoading(false);
    };

    fetchSubjectsOnce();
  }, []);

  return (
    <SubjectDataContext.Provider value={{ subjects, loading }}>
      {children}
    </SubjectDataContext.Provider>
  );
};
