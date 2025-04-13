"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReportPage = ({ params }: { params: { studentId: string } }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [hasExported, setHasExported] = useState(false); // 🛡️ Prevent multiple exports

  useEffect(() => {
    const exportToPDF = async () => {
      if (hasExported) return; // already downloaded
      const input = reportRef.current;
      if (!input) return;

      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${params.studentId}-report.pdf`);
      setHasExported(true); // ✅ Set guard
    };

    const timeout = setTimeout(exportToPDF, 300);

    return () => clearTimeout(timeout);
  }, [hasExported, params.studentId]);

  return (
    <div className="p-6">
      <div ref={reportRef} className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl  font-bold mb-4">Student Report</h1>
        <p className="text-sm text-gray-600 mb-2">Name: Alicia Sutikno</p>
        <p className="text-sm text-gray-600 mb-2">
          Student ID: {params.studentId}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <p className="">✅ 10/12 Exercises Completed</p>
          <p className="">📊 Quiz Accuracy: 87%</p>
          <p className="">❓ Most Asked Topic: Human Physiology</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
