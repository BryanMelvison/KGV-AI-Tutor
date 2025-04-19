"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MasteryChecklistItem } from "@/api/mockStudents";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
);

type ChecklistByChapter = Record<string, MasteryChecklistItem[]>;

function groupByChapter(checklist: MasteryChecklistItem[]): ChecklistByChapter {
  const grouped: ChecklistByChapter = {};
  checklist.forEach((item) => {
    const chapter = item.chapter; // ✅ Now using the `chapter` field directly
    if (!grouped[chapter]) grouped[chapter] = [];
    grouped[chapter].push(item);
  });
  return grouped;
}

export default function ChapterMasteryProgression({
  checklist,
}: {
  checklist: MasteryChecklistItem[];
}) {
  const grouped = groupByChapter(checklist);

  const labels = Object.keys(grouped);
  const dataValues = labels.map((chapter) => {
    const total = grouped[chapter].length;
    const completed = grouped[chapter].filter((i) => i.completed).length;
    return Math.round((completed / total) * 100);
  });

  const data = {
    labels,
    datasets: [
      {
        label: "% Completed",
        data: dataValues,
        backgroundColor: "#6366F1",
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
        title: {
          display: true,
          text: "Mastery Progress (%)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Chapter",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.x}% completed`,
        },
      },
    },
  };

  return (
    <div>
      <p className="text-gray-600 mb-4">
        Progression of mastery per chapter. Shows how many learning objectives
        in each chapter have been completed.
      </p>
      <div className="bg-white px-4 py-2 rounded-lg shadow-md">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
