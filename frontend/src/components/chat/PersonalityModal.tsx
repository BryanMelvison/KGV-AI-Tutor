"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { pushStudentPersonality } from "@/api/chat";

interface PersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonalityModal({
  isOpen,
  onClose,
}: PersonalityModalProps) {
  const [learningStyle, setLearningStyle] = useState("");
  const [interest, setInterest] = useState("");
  const [personalityType, setPersonalityType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await pushStudentPersonality({
        learningStyle,
        interest,
        personalityType,
      });
      onClose();
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all">
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                🧠 Personalize Your Learning
              </DialogTitle>

              <div className="space-y-6">
                {/* Learning Style */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    📝 How would you like the explanation to be delivered?
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value)}
                  >
                    <option value="">Select a style</option>
                    <option value="Simple">
                      Simple with basic explanations
                    </option>
                    <option value="Brief">Brief summaries</option>
                    <option value="Detailed">
                      Detailed and elaborated responses
                    </option>
                  </select>
                </div>

                {/* Motivation Type */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    🚀 What motivates you most when studying a subject?
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={personalityType}
                    onChange={(e) => setPersonalityType(e.target.value)}
                  >
                    <option value="">Select motivation</option>
                    <option value="Applications">
                      Real-world applications
                    </option>
                    <option value="Facts">Interesting facts or stories</option>
                    <option value="Practice">
                      Practice questions and exercises
                    </option>
                  </select>
                </div>

                {/* Interest */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    🎯 Among these, which interests you the most?
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    <option value="">Choose a topic</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Football">Football</option>
                    <option value="Music">Music</option>
                    <option value="Food">Food</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
