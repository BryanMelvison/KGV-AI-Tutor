"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { getChapterData } from "@/api/chapter";
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

  const pathname = usePathname();
  const isAssistant = pathname.endsWith("/assistant-chat");

  const searchParams = useSearchParams();
  const isExercise = Boolean(searchParams.get("exercise"));

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chapterTitle, setChapterTitle] = useState("");
  const { subjects: sidebarSubjects, loading } = useSubjectData();

  const isChatPage = isExercise || isAssistant;

  useEffect(() => {
    const fetchTitle = async () => {
      if (!subject || !chapter) return;
      const current = await getChapterData(subject, chapter);
      console.log(current);
      setChapterTitle(current.title);
    };

    fetchTitle();
  }, [subject, chapter]);

  if (loading) {
    return (
      <div className="flex flex-col h-dvh bg-gradient-to-br bg-sky-100 animate-pulse text-[#17171F]">
        <div className="flex flex-1">
          <div className="w-64 bg-white border-r p-4 space-y-4">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-100 rounded"></div>
            <div className="w-full h-4 bg-gray-100 rounded"></div>
            <div className="w-full h-4 bg-gray-100 rounded"></div>
          </div>

          <div className="flex-1 p-6 space-y-4">
            <div className="w-48 h-8 bg-gray-300 rounded"></div>
            <div className="w-full h-40 bg-gray-100 rounded"></div>
            <div className="w-full h-32 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div
        className={`flex flex-1 bg-sky-100 ${
          isChatPage ? "overflow-hidden" : ""
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
            isChatPage ? "min-h-0 overflow-hidden" : ""
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
            {chapterTitle && (
              <div className="text-2xl font-bold ">
                {unslugify(chapterTitle)}
              </div>
            )}
          </div>

          {/* page content slot */}
          <div
            className={`flex-1 ${
              isChatPage ? "min-h-0 overflow-hidden" : ""
            } flex flex-col`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
