"use client";

import { useState } from "react";
import {
  IoGridOutline,
  IoBookOutline,
  IoSparklesOutline,
  IoChevronForward,
  IoHelpCircleOutline,
} from "react-icons/io5";
import SmartQuizModal from "../smart-quiz/SmartQuizModal";
import { useQuiz } from "@/context/SmartQuizContext";
import Link from "next/link";

const NavBar = () => {
  const [active, setActive] = useState("dashboard");
  const [previousActive, setPreviousActive] = useState("dashboard");
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState(false);
  const { isOpen, openQuiz, closeQuiz } = useQuiz();

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
    { name: "Dashboard", icon: <IoGridOutline />, link: "/dashboard" },
    { name: "Subjects", icon: <IoBookOutline />, link: "/subjects" },
    { name: "Smart Quiz", icon: <IoSparklesOutline /> },
  ];

  const subjects = [
    {
      name: "Biology",
      code: "B",
      bg: "bg-gradient-to-r from-[#12172C] to-[#3A3F5C]",
      link: "/subjects/biology",
      topics: [
        { name: "Cell Biology", link: "/subjects/biology/cell-biology" },
        {
          name: "Human Physiology",
          link: "/subjects/biology/human-physiology",
        },
        { name: "Ecology & Environment", link: "/subjects/biology/ecology" },
      ],
    },
    {
      name: "Chemistry",
      code: "C",
      bg: "bg-gradient-to-r from-[#5A3DBE] to-[#8A6DDE]",
      link: "/subjects/chemistry",
      topics: [
        {
          name: "Atomic Structure",
          link: "/subjects/chemistry/atomic-structure",
        },
        {
          name: "Chemical Bonding",
          link: "/subjects/chemistry/chemical-bonding",
        },
        { name: "Acids & Bases", link: "/subjects/chemistry/acids-bases" },
      ],
    },
    {
      name: "Physics",
      code: "P",
      bg: "bg-gradient-to-r from-[#A33F7D] to-[#D36F9D]",
      link: "/subjects/physics",
      topics: [
        { name: "Mechanics", link: "/subjects/physics/mechanics" },
        {
          name: "Electricity & Magnetism",
          link: "/subjects/physics/electricity-magnetism",
        },
        { name: "Waves & Optics", link: "/subjects/physics/waves-optics" },
      ],
    },
  ];

  return (
    <div className="relative">
      {/* Sidebar (Collapsible) */}
      <div
        className={
          "fixed top-0 left-0 h-screen bg-white border-r shadow-md py-5 transition-all duration-300 w-20"
        }
      >
        {/* Navigation Items */}
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
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs ${
                      active === item.name.toLowerCase() || isOpen
                        ? "text-indigo-600 font-semibold"
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
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs ${
                      active === item.name.toLowerCase()
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              )}

              {/* Hover Subjects Dropdown */}
              {hoveredNav && item.name === "Subjects" && (
                <div className="absolute left-full top-0 bg-white shadow-lg border rounded-md p-3 w-48 z-50">
                  {subjects.map((subject) => (
                    <div
                      key={subject.name}
                      className="relative"
                      onMouseEnter={() => setHoveredSubject(subject.name)}
                      onMouseLeave={() => setHoveredSubject(null)}
                    >
                      <Link
                        href={subject.link}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md w-full"
                      >
                        <div
                          className={`w-8 h-8 flex items-center justify-center text-white font-semibold rounded-lg ${subject.bg}`}
                        >
                          {subject.code}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {subject.name}
                        </span>
                        <IoChevronForward className="ml-auto text-gray-400" />
                      </Link>

                      {/* Hover Subject Topics */}
                      {hoveredSubject === subject.name && (
                        <div className="absolute left-full top-0 bg-white shadow-lg border rounded-md p-3 w-48 z-50">
                          {subject.topics.map((topic) => (
                            <Link
                              key={topic.name}
                              href={topic.link}
                              className="block text-gray-600 hover:text-indigo-600 text-sm p-1"
                            >
                              {topic.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-[#ECECED] my-3"></div>

        {/* Bottom App Shortcuts */}
        <div className="space-y-3">
          {subjects.map((subject) => (
            <Link
              key={subject.name}
              href={subject.link}
              className="relative flex justify-center"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center text-white text-lg font-semibold rounded-lg ${subject.bg}`}
              >
                {subject.code}
              </div>
            </Link>
          ))}
        </div>

        {/* Help Shortcut */}
        <div className="absolute bottom-5 left-0 w-full flex justify-center">
          <Link
            href="/help"
            className="flex flex-col items-center gap-1"
            onClick={() => setActive("help")}
          >
            <div
              className={`text-3xl ${
                active === "help" ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              <IoHelpCircleOutline />
            </div>
            <span
              className={`text-xs ${
                active === "help"
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Help
            </span>
          </Link>
        </div>
      </div>
      <SmartQuizModal isOpen={isOpen} onClose={handleCloseQuiz} />
    </div>
  );
};

export default NavBar;
