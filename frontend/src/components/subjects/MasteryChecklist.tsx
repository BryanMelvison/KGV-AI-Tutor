"use client";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface MasteryChecklistProps {
  items: string[];
  status: boolean[]; // true = mastered, false = not yet
}

const MasteryChecklist = ({ items, status }: MasteryChecklistProps) => {
  const [expanded, setExpanded] = useState(false);

  const displayItems = expanded ? items : items.slice(0, 3);
  const displayStatus = expanded ? status : status.slice(0, 3);

  const masteredCount = status.filter((s) => s).length;
  const masteryPercent = Math.round((masteredCount / status.length) * 100);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Mastery Checklist
      </h3>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm text-gray-600 gap-1">
          <FaCheckCircle className="text-green-500" />
          <span>
            {masteredCount} of {status.length} learning objectives mastered
          </span>
        </div>

        <p className="text-sm font-medium text-gray-600">{masteryPercent}%</p>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
        <div
          className="h-full bg-green-400 rounded-full transition-all"
          style={{ width: `${masteryPercent}%` }}
        />
      </div>

      <ul className="space-y-2">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <div
              className={`w-4 h-4 rounded-full ${
                displayStatus[index] ? "bg-green-400" : "bg-gray-300"
              }`}
            />
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>

      {items.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default MasteryChecklist;
