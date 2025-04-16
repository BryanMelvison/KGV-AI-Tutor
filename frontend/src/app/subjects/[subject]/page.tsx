"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getChapter } from "@/api/chapter";

export default function SubjectEntryRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const subject = typeof params.subject === "string" ? params.subject : "";

  useEffect(() => {
    const redirectToLatestChapter = async () => {
      if (!subject) return;

      const data = await getChapter(subject);

      if (data.length > 0) {
        const firstChapterId = data[0];
        router.replace(`/subjects/${subject}/${firstChapterId}`);
      }
    };

    redirectToLatestChapter();
  }, [subject, router]);
}
