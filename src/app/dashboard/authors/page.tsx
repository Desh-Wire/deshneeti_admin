'use client';

import { useProtectedRoute } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";
import { getAuthorsStats, updateAuthor } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddAuthorModal from "./AddAuthorModal";
import UpdateAuthorModal from "./UpdateAuthorModal";
import { Pencil } from "lucide-react";

const Authors = () => {
    const { user, loading } = useProtectedRoute();
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<any | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["authors"],
        queryFn: getAuthorsStats,
        retry: true,
        retryDelay: 500,
        enabled: !!user,
    });

    const handleUpdateAuthor = async (updatedData: { name: string; photoUrl?: string, fullPath?: string, active: boolean }) => {
        try {
            const updatedAuthor = await updateAuthor({
                authorId: selectedAuthor.id,
                authorName: updatedData.name,
                email: selectedAuthor.email,
                photoUrl: updatedData.photoUrl || null,
                fullPath: updatedData.fullPath || null,
                active: updatedData.active,
            });
            // Update the UI after the successful update
            setSelectedAuthor(updatedAuthor);
        } catch (error) {
            console.error("Error updating author:", error);
        }
    };

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

                    <div className="text-center mb-6">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                            onClick={() => setIsAddModalOpen(true)}
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
                                        <div
                                            key={author.id}
                                            className={`relative p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 ${author.active ? 'bg-gray-100' : 'bg-gray-200 opacity-75'
                                                }`}
                                        >
                                            {author.email === user.email && (
                                                <button
                                                    className="absolute top-2 right-2 text-gray-500 hover:text-blue-500"
                                                    onClick={() => {
                                                        setSelectedAuthor(author);
                                                        setIsUpdateModalOpen(true);
                                                    }}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                            )}
                                            <div className="relative">
                                                <img
                                                    src={author.photoUrl || '/default-avatar.png'}
                                                    alt={author.name}
                                                    className={`w-24 h-24 mx-auto rounded-full object-cover mb-4 ${!author.active && 'grayscale'
                                                        }`}
                                                />
                                                {!author.active && (
                                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
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

            {/* Modals */}
            <AddAuthorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            {selectedAuthor && (
                <UpdateAuthorModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={handleUpdateAuthor}
                    currentAuthor={selectedAuthor}
                />
            )}
        </>
    );
};

export default Authors;

