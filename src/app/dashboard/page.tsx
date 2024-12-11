'use client'

import { useProtectedRoute } from "@/utils/auth"
import { createClient } from "@/utils/supabase/client";

const dashboard = () => {

    const { user, loading } = useProtectedRoute();

    const supabase = createClient();

    if(!user){
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#ece2c8]">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ece2c8] p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/img/logo.png"
                            alt="Deshneeti Logo"
                            className="w-12 h-12 object-contain"
                        />
                        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-black">{user?.email}</span>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold 
                    shadow-lg transition-all duration-300 
                    hover:bg-red-700 hover:shadow-xl"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-black mb-4">
                        Welcome to your dashboard!
                    </h2>
                </main>
            </div>
        </div>
    );
};

export default dashboard