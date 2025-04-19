"use client";

import { FaChartBar, FaClipboardList, FaBookOpen } from "react-icons/fa";

const ClassOverview = () => {
  const stats = [
    {
      title: "Exercise Completion",
      value: "84%",
      icon: <FaChartBar />,
      color: "from-green-200 to-green-300 text-green-800",
    },
    {
      title: "Smart Quiz Accuracy",
      value: "71%",
      icon: <FaClipboardList />,
      color: "from-blue-200 to-blue-300 text-blue-800",
    },
    {
      title: "Top Missed Topic",
      value: "Ecology",
      icon: <FaBookOpen />,
      color: "from-yellow-200 to-yellow-300 text-yellow-800",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-md flex flex-col justify-center items-start space-y-2`}
        >
          <div className="text-2xl">{stat.icon}</div>
          <h4 className="text-sm font-semibold">{stat.title}</h4>
          <p className="text-lg font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ClassOverview;
