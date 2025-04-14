"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown, FiMenu, FiSearch, FiX } from "react-icons/fi";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (currentSubject) {
      const matched = subjects.find(
        (s) => s.name.toLowerCase() === currentSubject.toLowerCase()
      );
      if (matched) setExpandedSubject(matched.name);
    }
  }, [currentSubject, subjects]);

  // Handle search and expansion
  useEffect(() => {
    if (!searchQuery.trim()) {
      // When search is cleared, revert to showing only the current subject
      setExpandedSubjects(expandedSubject ? [expandedSubject] : []);
      return;
    }

    const lowerSearchQuery = searchQuery.toLowerCase();
    const matchedSubjects: string[] = [];

    subjects.forEach((subject) => {
      // Check if subject name matches
      if (subject.name.toLowerCase().includes(lowerSearchQuery)) {
        matchedSubjects.push(subject.name);
        return;
      }

      // Check if any chapter in the subject matches
      const hasMatchingChapter = subject.chapters.some((chapter) =>
        unslugify(chapter).toLowerCase().includes(lowerSearchQuery)
      );

      if (hasMatchingChapter) {
        matchedSubjects.push(subject.name);
      }
    });

    setExpandedSubjects(matchedSubjects);
  }, [searchQuery, subjects, expandedSubject]);

  // Filter chapters based on search
  const getFilteredChapters = (chapters: string[]) => {
    if (!searchQuery.trim()) return chapters;

    return chapters.filter((chapter) =>
      unslugify(chapter).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Toggle subject expansion manually
  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects((prev) => {
      if (prev.includes(subjectName)) {
        return prev.filter((name) => name !== subjectName);
      } else {
        return [...prev, subjectName];
      }
    });
  };

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-4 transition-all duration-300 overflow-y-auto max-h-[100vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">My Subjects</h2>
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

      {/* Search Bar */}
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

      {/* Subjects List */}
      <div className="space-y-3">
        {subjects.map((subject) => {
          const isExpanded = expandedSubjects.includes(subject.name);
          const filteredChapters = getFilteredChapters(subject.chapters);

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
                  {filteredChapters.map((chapter, index) => {
                    const originalIndex = subject.chapters.indexOf(chapter);
                    const isHighlighted =
                      searchQuery &&
                      unslugify(chapter)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());

                    return (
                      <li key={chapter}>
                        <Link
                          href={`/subjects/${subject.name.toLowerCase()}/${chapter}`}
                          className={`block px-3 py-1.5 rounded-md text-sm ${
                            isHighlighted
                              ? "hover:text-sky-600 hover:bg-gray-50"
                              : currentSubject === subject.name.toLowerCase() &&
                                currentChapter === chapter
                              ? "text-sky-600 font-semibold "
                              : "text-gray-700 hover:text-sky-600 hover:bg-gray-50"
                          }`}
                        >
                          {String(originalIndex + 1).padStart(2, "0")}.{" "}
                          {unslugify(chapter)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {searchQuery &&
          !subjects.some(
            (subject) =>
              subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              subject.chapters.some((chapter) =>
                unslugify(chapter)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
          ) && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No matches found
            </div>
          )}
      </div>
    </aside>
  );
};

export default SubjectSidebar;
