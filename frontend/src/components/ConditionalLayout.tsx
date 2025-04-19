"use client";

import { useUser } from "@/context/UserContext";
import NavBar from "@/components/nav-bar/NavBar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, userLoaded } = useUser();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";
  const shouldShowNav = !isTeacher && !isLoginPage && isStudent;

  if (!userLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 text-[#17171F]">
        <div className="flex items-center gap-3 text-lg font-medium text-blue-700">
          <FaSpinner className="animate-spin text-blue-500" />
          Verifying user...
        </div>
      </div>
    );
  }

  return (
    <>
      {shouldShowNav && <NavBar />}
      <main className={`${shouldShowNav ? "pl-20" : ""} flex-1 h-full`}>
        {children}
      </main>
    </>
  );
};

export default ConditionalLayout;
