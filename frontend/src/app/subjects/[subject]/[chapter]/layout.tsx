"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

  const searchParams = useSearchParams();
  const isExercise = Boolean(searchParams.get("exercise"));

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
    <div className="flex flex-col h-dvh bg-[#E8E9F2]">
      <div
        className={`flex flex-1 bg-[#E8E9F2] ${
          isExercise ? "overflow-hidden" : ""
        }`}
      >
        {/* main split: sidebar + content */}
        {isSidebarOpen && (
          <SubjectSidebar
            subjects={sidebarSubjects}
            onCollapse={() => setIsSidebarOpen(false)}
          />
        )}
        <div
          className={`flex flex-col flex-1 p-4 space-y-4 ${
            isExercise ? "min-h-0 overflow-hidden" : ""
          }`}
        >
          {/* header */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white border rounded-lg shadow hover:bg-gray-100"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="text-2xl font-bold text-[#17171F]">
              {unslugify(chapterTitle) || "Loading..."}
            </div>
          </div>

          {/* page content slot */}
          <div
            className={`flex-1 ${
              isExercise ? "min-h-0  overflow-hidden" : ""
            } flex flex-col`}
          >
            {children}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
