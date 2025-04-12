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
import { getChapterData } from "@/api/mockChapter";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const NavBar = () => {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [previousActive, setPreviousActive] = useState("dashboard");
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapterMap, setChapterMap] = useState<
    Record<string, { id: string; title: string }[]>
  >({});

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

      const chapters: Record<string, { id: string; title: string }[]> = {};
      for (const subject of data) {
        const res = await getChapterData(subject.name.toLowerCase(), "intro");
        chapters[subject.name] = res.chapters;
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

  const navItems = [
    { name: "Dashboard", icon: <IoGridOutline />, link: "/student/dashboard" },
    { name: "Subjects", icon: <IoBookOutline />, link: "/subjects" },
    { name: "Smart Quiz", icon: <IoSparklesOutline /> },
  ];

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 h-screen bg-white border-r shadow-md py-5 transition-all duration-300 w-20">
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
                          href={`/subjects/${subject.name.toLowerCase()}`}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md w-full"
                        >
                          <div
                            className="w-8 h-8 flex items-center justify-center rounded-md"
                            style={{ backgroundColor: subject.color }}
                          >
                            <img
                              src={subject.icon}
                              alt={subject.name}
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
                            <div className="absolute left-full top-0 bg-white shadow-lg border rounded-md p-3 w-56 z-50">
                              {chapterMap[subject.name].map(
                                (chapter, index) => (
                                  <Link
                                    key={chapter.id}
                                    href={`/subjects/${subject.name.toLowerCase()}/${
                                      chapter.id
                                    }`}
                                    className="block text-gray-600 hover:text-sky-600 text-sm p-1"
                                  >
                                    {`${String(index + 1).padStart(2, "0")}. ${
                                      chapter.title
                                    }`}
                                  </Link>
                                )
                              )}
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

        {/* Note: bottom-32, bottom-20, bottom-5 */}
        {/* Sunset Help button for now */}
        {/* <div className="absolute bottom-5 left-0 w-full flex justify-center">
          <Link
            href="/help"
            className="flex flex-col items-center gap-1"
            onClick={() => setActive("help")}
          >
            <div
              className={`text-3xl ${
                active === "help" ? "text-sky-600" : "text-gray-500"
              }`}
            >
              <IoHelpCircleOutline />
            </div>
            <span
              className={`text-xs ${
                active === "help"
                  ? "text-sky-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Help
            </span>
          </Link>
        </div>*/}

        {/* Placeholder for Profile */}
        {/* <div className="absolute bottom-20 left-0 w-full flex justify-center">
          <Link
            href="/student/profile"
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-sky-600"
          >
            <img
              src="/avatar-placeholder.png"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs">Profile</span>
          </Link>
        </div> */}

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
