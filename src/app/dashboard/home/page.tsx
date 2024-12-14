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
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // Handle unauthenticated user
    if (!user) {
        router.push("/error");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#ece2c8] p-6 w-full">
            <main className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-black mb-6">
                    Welcome to your dashboard!
                </h2>
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Your Statistics</h3>
                    {error ? (
                        <p className="text-red-500">Failed to load stats: {error.message}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg shadow-md flex flex-col items-center">
                                <span className="text-xl font-bold text-gray-700">{data?.totalNewsItems || 0}</span>
                                <span className="text-sm text-gray-500">Total News Items</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-md flex flex-col items-center">
                                <span className="text-xl font-bold text-gray-700">{data?.totalCategories || 0}</span>
                                <span className="text-sm text-gray-500">Total Categories</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-md flex flex-col items-center">
                                <span className="text-xl font-bold text-gray-700">{data?.totalViews || 0}</span>
                                <span className="text-sm text-gray-500">Total Views</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
