'use client';

import { useProtectedRoute } from "@/utils/auth";
import NewsForm from "./NewsForm";
import { useState } from "react";

const Dashboard = () => {
    const { user, loading } = useProtectedRoute();
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#ece2c8]">
                <span className="loader"></span>
            </div>
        );
    }

    const toggleSection = (section: string) => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-[#ece2c8] p-6 w-full">
            <main className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-black mb-6">
                    Manage News Articles
                </h2>

                {/* CRUD Operations Expandable Divs */}
                <div className="space-y-4">
                    {/* Create News Section */}
                    <div
                        onClick={() => toggleSection("create")}
                        className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all"
                    >
                        <h3 className="text-lg font-semibold">Create News</h3>
                        {expandedSection === "create" && (
                            <div className="mt-4">
                                <NewsForm />
                            </div>
                        )}
                    </div>

                    {/* Read News Section */}
                    <div
                        onClick={() => toggleSection("read")}
                        className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all"
                    >
                        <h3 className="text-lg font-semibold">Read News</h3>
                        {expandedSection === "read" && (
                            <div className="mt-4">
                                <p>Display your news reading logic here.</p>
                            </div>
                        )}
                    </div>

                    {/* Update News Section */}
                    <div
                        onClick={() => toggleSection("update")}
                        className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all"
                    >
                        <h3 className="text-lg font-semibold">Update News</h3>
                        {expandedSection === "update" && (
                            <div className="mt-4">
                                <p>Display your news update form here.</p>
                            </div>
                        )}
                    </div>

                    {/* Delete News Section */}
                    <div
                        onClick={() => toggleSection("delete")}
                        className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all"
                    >
                        <h3 className="text-lg font-semibold">Delete News</h3>
                        {expandedSection === "delete" && (
                            <div className="mt-4">
                                <p>Display your news deletion logic here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
