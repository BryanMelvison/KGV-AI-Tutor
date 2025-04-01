"use client";

import { useEffect, useState } from "react";
import SubjectCard from "@/components/subjects/SubjectCard";
import { getSubjectsData, Subject } from "@/api/mockSubject";
import { getChapterData } from "@/api/mockChapter";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [entryChapters, setEntryChapters] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjectsAndChapters = async () => {
      const fetchedSubjects = await getSubjectsData();
      setSubjects(fetchedSubjects);

      const chapterMap: Record<string, string> = {};
      for (const subject of fetchedSubjects) {
        const data = await getChapterData(subject.name.toLowerCase(), "latest");
        if (data.chapters.length > 0) {
          chapterMap[subject.name] = decodeURIComponent(data.chapters[0].id);
        }
      }
      setEntryChapters(chapterMap);
      setLoading(false);
    };

    loadSubjectsAndChapters();
  }, []);

  return (
    <div className="p-6 bg-[#E8E9F2] min-h-screen">
      <div className="text-2xl text-[#17171F] font-bold mb-5">My Subjects</div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-[#ECECED] flex flex-col space-y-3"
              >
                <div className="w-full h-32 bg-gray-200 rounded-lg" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.name}
              name={subject.name}
              icon={subject.icon}
              color={subject.color}
              progress={subject.progress}
              entryChapter={entryChapters[subject.name] || "Loading..."}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
