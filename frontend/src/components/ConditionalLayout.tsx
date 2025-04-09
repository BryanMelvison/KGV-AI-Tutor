"use client";

import { useUser } from "@/context/UserContext";
import NavBar from "@/components/nav-bar/NavBar";
import { usePathname } from "next/navigation";

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  if (!isLoginPage && user?.role === undefined) {
    return (
      <div className="p-6 bg-emerald-50 min-h-screen animate-pulse space-y-6">
        <div className="h-8 bg-gray-300 rounded w-1/3" />

        <div className="grid grid-cols-2 gap-4 mt-5">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-md space-y-4"
            >
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-md space-y-3"
            >
              <div className="h-5 w-1/3 bg-gray-200 rounded" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-4 w-full bg-gray-100 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isTeacher = user?.role === "teacher";
  const shouldShowNav = !isTeacher && !isLoginPage;

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
