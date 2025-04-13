"use client";

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
            <h3 className="text-lg  font-medium mb-2">Upload Document</h3>
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
            <h3 className="text-lg  font-medium mb-2">Smart Quiz</h3>
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
            <h3 className="text-lg  font-medium mb-2">AI Chat</h3>
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
            <h3 className="text-lg  font-medium mb-2">Exercise Chat</h3>
            <p className="text-gray-500 mb-4">
              Get exercise recommendations and guidance.
            </p>
            <button
              onClick={() => router.push("/exercise-chat")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Exercise Chat
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <SmartQuizModal isOpen={isOpen} onClose={closeQuiz} />
    </div>
  );
}
