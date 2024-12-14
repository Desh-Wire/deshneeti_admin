'use client';

import { useProtectedRoute } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "./actions";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const { user, loading } = useProtectedRoute();
    const router = useRouter();

    // Fetch stats using React Query
    const { data, isLoading: statsLoading, error } = useQuery({
        queryKey: ["stats"],
        queryFn: getStats,
        retry: true,
        retryDelay: 500,
        enabled: !!user, // Disable fetching if user is not authenticated
    });

    // Handle loading state
    if (loading || statsLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#ece2c8]">
                <div className="text-gray-600 font-semibold text-lg">Loading...</div>
            </div>
        );
    }

    // Handle unauthenticated user
    if (!user) {
        router.push("/error");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#ece2c8] p-6">
            <main className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-black mb-6 text-center">
                    Welcome to Your Dashboard!
                </h2>
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Statistics</h3>
                    {error ? (
                        <p className="text-red-500 text-center">Failed to load stats: {error.message}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                                <span className="text-3xl font-extrabold text-gray-800">{data?.totalNewsItems || 0}</span>
                                <p className="mt-2 text-gray-600">Total News Items</p>
                            </div>
                            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                                <span className="text-3xl font-extrabold text-gray-800">{data?.totalCategories || 0}</span>
                                <p className="mt-2 text-gray-600">Total Categories</p>
                            </div>
                            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                                <span className="text-3xl font-extrabold text-gray-800">{data?.totalViews || 0}</span>
                                <p className="mt-2 text-gray-600">Total Views</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
