'use client';

import { useProtectedRoute } from "@/utils/auth";
import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import NewsForm from "./NewsForm";
import NewsResults from "./NewsResults";
import { searchNews } from "./actions";

const Dashboard = () => {
    const { user, loading } = useProtectedRoute();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [results, setResults] = useState<{
        id: string;
        authorId: string;
        headingEng: string;
        headingHin: string;
        headingUrd: string;
        taglineEng: string;
        taglineHin: string;
        taglineUrd: string;
        contentEng: string;
        contentHin: string;
        contentUrd: string;
        imageUrl: string;
        publishedAt: string;
        views: number;
        youtube: string; // Add this field
        author: { id: string; name: string; photoUrl: string; email: string; };
        category: { id: string, name: string; };
        pictureUrl: string;
        picturePath: string;
        createdAt: string;
        readTime: number;
        tags: string[];
    }[]>([]);

    const searchMutation = useMutation({
        mutationFn: searchNews,
        onSuccess: (data) => {
            const formattedData = data.map((item: any) => ({
                ...item,
                imageUrl: item.imageUrl || '',
                publishedAt: item.publishedAt || '',
                pictureUrl: item.pictureUrl || '',
                picturePath: item.picturePath || '',
                createdAt: item.createdAt || '',
                readTime: item.readTime || 0,
                tags: item.tags || [],
                youtube: item.youtube || '', // Add this field
                author: {
                    ...item.author,
                    id: item.author.id || '',
                },
            }));
            setResults(formattedData);
        }
    });

    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchMutation.mutate(searchQuery);
        }
    };

    if (!user || loading) return null;

    return (
        <div className="min-h-screen bg-[#ece2c8] p-6 w-full">
            <main className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Manage News Articles</h2>
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
                                </DialogHeader>
                                <NewsForm user={user}/>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Search */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Search news articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button 
                            onClick={handleSearch}
                            disabled={searchMutation.isPending}
                        >
                            {searchMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Search'
                            )}
                        </Button>
                    </div>

                    {/* Results */}
                    <div className="mt-6">
                        {searchMutation.isSuccess && <NewsResults results={results} user={user}/>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;