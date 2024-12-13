'use client'

import { useProtectedRoute } from "@/utils/auth"

const dashboard = () => {

    const { user, loading } = useProtectedRoute();

    if (!user) {
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
        <div className="min-h-screen bg-[#ece2c8] p-6 w-full">
           
            <main className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-black">
                    Add News Here!
                </h2>
            </main>

        </div>
    );
};

export default dashboard