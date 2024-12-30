'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Eye, Calendar, Tag, Type, Quote, FileText, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { deleteNews } from './actions'; // adjust the import path as needed
import { User } from '@supabase/supabase-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewsForm from './NewsForm';

interface NewsItem {
    id: string;
    headingEng: string;
    headingHin: string;
    headingUrd: string;
    taglineEng: string;
    taglineHin: string;
    taglineUrd: string;
    pictureUrl: string;
    picturePath: string;
    contentEng: string;
    contentHin: string;
    contentUrd: string;
    author: {
        id: string;
        name: string;
        photoUrl: string;
        email: string,
    };
    category: {
        id: string;
        name: string;
    };
    createdAt: string;
    readTime: number;
    views: number;
    tags: string[];
}

const NewsResults = ({ results, user }: { results: NewsItem[], user: User }) => {


    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = (news: NewsItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingNews(news);
        setIsModalOpen(true);
    };

    const handleDelete = async (newsId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent expanding/collapsing when clicking delete
        if (window.confirm('Are you sure you want to delete this news item?')) {
            setIsDeleting(newsId);
            try {
                await deleteNews(newsId);
                // You might want to refresh the news list here or show a success message
            } catch (error) {
                console.error('Failed to delete news:', error);
                alert('Failed to delete news item');
            } finally {
                setIsDeleting(null);
                //reload the page
                window.location.reload();
            }
        }
    };

    const parseContent = (content: string) => {
        try {
            const contentState = convertFromRaw(JSON.parse(content));
            return EditorState.createWithContent(contentState);
        } catch {
            return null;
        }
    };

    return (
        <div className="space-y-4">
            {results.map((item) => {
                const editorStateEng = parseContent(item.contentEng);
                const editorStateHin = parseContent(item.contentHin);
                const editorStateUrd = parseContent(item.contentUrd);


                return (
                    <div
                        key={item.id}
                        className="border-l-4 border-red-600 rounded-r-xl p-6 bg-white shadow-sm transition-all duration-200 hover:shadow-md relative"
                    >

                        {/* Action Buttons */}
                        {
                            // only show edit and delete if the logged in user created the news item or is the admin
                            (item.author.email === user.email || user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) &&
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <button
                                    onClick={(e) => handleDelete(item.id, e)}
                                    disabled={isDeleting === item.id}
                                    className={`p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors ${isDeleting === item.id ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    title="Delete news"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            onClick={(e) => handleEdit(item, e)}
                                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                                            title="Edit news"
                                        >
                                            <Edit size={20} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Edit News Article</DialogTitle>
                                        </DialogHeader>
                                        {editingNews && (
                                            <NewsForm
                                                user={user}
                                                newsItem={editingNews}
                                                // onClose={() => {
                                                //     setIsModalOpen(false);
                                                //     setEditingNews(null);
                                                // }}
                                            />
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </div>
                        }
                        <div
                            className="flex justify-between items-start cursor-pointer group"
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >
                            <div className="flex items-start gap-6 flex-1">
                                <div className="relative">
                                    <Image
                                        src={item.author.photoUrl}
                                        alt={item.author.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full ring-2 ring-red-100"
                                    />
                                    <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {item.category.name}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-medium text-gray-900 leading-tight group-hover:text-red-600">
                                        {item.headingEng}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="font-medium text-black">{item.author.name}</span>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Calendar size={14} className="text-red-600" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Clock size={14} className="text-red-600" />
                                            {item.readTime}m read
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Eye size={14} className="text-red-600" />
                                            {item.views.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-red-400 group-hover:text-red-600">
                                {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {expandedId === item.id && (
                            <div className="mt-8 space-y-8">

                                <Image
                                    src={item.pictureUrl}
                                    alt={item.headingEng}
                                    className="object-cover"
                                    height={580}
                                    width={500}
                                />


                                {[
                                    { title: 'English', heading: item.headingEng, tagline: item.taglineEng, content: editorStateEng },
                                    { title: 'Hindi', heading: item.headingHin, tagline: item.taglineHin, content: editorStateHin },
                                    { title: 'Urdu', heading: item.headingUrd, tagline: item.taglineUrd, content: editorStateUrd },
                                ].map(({ title, heading, tagline, content }) => (
                                    <div key={title} className="space-y-6 bg-gray-50 p-6 rounded-lg">
                                        <div className="flex items-center gap-2 text-lg font-medium text-black">
                                            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                            {title}
                                        </div>

                                        <div className="grid gap-6">
                                            <div className="relative">
                                                <div className="flex items-center gap-2 text-red-600 mb-2">
                                                    <Type size={16} />
                                                    <span className="text-sm font-medium">Heading</span>
                                                </div>
                                                <p className="text-lg font-medium text-black pl-6">
                                                    {heading}
                                                </p>
                                            </div>

                                            <div className="relative">
                                                <div className="flex items-center gap-2 text-red-600 mb-2">
                                                    <Quote size={16} />
                                                    <span className="text-sm font-medium">Tagline</span>
                                                </div>
                                                <p className="text-gray-700 pl-6">
                                                    {tagline}
                                                </p>
                                            </div>

                                            <div className="relative">
                                                <div className="flex items-center gap-2 text-red-600 mb-2">
                                                    <FileText size={16} />
                                                    <span className="text-sm font-medium">Content</span>
                                                </div>
                                                <div className="pl-6">
                                                    {content ? (
                                                        <div className="prose prose-gray max-w-none">
                                                            <Editor
                                                                editorState={content}
                                                                readOnly
                                                                onChange={() => { }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">
                                                            Unable to render {title} content.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <div className="flex items-center gap-2 text-red-600 mb-3">
                                        <Tag size={16} />
                                        <span className="text-sm font-medium">Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-sm text-black bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default NewsResults;