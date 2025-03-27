"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getChapterData } from "@/api/mockChapter";
import SubjectSidebar from "@/components/subjects/SubjectSidebar";
import { FiMenu } from "react-icons/fi";
import { unslugify } from "@/helpers/slugify";
import { useSubjectData } from "@/context/SubjectDataContext";

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
  const { subjects: sidebarSubjects, loading } = useSubjectData();

  useEffect(() => {
    const fetchTitle = async () => {
      if (!subject || !chapter) return;
      const current = await getChapterData(subject, chapter);
      setChapterTitle(current.title);
    };

    fetchTitle();
  }, [subject, chapter]);

  if (loading) {
    return <div className="p-6">Loading sidebar...</div>;
  }

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
      <div className="flex-1 p-6 space-y-6  bg-[#E8E9F2]">
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
