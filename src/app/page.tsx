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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ece2c8] space-y-8 p-4">
      <div className="w-48 h-48 relative">
        <img
          src="/img/logo.png"
          alt="Deshneeti Logo"
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h1 className="text-4xl font-bold text-black text-center transition-all duration-300 hover:text-red-600">
        Welcome to Deshneeti's Admin Page
      </h1>

      <button
        onClick={() => router.push("/login")}
        className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold 
          shadow-lg transition-all duration-300 
          hover:bg-red-700 hover:shadow-xl 
          active:transform active:scale-95"
      >
        Login
      </button>
    </div>
  );
}