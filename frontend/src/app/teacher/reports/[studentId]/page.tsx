"use client";

import { useParams } from "next/navigation";
import ReportCard from "@/components/smart-quiz/ReportCard";
import { mockStudents } from "@/api/mockStudents";
import { useRef } from "react";
import { generatePDF } from "@/helpers/pdfUtils";

export default function ReportGenerator() {
  const reportRef = useRef<HTMLDivElement>(null);
  const { studentId } = useParams();
  const student = mockStudents[studentId as string];

  const handleDownload = () => {
    if (reportRef.current) {
      generatePDF(reportRef.current, `Report-${studentId}`);
    }
  };

  if (!student) {
    return (
      <div className="p-10 text-center text-red-600">❌ Student not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4 flex flex-col items-center justify-start">
      {/* Download button */}
      <div className="mb-6 self-end pr-4">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Download PDF
        </button>
      </div>

      {/* Centered Report Card (A4 size: 794 x 1123 px) */}
      <div
        ref={reportRef}
        className="w-[794px] min-h-[1123px] bg-white p-8 text-black shadow-md border border-gray-300"
      >
        <ReportCard student={student} />
      </div>
    </div>
  );
}
