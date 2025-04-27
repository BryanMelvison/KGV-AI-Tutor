"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IoGridOutline,
  IoBookOutline,
  IoSparklesOutline,
  IoChevronForward,
  IoHelpCircleOutline,
} from "react-icons/io5";
import SmartQuizModal from "../smart-quiz/SmartQuizModal";
import { useQuiz } from "@/context/SmartQuizContext";
import { getSubjectsData, Subject } from "@/api/mockSubject";
import { getChapter } from "@/api/chapter";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { unslugify } from "@/helpers/slugify";

const NavBar = () => {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [previousActive, setPreviousActive] = useState("dashboard");
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapterMap, setChapterMap] = useState<Record<string, string[]>>({});
  const [searchQueryMap, setSearchQueryMap] = useState<Record<string, string>>(
    {}
  );
  const [searchFocused, setSearchFocused] = useState(false);

  const { isOpen, openQuiz, closeQuiz } = useQuiz();
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getSubjectsData();
      setSubjects(data);

      const token = sessionStorage.getItem("anh-token");
      if (!token) {
        const emptyChapters: Record<string, string[]> = {};
        data.forEach((s) => {
          emptyChapters[s.name] = [];
        });
        setChapterMap(emptyChapters);
        setLoading(false);
        return;
      }

      const chapters: Record<string, string[]> = {};
      for (const subject of data) {
        try {
          const res = await getChapter(subject.name.toLowerCase());
          chapters[subject.name] = res;
        } catch (err) {
          console.error(`Error fetching chapters for ${subject.name}`, err);
          chapters[subject.name] = [];
        }
      }
      setChapterMap(chapters);
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  const handleOpenQuiz = () => {
    setPreviousActive(active);
    openQuiz();
    setActive("smart quiz");
  };

  const handleCloseQuiz = () => {
    closeQuiz();
    setActive(previousActive);
  };

  const getFilteredChapters = (chapters, subject) => {
    const query = searchQueryMap[subject] || "";
    if (!query.trim()) return chapters;
    return chapters.filter((chapter) =>
      unslugify(chapter).toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearchChange = (subject, value) => {
    setSearchQueryMap((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  const clearSearch = (subject) => {
    setSearchQueryMap((prev) => ({
      ...prev,
      [subject]: "",
    }));
  };

  const navItems = [
    { name: "Dashboard", icon: <IoGridOutline />, link: "/student/dashboard" },
    { name: "Subjects", icon: <IoBookOutline />, link: "/student/subjects" },
    { name: "Smart Quiz", icon: <IoSparklesOutline /> },
  ];

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 h-screen bg-white border-r shadow-md py-5 transition-all duration-300 w-20 z-40">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-square.svg"
            alt="App Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </div>
        <div className="space-y-6 relative">
          {navItems.map((item) => (
            <div
              key={item.name}
              onMouseEnter={() =>
                item.name === "Subjects" && setHoveredNav(true)
              }
              onMouseLeave={() =>
                item.name === "Subjects" && setHoveredNav(false)
              }
              className="relative"
            >
              {item.name === "Smart Quiz" ? (
                <div
                  className="flex flex-col items-center gap-1 cursor-pointer"
                  onClick={handleOpenQuiz}
                >
                  <div
                    className={`text-2xl ${
                      active === item.name.toLowerCase() || isOpen
                        ? "text-sky-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs ${
                      active === item.name.toLowerCase() || isOpen
                        ? "text-sky-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              ) : (
                <Link
                  href={item.link}
                  className="flex flex-col items-center gap-1"
                  onClick={() => setActive(item.name.toLowerCase())}
                >
                  <div
                    className={`text-2xl ${
                      active === item.name.toLowerCase()
                        ? "text-sky-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs ${
                      active === item.name.toLowerCase()
                        ? "text-sky-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              )}

              {/* Hover Subjects Dropdown */}
              {hoveredNav && item.name === "Subjects" && (
                <div className="absolute left-full top-0 bg-white shadow-lg border rounded-md p-3 w-52 z-50">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-full h-10 bg-gray-100 animate-pulse rounded-md"
                        />
                      ))}
                    </div>
                  ) : (
                    subjects.map((subject) => (
                      <div
                        key={subject.name}
                        className="relative"
                        onMouseEnter={() => setHoveredSubject(subject.name)}
                        onMouseLeave={() => setHoveredSubject(null)}
                      >
                        <Link
                          href={`/student/subjects/${subject.name.toLowerCase()}`}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md w-full"
                        >
                          <div
                            className="w-8 h-8 flex items-center justify-center rounded-md"
                            style={{ backgroundColor: subject.color }}
                          >
                            <Image
                              src={subject.icon}
                              alt={subject.name}
                              width={20}
                              height={20}
                              className="w-5 h-5"
                            />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {subject.name}
                          </span>
                          <IoChevronForward className="ml-auto text-gray-400" />
                        </Link>

                        {hoveredSubject === subject.name &&
                          chapterMap[subject.name] && (
                            <div className="absolute left-full top-0 bg-white shadow-xl border rounded-md p-3 w-56 z-50 max-h-[300px] overflow-y-auto">
                              {/* Search input */}
                              <div className="sticky top-0 z-10 pb-2 bg-white">
                                <div className="absolute -top-3 -left-3 -right-3 h-12 bg-white" />
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Search chapters..."
                                    value={searchQueryMap[subject.name] || ""}
                                    onChange={(e) =>
                                      handleSearchChange(
                                        subject.name,
                                        e.target.value
                                      )
                                    }
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() =>
                                      setTimeout(
                                        () => setSearchFocused(false),
                                        100
                                      )
                                    }
                                    className="w-full p-1.5 pl-7 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 relative z-20"
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 text-gray-400 absolute left-2 top-2.5 z-20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                  </svg>
                                  {searchQueryMap[subject.name] && (
                                    <button
                                      onClick={() => clearSearch(subject.name)}
                                      className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 z-20"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10" />
                              </div>
                              {/* Chapters list */}
                              <div className="space-y-1 pt-1 relative z-0">
                                {getFilteredChapters(
                                  chapterMap[subject.name],
                                  subject.name
                                ).length > 0 ? (
                                  getFilteredChapters(
                                    chapterMap[subject.name],
                                    subject.name
                                  ).map((chapter) => {
                                    const originalIndex =
                                      chapterMap[subject.name].indexOf(chapter);
                                    return (
                                      <Link
                                        key={chapter}
                                        href={`/student/subjects/${subject.name.toLowerCase()}/${chapter}`}
                                        className="block text-gray-600 hover:text-sky-600 text-sm p-1"
                                      >
                                        {`${String(originalIndex + 1).padStart(
                                          2,
                                          "0"
                                        )}. ${unslugify(chapter)}`}
                                      </Link>
                                    );
                                  })
                                ) : (
                                  <div className="text-center py-2 text-sm text-gray-500">
                                    No chapters found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 left-0 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-500 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10v1m0-1V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1"
              />
            </svg>
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>

      <SmartQuizModal isOpen={isOpen} onClose={handleCloseQuiz} />
    </div>
  );
};

export default NavBar;
