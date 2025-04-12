"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function MockLoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const [name, setName] = useState("Alicia");
  const [role, setRole] = useState<"student" | "teacher" | "">("");

  const handleLogin = () => {
    if (!name || !role) return alert("Please enter a name and select a role!");
    login({ name, role });
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
      {/* Logo */}
      <Image
        src="/logo.svg"
        alt="App Logo"
        width={240}
        height={240}
        className="mb-6"
      />

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Welcome Back! 🚀
      </h1>

      {/* Login Box */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Your Email
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Alicia"
            className="w-full px-4 py-2 text-[#17171F] border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Select Role
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setRole("student")}
              className={`w-1/2 px-4 py-2 rounded-lg border transition ${
                role === "student"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("teacher")}
              className={`w-1/2 px-4 py-2 rounded-lg border transition ${
                role === "teacher"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              Teacher
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition shadow"
        >
          Login
        </button>
      </div>
    </div>
  );
}
