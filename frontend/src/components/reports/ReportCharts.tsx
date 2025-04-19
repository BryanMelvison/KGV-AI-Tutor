"use client";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Title,
  Legend
);

interface Exercise {
  label: string;
  attempts: number;
  completedOn: string;
}

const generateMockExercises = (count: number = 8): Exercise[] => {
  const today = new Date();
  const exercises: Exercise[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (count - i - 1));
    const label = `LO${i + 1}`;
    const attempts = Math.floor(Math.random() * 5) + 1;
    const completedOn = date.toISOString().split("T")[0];
    exercises.push({ label, attempts, completedOn });
  }

  return exercises;
};

export default function ReportCharts({
  exercises,
}: {
  exercises?: Exercise[];
}) {
  const [data, setData] = useState<Exercise[]>([]);

  useEffect(() => {
    if (exercises && exercises.length > 0) {
      setData(exercises);
    } else {
      setData(generateMockExercises(8));
    }
  }, [exercises]);

  if (!data.length) return <p className="text-red-500">No data available.</p>;

  const highThreshold = 3;

  const attemptsData = {
    labels: data.map((ex) => ex.label),
    datasets: [
      {
        label: "Attempts Before Mastery",
        data: data.map((ex) => ex.attempts),
        backgroundColor: data.map((ex) =>
          ex.attempts > highThreshold ? "#F87171" : "#6366F1"
        ),
      },
    ],
  };

  const masteryData = {
    labels: data.map((ex) => ex.completedOn),
    datasets: [
      {
        label: "Cumulative Mastery",
        data: data.map((_ex, i) => i + 1),
        borderColor: "#10B981",
        backgroundColor: "#D1FAE5",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const sharedOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Attempts Bar Chart */}
        <div className="bg-white px-4 py-2 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-2">Exercise Attempts</h3>
          <p className="text-gray-600 mb-4">
            Attempts per exercise before completion, showing improvement trend.
          </p>
          <Bar
            data={attemptsData}
            options={{
              ...sharedOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                  title: { display: true, text: "Attempts" },
                },
                x: { title: { display: true, text: "Learning Objectives" } },
              },
              plugins: {
                ...sharedOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: (ctx: any) =>
                      `Attempts: ${ctx.parsed.y}${
                        ctx.parsed.y > highThreshold ? " ⚠️ High" : ""
                      }`,
                  },
                },
              },
            }}
          />
          <p className="text-sm text-gray-500 mt-2 italic">
            ⚠️ Red bars indicate high number of attempts (more than{" "}
            {highThreshold})
          </p>
        </div>

        {/* Mastery Line Chart */}
        <div className="bg-white px-4 py-2 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-2">Mastery Over Time</h3>
          <p className="text-gray-600 mb-4">
            Tracks the student’s learning progress over time by showing the
            order and speed at which each learning objective was completed.
          </p>

          <Line
            data={masteryData}
            options={{
              ...sharedOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Cumulative No. of Learning Objectives Mastered",
                  },
                },
                x: {
                  title: { display: true, text: "Date of Completion" },
                },
              },
              plugins: {
                ...sharedOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: (ctx: any) => {
                      const index = ctx.dataIndex;
                      const ex = data[index];
                      return `${ex.label} mastered on ${ex.completedOn}`;
                    },
                  },
                },
              },
            }}
          />
          <p className="text-sm text-gray-500 mt-2 italic">
            📈 Shows how quickly the student mastered each learning objective.
          </p>
        </div>
      </div>
    </div>
  );
}
