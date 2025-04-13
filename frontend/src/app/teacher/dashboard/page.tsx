"use client";

import DocumentUploader from "@/components/document/DocumentUploader";
import ReportOverview from "@/components/teacher/ReportOverview";
import ClassList from "@/components/teacher/ClassList";
import { useState } from "react";
import MetadataModal from "@/components/teacher/MetadataModal";
import { useRouter } from "next/navigation";
import { IoChevronDown } from "react-icons/io5";
import Image from "next/image";

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [selectedSubject, setSelectedSubject] = useState("Biology");
  const [showModal, setShowModal] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);

  const router = useRouter();

  const teacherName = "Ms. Sutikno";

  const handleUpload = async (file: File) => {
    console.log("File uploaded:", file);
    setShowModal(true);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md ">
        <Image
          src="/logo.svg"
          alt="AI Need Help Logo"
          width={200}
          height={200}
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-sm  bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8">
        <h1 className="text-3xl font-bold  mb-1">
          Welcome back, {teacherName}. ✨
        </h1>
        <p className="text-[#747479] mb-6 text-sm">
          Here's a quick look at how your students are doing today!
        </p>

        {/* Class + Subject Selector */}
        <div className="mb-6">
          <div className="w-full bg-white border shadow-md rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm text-[#747479] font-medium">
                You are viewing:
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-indigo-100 text-indigo-700 text-base font-medium px-4 py-1.5 rounded-full">
                  🏫 {selectedClass}
                </span>
                <span className="bg-pink-100 text-pink-700 text-base font-medium px-4 py-1.5 rounded-full">
                  📘 {selectedSubject}
                </span>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowClassMenu((prev) => !prev)}
                className="bg-white border border-indigo-500 text-indigo-600 text-sm px-4 py-1.5 rounded-md shadow hover:bg-indigo-50 flex items-center gap-1"
              >
                Change Class <IoChevronDown className="text-base" />
              </button>

              {showClassMenu && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border z-10">
                  {["Class A", "Class B", "Class C"].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        setSelectedClass(cls);
                        setShowClassMenu(false);
                      }}
                      className="block  w-full px-4 py-2 text-sm text-left hover:bg-indigo-50"
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload + Report Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold  mb-4">Upload a Textbook</h2>
            <div className="flex-1">
              <DocumentUploader onUpload={handleUpload} />
            </div>
          </div>

          {/* Report Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold  mb-4">
              Overview Reports for {selectedClass}
            </h2>
            <div className="flex-1">
              <ReportOverview />
            </div>
          </div>
        </div>

        {/* Class List Card */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold  mb-4">
            Students in {selectedClass}
          </h2>
          <ClassList selectedClass={selectedClass} />
        </div>

        {showModal && <MetadataModal onClose={() => setShowModal(false)} />}
      </main>
    </div>
  );
}
