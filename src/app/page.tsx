'use client'

import { useAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/dashboard/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ece2c8] to-[#f5f5dc] p-6 space-y-10">
      {/* Logo Section */}
      <div className="w-40 h-40 md:w-48 md:h-48 relative">
        <img
          src="/img/logo.png"
          alt="Deshneeti Logo"
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Heading Section */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 transition-all duration-300 hover:text-red-600">
        Welcome to Deshneeti's Admin Page
      </h1>

      {/* Login Button */}
      <button
        onClick={() => router.push("/login")}
        className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold 
          shadow-lg transform transition-all duration-300 
          hover:bg-red-700 hover:shadow-xl 
          active:scale-95"
      >
        Login
      </button>
    </div>
  );
}
