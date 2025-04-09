"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function MockLoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = (role: "student" | "teacher") => {
    login({ name: "Alicia", role });
    if (role === "student") {
      router.push("/student/dashboard");
    } else if (role === "teacher") {
      router.push("/teacher/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Mock Login</h1>
      <div className="space-y-4">
        <button
          onClick={() => handleLogin("student")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 mr-4 transition"
        >
          Login as Student
        </button>
        <button
          onClick={() => handleLogin("teacher")}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition"
        >
          Login as Teacher
        </button>
      </div>
    </div>
  );
}
