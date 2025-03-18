"use client";

<<<<<<< HEAD
import { useQuiz } from "@/context/SmartQuizContext";
import { useRouter } from "next/navigation";
import SmartQuizModal from "@/components/smart-quiz/SmartQuizModal";
import DocumentUploader from "@/components/document/DocumentUploader";
import { useState } from "react";

export default function DashboardPage() {
  const { isOpen, openQuiz, closeQuiz } = useQuiz();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      // API logic for file uploads
      // 1. Create new FormData & append file to it (incl. additional metadata)
      //    const formData = new FormData();
      //    formData.append('file', file);
      // 2, Send request to API, assign to response variable
      //    const response = await fetch('/api/documents/upload', {
      //      method: 'POST',
      //      body: formData,
      //    });
      //    if (!response.ok) {
      //      throw new Error(`Upload failed: ${response.statusText}`);
      //    }
      // const data = await response.json();
      // 3. Handle successful upload (e.g., alert('Upload success!');)
      alert("Upload success!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed! Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Document Upload Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-[#17171F] font-medium mb-2">
              Upload Document
            </h3>
            <p className="text-gray-500 mb-4">
              Upload documents for analysis and processing.
            </p>
            <DocumentUploader
              onUpload={handleFileUpload}
              isLoading={isUploading}
            />
          </div>

          {/* Quiz Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-[#17171F] font-medium mb-2">
              Smart Quiz
            </h3>
            <p className="text-gray-500 mb-4">Take our Smart Quiz.</p>
            <button
              onClick={openQuiz}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Quiz
            </button>
          </div>

          {/* AI Chat Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-[#17171F] font-medium mb-2">AI Chat</h3>
            <p className="text-gray-500 mb-4">
              Chat with our AI assistant for help and guidance.
            </p>
            <button
              onClick={() => router.push("/ai-chat")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Chat
            </button>
          </div>

          {/* Exercise Chat Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-[#17171F] font-medium mb-2">
              Exercise Chat
            </h3>
            <p className="text-gray-500 mb-4">
              Get exercise recommendations and guidance.
            </p>
            <button
              onClick={() => router.push("/exercise-chat")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Exercise Chat
            </button>
=======
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHourglassHalf } from "react-icons/fa";
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
>>>>>>> origin/main
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Quiz Modal */}
      <SmartQuizModal isOpen={isOpen} onClose={closeQuiz} />
    </div>
  );
}
=======
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
>>>>>>> origin/main
