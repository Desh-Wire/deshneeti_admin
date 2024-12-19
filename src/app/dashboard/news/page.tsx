'use client';

import { useProtectedRoute } from "@/utils/auth";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewsForm from "./NewsForm";

const Dashboard = () => {
    const { user, loading } = useProtectedRoute();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-[#ece2c8] p-6 w-full">
            <main className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col space-y-6">
                    {/* Header with Title */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Manage News Articles
                        </h2>
                        
                        {/* Create News Button with Modal */}
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create News
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Create News Article</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to create a new news article.
                                    </DialogDescription>
                                </DialogHeader>
                                <NewsForm user={user}/>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Search news articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full"
                        />
                    </div>

                    {/* Content Area - Placeholder for news list */}
                    <div className="mt-6">
                        <p className="text-gray-500 text-center py-8">
                            Your news articles will appear here
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;