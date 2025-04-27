"use client";

import { useRouter } from "next/navigation";

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Unauthorized</h1>
        <p className="text-xl">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
