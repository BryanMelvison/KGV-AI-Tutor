"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getChapterData } from "@/api/mockChapter";

export default function SubjectEntryRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const subject = typeof params.subject === "string" ? params.subject : "";

  useEffect(() => {
    const redirectToLatestChapter = async () => {
      if (!subject) return;

      const data = await getChapterData(subject, "latest");

      if (data.chapters.length > 0) {
        const firstChapterId = data.chapters[0].id;
        router.replace(`/subjects/${subject}/${firstChapterId}`);
      }
    };

    redirectToLatestChapter();
  }, [subject, router]);
}
