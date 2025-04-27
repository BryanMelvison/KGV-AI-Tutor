"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown, FiMenu, FiSearch, FiX } from "react-icons/fi";
import { unslugify } from "@/helpers/slugify";
import { getChapter } from "@/api/chapter";

interface SubjectSidebarProps {
  subjects: {
    name: string;
  }[];
  onCollapse?: () => void;
}

const SubjectSidebar = ({ subjects, onCollapse }: SubjectSidebarProps) => {
  const params = useParams();
  const currentChapter = params?.chapter;
  const currentSubject =
    typeof params?.subject === "string" ? params.subject : "";

  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chapterMap, setChapterMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchChapters = async () => {
      const map: Record<string, string[]> = {};
      for (const subject of subjects) {
        try {
          const chapters = await getChapter(subject.name.toLowerCase());
          map[subject.name] = chapters;
        } catch (err) {
          console.error("Failed to fetch chapters for", subject.name, err);
          map[subject.name] = [];
        }
      }
      setChapterMap(map);
    };

    fetchChapters();
  }, [subjects]);

  useEffect(() => {
    if (currentSubject) {
      const matched = subjects.find(
        (s) => s.name.toLowerCase() === currentSubject.toLowerCase()
      );
      if (matched) setExpandedSubject(matched.name);
    }
  }, [currentSubject, subjects]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setExpandedSubjects(expandedSubject ? [expandedSubject] : []);
      return;
    }

    const lower = searchQuery.toLowerCase();
    const matchedSubjects = subjects.filter((subject) => {
      const subjectMatch = subject.name.toLowerCase().includes(lower);
      const chapters = chapterMap[subject.name] || [];
      const chapterMatch = chapters.some((chapter) =>
        unslugify(chapter).toLowerCase().includes(lower)
      );
      return subjectMatch || chapterMatch;
    });

    setExpandedSubjects(matchedSubjects.map((s) => s.name));
  }, [searchQuery, subjects, chapterMap, expandedSubject]);

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-4 sticky top-0 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">My Subjects</h2>
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="text-gray-600 hover:text-sky-600 transition"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search chapters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-8 pr-8 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <FiSearch className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subjects & Chapters */}
      <div className="space-y-3">
        {subjects.map((subject) => {
          const chapters = chapterMap[subject.name] || [];
          const isExpanded = expandedSubjects.includes(subject.name);

          const filteredChapters = searchQuery
            ? chapters.filter((chapter) =>
                unslugify(chapter)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
            : chapters;

          if (
            searchQuery &&
            filteredChapters.length === 0 &&
            !subject.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return null;
          }

          return (
            <div key={subject.name} className="border-b pb-2">
              <button
                onClick={() => toggleSubject(subject.name)}
                className={`flex justify-between items-center w-full py-2 text-sm font-semibold hover:text-sky-600 transition-colors ${
                  isExpanded ? "text-sky-600" : "text-gray-800"
                }`}
              >
                <span>{subject.name}</span>
                <FiChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && filteredChapters.length > 0 && (
                <ul className="mt-2 space-y-1.5 pl-1">
                  {filteredChapters.map((chapter, index) => (
                    <li key={chapter}>
                      <Link
                        href={`/student/subjects/${subject.name.toLowerCase()}/${chapter}`}
                        className={`block px-3 py-1.5 rounded-md text-sm ${
                          currentSubject === subject.name.toLowerCase() &&
                          currentChapter === chapter
                            ? "text-sky-600 font-semibold"
                            : "text-gray-700 hover:text-sky-600 hover:bg-gray-50"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}.{" "}
                        {unslugify(chapter)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default SubjectSidebar;
