"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getChapterData, ChapterData } from "@/api/chapter";
import SubjectOverviewPage from "@/components/subjects/SubjectOverviewPage";

export default function ChapterPage() {
  const params = useParams();
  const subject = typeof params.subject === "string" ? params.subject : "";
  const chapter = typeof params.chapter === "string" ? params.chapter : "";

  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getChapterData(subject, chapter);
      setData(result);
      setLoading(false);
    };

    if (subject && chapter) fetchData();
  }, [subject, chapter]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <SubjectOverviewPage data={data} />;
}
