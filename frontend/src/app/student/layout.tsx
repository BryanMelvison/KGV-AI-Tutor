"use client";

import { useVerifyUser } from "@/hooks/useVerifyUser";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useVerifyUser();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 text-[#17171F]">
        <Image
          src="/logo-square.svg"
          alt="Logo"
          width={80}
          height={80}
          className="mb-6"
        />
        <div className="flex items-center gap-3 text-lg font-medium text-blue-700">
          <FaSpinner className="animate-spin text-blue-500" />
          Verifying your session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
