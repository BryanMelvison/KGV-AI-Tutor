"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchLatestExercise } from "@/api/exercise";
import { getSubjectsData, Subject } from "@/api/mockSubject";
import { getChapter } from "@/api/chapter";
import { useQuiz } from "@/context/SmartQuizContext";
import SmartQuizModal from "@/components/smart-quiz/SmartQuizModal";
import { unslugify } from "@/helpers/slugify";
import StatsCard from "@/components/StatsCard";
import { FaBolt, FaBookOpen, FaCheckCircle, FaRobot } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  getTotalChatSessions,
  getRecentChatSessions,
  RecentChatSession,
} from "@/api/chat";

const Dashboard = () => {
  const [latestExercise, setLatestExercise] = useState<{
    subject: string;
    chapter: string;
    letter: string;
  }>();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [entryChapters, setEntryChapters] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [totalChats, setTotalChats] = useState<number>(0);
  const [recentChats, setRecentChats] = useState<RecentChatSession[]>([]);

  const { isOpen, openQuiz, closeQuiz } = useQuiz();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const loadDashboardData = async () => {
      const fetchedSubjects = await getSubjectsData();
      setSubjects(fetchedSubjects);

      const chapterMap: Record<string, string> = {};
      for (const subject of fetchedSubjects) {
        const data = await getChapter(subject.name.toLowerCase());
        if (data.length > 0) {
          chapterMap[subject.name] = data[0];
        }
      }
      setEntryChapters(chapterMap);

      try {
        const total = await getTotalChatSessions();
        setTotalChats(total);
      } catch (err) {
        console.error("Error loading chat session total:", err);
      }

      try {
        const chats = await getRecentChatSessions();
        setRecentChats(chats.slice(0, 4));
      } catch (err) {
        console.error("Error loading recent chats:", err);
      }

      setLoading(false);
    };

    const fetchData = async () => {
      const data = await fetchLatestExercise();
      setLatestExercise(data);
    };
    fetchData();

    loadDashboardData();
  }, []);

  const formatReadableTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen animate-pulse space-y-6">
        <div className="h-8 bg-gray-300 rounded w-1/3" />

        <div className="grid grid-cols-2 gap-4 mt-5">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-md space-y-4"
            >
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-md space-y-3"
            >
              <div className="h-5 w-1/3 bg-gray-200 rounded" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-4 w-full bg-gray-100 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {user?.displayName || "Student"}. ✨
          </h1>
          <p className="text-[#747479]">Ready to learn something new today?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Syllabus Completed"
            value="56%"
            icon={<FaBookOpen className="text-blue-600" />}
            color="#DBEAFE"
          />
          <StatsCard
            title="Exercises Done"
            value="134"
            icon={<FaCheckCircle className="text-green-600" />}
            color="#DCFCE7"
          />
          <StatsCard
            title="AI Assistant Used"
            value={`${totalChats} Chat${totalChats === 1 ? "" : "s"}`}
            icon={<FaRobot className="text-purple-600" />}
            color="#EDE9FE"
          />

          <StatsCard
            title="Smart Quizzes"
            value="8 Attempts"
            icon={<FaBolt className="text-yellow-600" />}
            color="#FEF9C3"
          />
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          {/* Exercises Card */}
          <div
            className="bg-white p-5 rounded-xl shadow-md flex flex-col items-start space-y-4 cursor-pointer hover:bg-gray-100 hover:shadow-lg active:bg-gray-200 active:shadow-inner"
            onClick={() =>
              latestExercise &&
              router.push(
                `/student/subjects/${latestExercise.subject.toLowerCase()}/${
                  latestExercise.chapter
                }?exercise=${latestExercise.letter}`
              )
            }
          >
            <Image
              src="/exercise-icon.svg"
              alt="Exercises"
              width={60}
              height={60}
              className="w-10 h-10 lg:w-16 lg:h-16 md:w-12 md:h-12"
            />
            <div>
              <h3 className="font-bold ">Exercises</h3>
              {latestExercise ? (
                <p className="text-gray-500 text-sm">
                  Pick up where you left off:{" "}
                  <span className="font-semibold text-[#5DA2D5]">
                    {latestExercise.subject} -{" "}
                    {unslugify(latestExercise.chapter)} - Exercise{" "}
                    {latestExercise.letter}
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
            onClick={() => openQuiz()}
          >
            <Image
              src="/smart-quiz-icon.svg"
              alt="Smart Quiz"
              width={60}
              height={60}
              className="w-10 h-10 lg:w-16 lg:h-16 md:w-12 md:h-12"
            />
            <div>
              <h3 className="font-bold ">Smart Quiz</h3>
              <p className="text-gray-500 text-sm">
                Train your brain, retain the gain
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Recent Chats */}
          <div className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-3">
            <h2 className="text-lg font-semibold mb-2">Most Recent Chats</h2>

            {recentChats.length > 0 ? (
              <div className="flex flex-col space-y-3">
                {recentChats.map((chat, index) => (
                  <div
                    key={chat.sessionId}
                    className="cursor-pointer hover:bg-gray-50 rounded-lg transition p-2"
                    onClick={() =>
                      router.push(
                        `/student/subjects/${chat.subjectName.toLowerCase()}/${
                          chat.chapterName
                        }/assistant-chat?sessionId=${chat.sessionId}`
                      )
                    }
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h3 className="font-semibold text-base">
                          {chat.sessionName}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-[#747479]">
                        {formatReadableTimestamp(chat.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-[#5DA2D5]">
                        Subject: {chat.subjectName}
                      </span>{" "}
                      • 📖 Chapter: {unslugify(chat.chapterName)}
                    </p>
                    <p className="text-sm text-[#747479] mt-1 line-clamp-2">
                      {chat.message || "No summary yet"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent chats found.</p>
            )}
          </div>

          {/* My Subjects */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 ">My Subjects</h2>

            <div className="grid grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.name}
                  onClick={() =>
                    router.push(
                      `/student/subjects/${subject.name.toLowerCase()}/${
                        entryChapters[subject.name]
                      }`
                    )
                  }
                  className="bg-white p-4 rounded-lg shadow-sm flex flex-col space-y-3 border border-[#ECECED] cursor-pointer hover:shadow-md active:shadow-inner transition"
                >
                  <div
                    className="w-full h-full border border-[#ECECED] p-6 lg:p-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: subject.color }}
                  >
                    <Image
                      src={subject.icon}
                      alt={subject.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 lg:w-16 lg:h-16 md:w-12 md:h-12"
                    />
                  </div>
                  <span className="font-semibold  text-sm">{subject.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Quiz Modal */}
        <SmartQuizModal isOpen={isOpen} onClose={closeQuiz} />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
