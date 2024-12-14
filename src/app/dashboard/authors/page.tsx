'use client';

import { useProtectedRoute } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";
import { getAuthorsStats } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddAuthorModal from "./AddAuthorModal";

const Authors = () => {
    const { user, loading } = useProtectedRoute();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ["authors"],
        queryFn: getAuthorsStats,
        retry: true,
        retryDelay: 500,
        enabled: !!user,
    });

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#ece2c8]">
                <span className="loader"></span>
            </div>
        );
    }

    if (!user) {
        router.push("/error");
        return null;
    }

    return (
        <>
            <div className="min-h-screen bg-[#ece2c8] p-6">
                <main className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-black mb-6 text-center">
                        Authors Overview
                    </h2>

                    {/* Button to open the modal */}
                    <div className="text-center mb-6">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Author
                        </button>
                    </div>

                    <div className="mt-8">
                        {error ? (
                            <p className="text-red-500 text-center">Failed to load authors: {error.message}</p>
                        ) : (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                    Total Authors: {data?.totalAuthors || 0}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                    {data?.authors.map((author: any) => (
                                        <div key={author.id} className="p-6 bg-gray-100 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                                            <span className="text-3xl font-extrabold text-gray-800">{author.name}</span>
                                            <p className="mt-2 text-gray-600">Total News Items: {author._count.newsItems}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <AddAuthorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Authors;
