"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getChapterData } from "@/api/mockChapter";
import { getSubjectsData, Subject } from "@/api/mockSubject";
import SubjectSidebar from "@/components/subjects/SubjectSidebar";
import { FiMenu } from "react-icons/fi";
import { unslugify } from "@/helpers/slugify";

export default function SubjectChapterLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const subject = typeof params.subject === "string" ? params.subject : "";
  const chapter = typeof params.chapter === "string" ? params.chapter : "";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chapterTitle, setChapterTitle] = useState("");
  const [sidebarSubjects, setSidebarSubjects] = useState<
    { name: string; chapters: { id: string; title: string }[] }[]
  >([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      if (!subject || !chapter) return;

      const currentChapter = await getChapterData(subject, chapter);
      setChapterTitle(currentChapter.title);
      setIsSidebarOpen(false);

      const allSubjects = await getSubjectsData();
      const results = await Promise.all(
        allSubjects.map(async (subj: Subject) => {
          const chapterData = await getChapterData(
            subj.name.toLowerCase(),
            "latest"
          );
          return {
            name: subj.name,
            chapters: chapterData.chapters,
          };
        })
      );

      setSidebarSubjects(results);
    };

    fetchSidebarData();
  }, [subject, chapter]);

  return (
    <div className="flex min-h-screen bg-[#E8E9F2]">
      {/* Sidebar */}
      {isSidebarOpen && (
        <SubjectSidebar
          subjects={sidebarSubjects}
          onCollapse={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header: Hamburger + Chapter Title */}
        <div className="flex items-center gap-3 mb-4">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white border rounded-lg shadow hover:bg-gray-100"
              title="Open Sidebar"
            >
              <FiMenu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="text-2xl font-bold text-[#17171F]">
            {unslugify(chapterTitle) || "Loading..."}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
