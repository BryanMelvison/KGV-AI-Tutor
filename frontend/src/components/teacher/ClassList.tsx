"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const classData = {
  "Class A": [
    { name: "Alicia Sutikno", id: "s1" },
    { name: "Nico R.", id: "s2" },
  ],
  "Class B": [
    { name: "Jordan L.", id: "s3" },
    { name: "Emily Z.", id: "s4" },
  ],
  "Class C": [
    { name: "Isaac T.", id: "s5" },
    { name: "Hana Y.", id: "s6" },
  ],
};

const ClassList = ({ selectedClass }: { selectedClass: string }) => {
  const router = useRouter();
  const students = classData[selectedClass] || [];

  const [query, setQuery] = useState("");

  const handleViewReport = (studentId: string) => {
    router.push(`/teacher/reports/${studentId}`);
  };

  const filteredStudents = students.filter((student) => {
    const lowerQuery = query.toLowerCase();
    return (
      student.name.toLowerCase().includes(lowerQuery) ||
      student.id.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div>
      {/* 🔍 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm"
        />
      </div>

      {/* 🧑‍🎓 Column Header */}
      <div className="grid grid-cols-[20%_1fr_auto] text-sm font-semibold text-[#6B7280] px-4 py-2 border-b border-gray-200">
        <span>ID</span>
        <span>Student Name</span>
        <span className="text-right">Action</span>
      </div>

      {/* Student List */}
      {filteredStudents.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {filteredStudents.map((student, i) => (
            <li
              key={student.id}
              className={`grid grid-cols-[20%_1fr_auto] items-center px-4 py-3 text-sm transition ${
                i % 2 === 0 ? "bg-[#FAFAFF]" : "bg-white"
              } hover:bg-indigo-50 rounded-md`}
            >
              <span className="text-[#374151]">{student.id}</span>
              <span className="font-medium text-[#111827]">{student.name}</span>
              <div className="flex justify-end">
                <a
                  href={`/teacher/reports/${student.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-indigo-500 text-white px-4 py-1.5 rounded-md hover:bg-indigo-600 transition"
                >
                  Generate Report
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 px-4 mt-3">No students found.</p>
      )}
    </div>
  );
};

export default ClassList;
