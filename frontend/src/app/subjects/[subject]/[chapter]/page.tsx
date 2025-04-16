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
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  return <SubjectOverviewPage data={data} />;
}
