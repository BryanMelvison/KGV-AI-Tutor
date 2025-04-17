"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getChapter } from "@/api/chapter";
import { getSubjectsData, Subject } from "@/api/mockSubject";

type SubjectWithChapters = Subject & {
  chapters: string[];
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
      const token = localStorage.getItem("anh-token");

      if (!token) {
        const fallback = baseSubjects.map((subject) => ({
          ...subject,
          chapters: [],
        }));
        setSubjects(fallback);
        setLoading(false);
        return;
      }

      const subjectsWithChapters = await Promise.all(
        baseSubjects.map(async (subject) => {
          try {
            const chapterData = await getChapter(subject.name.toLowerCase());
            return {
              ...subject,
              chapters: chapterData,
            };
          } catch (err) {
            console.error("Error fetching chapters for", subject.name, err);
            return {
              ...subject,
              chapters: [],
            };
          }
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
