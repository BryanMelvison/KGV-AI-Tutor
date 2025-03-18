"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchLatestExercise } from "@/api/exerciseApi";
import { useQuiz } from "@/context/SmartQuizContext";
import SmartQuizModal from "@/components/smart-quiz/SmartQuizModal";

const Dashboard = () => {
  const [latestExercise, setLatestExercise] = useState<{
    subject: string;
    name: string;
    id: string;
  } | null>(null);

  const router = useRouter();
  const { isOpen, openQuiz, closeQuiz } = useQuiz();

  // Fetch latest exercise on mount
  useEffect(() => {
    const loadExercise = async () => {
      const data = await fetchLatestExercise();
      if (data) setLatestExercise(data);
    };
    loadExercise();
  }, []);

  return (
    <div className="p-6 bg-[#E8E9F2] min-h-screen">
      {/* Greeting */}
      <div className="text-2xl text-[#17171F]">
        Good Morning, <span className="font-bold">Nico R.</span> ✌️
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {/* Exercises Card */}
        <div
          className="bg-white p-5 rounded-xl shadow-md flex flex-col items-start space-y-4 cursor-pointer hover:bg-gray-100 hover:shadow-lg active:bg-gray-200 active:shadow-inner"
          onClick={() =>
            latestExercise && router.push(`/exercises/${latestExercise.id}`)
          }
        >
          <Image
            src="/exercise-icon.svg"
            alt="Exercises"
            width={60}
            height={60}
            className="w-10 h-10 lg:w-20 lg:h-20 md:w-16 md:h-16"
          />
          <div>
            <h3 className="font-bold text-[#17171F]">Exercises</h3>
            {latestExercise ? (
              <p className="text-gray-500 text-sm">
                Pick up where you left off:{" "}
                <span className="font-semibold text-indigo-600">
                  {latestExercise.subject} - {latestExercise.name}
                </span>
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Loading latest exercise...
              </p>
            )}
          </div>
        </div>

        {/* Smart Quiz Card */}
        <div
          className="bg-white p-5 rounded-xl shadow-md flex flex-col items-start space-y-4 cursor-pointer hover:bg-gray-100 hover:shadow-lg active:bg-gray-200 active:shadow-inner"
          onClick={openQuiz}
        >
          <Image
            src="/smart-quiz-icon.svg"
            alt="Smart Quiz"
            width={60}
            height={60}
            className="w-10 h-10 lg:w-20 lg:h-20 md:w-16 md:h-16"
          />
          <div>
            <h3 className="font-bold text-[#17171F]">Smart Quiz</h3>
            <p className="text-gray-500 text-sm">
              Train your brain, retain the gain
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Recent Chats */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-[#17171F]">
            Most Recent Chats
          </h2>

          {/* Chat Item */}
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="mb-4 border-b pb-4 last:border-none">
                {/* Chat Header */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="font-semibold text-base text-[#17171F]">
                      Chat Title Here
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-[#747479]">
                    12:09 AM
                  </span>
                </div>

                {/* Subject & Chapter */}
                <p className="text-xs text-gray-500 mb-2">
                  <span className="font-semibold text-indigo-600">
                    Subject: Spoken English
                  </span>{" "}
                  • 📖 Chapter: 12
                </p>

                {/* Chat Content */}
                <p className="text-sm text-[#747479] mt-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
        </div>

        {/* My Subjects */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-[#17171F]">
            My Subjects
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Biology", icon: "/biology-icon.svg", color: "#F9A3A4" },
              {
                name: "Chemistry",
                icon: "/chemistry-icon.svg",
                color: "#F2F3FD",
              },
              { name: "Physics", icon: "/physics-icon.svg", color: "#FDFAF2" },
            ].map((subject) => (
              <div
                key={subject.name}
                onClick={() =>
                  router.push(`/subjects/${subject.name.toLowerCase()}`)
                }
                className="bg-white p-4 rounded-lg shadow-sm flex flex-col space-y-3 border border-[#ECECED] cursor-pointer hover:shadow-md active:shadow-inner transition"
              >
                <div
                  className="w-full h-full border border-[#ECECED] p-6 lg:p-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: subject.color }}
                >
                  <Image
                    src={subject.icon}
                    alt={subject.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 lg:w-20 lg:h-20 md:w-16 md:h-16"
                  />
                </div>
                <span className="font-semibold text-[#17171F] text-sm">
                  {subject.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Quiz Modal */}
      <SmartQuizModal isOpen={isOpen} onClose={closeQuiz} />
    </div>
  );
};

export default Dashboard;
