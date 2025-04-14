"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { unslugify } from "@/helpers/slugify";

interface SubjectSidebarProps {
  subjects: {
    name: string;
    chapters: string[];
  }[];
  onCollapse?: () => void;
}

const SubjectSidebar = ({ subjects, onCollapse }: SubjectSidebarProps) => {
  const params = useParams();
  const currentChapter = params?.chapter;
  const currentSubject =
    typeof params?.subject === "string" ? params.subject : "";

  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  useEffect(() => {
    if (currentSubject) {
      const matched = subjects.find(
        (s) => s.name.toLowerCase() === currentSubject.toLowerCase()
      );
      if (matched) setExpandedSubject(matched.name);
    }
  }, [currentSubject, subjects]);

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-4 transition-all duration-300 overflow-y-auto max-h-[100vh]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold ">My Subjects</h2>
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="text-gray-600 hover:text-sky-600 transition"
            title="Collapse sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        )}
      </div>

      {subjects.map((subject) => (
        <div key={subject.name}>
          <button
            onClick={() =>
              setExpandedSubject((prev) =>
                prev === subject.name ? null : subject.name
              )
            }
            className="flex justify-between items-center w-full text-sm font-semibold text-gray-800 hover:text-sky-600"
          >
            <span>{subject.name}</span>
            <FiChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                expandedSubject === subject.name ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSubject === subject.name && (
            <ul className="mt-2 space-y-2">
              {subject.chapters.map((chapter, index) => (
                <li key={chapter}>
                  <Link
                    href={`/subjects/${subject.name.toLowerCase()}/${chapter}`}
                    className={`block px-3 py-1 rounded-md text-sm ${
                      currentSubject === subject.name.toLowerCase() &&
                      currentChapter === chapter
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-500"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}. {unslugify(chapter)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
};

export default SubjectSidebar;
