"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { FaSpinner } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, fetchUserName, fetchUserRole } from "@/api/auth";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function RealLoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const shownRef = useRef(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchParams.get("expired") === "true" && !shownRef.current) {
      toast.error("Session expired. Please log in again.");
      shownRef.current = true;
    }
  }, [searchParams]);

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields.");

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);
      const { access_token, refresh_token } = res.data;

      sessionStorage.setItem("anh-token", access_token);

      const displayName = await fetchUserName();
      const role = await fetchUserRole();

      login({ displayName, role }, access_token, refresh_token);

      router.push(`/${role}/dashboard`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !loading) handleLogin();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Image
        src="/logo.svg"
        alt="App Logo"
        width={240}
        height={240}
        className="mb-6"
      />

      <h1 className="text-3xl font-bold text-blue-800 mb-2">
        Ready to explore? 🚀
      </h1>
      <p className="text-sm text-blue-600 mb-6">Sign in to continue</p>

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Email
          </label>
          <input
            type="email"
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., you@example.com"
            className="w-full px-4 py-2 border border-blue-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 pr-10 border border-blue-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-blue-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full mt-4 py-2 rounded-lg transition shadow text-white flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}
