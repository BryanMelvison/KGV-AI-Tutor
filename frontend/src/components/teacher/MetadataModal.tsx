"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

const MetadataModal = ({ onClose }: { onClose: () => void }) => {
  const [subject, setSubject] = useState("");
  const [totalChapters, setTotalChapters] = useState(1);
  const [chapters, setChapters] = useState([{ chapterNumber: 1, title: "" }]);

  // Automatically update chapter inputs when totalChapters changes
  useEffect(() => {
    const newChapters = Array.from({ length: totalChapters }, (_, i) => ({
      chapterNumber: i + 1,
      title: chapters[i]?.title || "",
    }));
    setChapters(newChapters);
  }, [totalChapters]);

  const handleChange = (index: number, value: string) => {
    const updated = [...chapters];
    updated[index].title = value;
    setChapters(updated);
  };

  const handleSubmit = () => {
    const metadata = {
      textbook: {
        subject,
        totalChapters,
        chapters,
      },
    };

    console.log("📦 Metadata submitted:", metadata);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed z-50 inset-0 flex items-center justify-center bg-black/30"
    >
      <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <Dialog.Title className="text-2xl font-bold text-blue-800 mb-4">
          📖 Textbook Metadata
        </Dialog.Title>

        {/* Subject Input */}
        <div className="space-y-2 mb-4">
          <label className="block font-medium text-sm text-gray-700">
            Subject
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-[#17171F] border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="e.g., Biology"
          />
        </div>

        {/* Total Chapters */}
        <div className="space-y-2 mb-6">
          <label className="block font-medium text-sm text-gray-700">
            Total Chapters
          </label>
          <input
            type="number"
            min={1}
            value={totalChapters}
            onChange={(e) => setTotalChapters(Number(e.target.value))}
            className="w-full border text-[#17171F] rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="e.g., 21"
          />
        </div>

        {/* Dynamic Chapter Inputs */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            Chapter Titles
          </h3>
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div key={index} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Chapter {chapter.chapterNumber} Title
                </label>
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full border text-[#17171F] rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder={`Enter title for Chapter ${chapter.chapterNumber}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Save Metadata
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default MetadataModal;
