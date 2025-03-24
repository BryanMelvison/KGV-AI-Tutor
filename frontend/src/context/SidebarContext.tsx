"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getSubjectsData, Subject } from "@/api/mockSubject";
import { getChapterData } from "@/api/mockChapter";

interface Chapter {
  id: string;
  title: string;
}

interface SidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  sidebarSubjects: { name: string; chapters: Chapter[] }[];
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [sidebarSubjects, setSidebarSubjects] = useState<
    { name: string; chapters: Chapter[] }[]
  >([]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const fetchAll = async () => {
      const subjects = await getSubjectsData();
      const enriched = await Promise.all(
        subjects.map(async (subj: Subject) => {
          const data = await getChapterData(subj.name.toLowerCase(), "latest");
          return { name: subj.name, chapters: data.chapters };
        })
      );
      setSidebarSubjects(enriched);
    };

    fetchAll();
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, sidebarSubjects }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar context missing!");
  return context;
};
