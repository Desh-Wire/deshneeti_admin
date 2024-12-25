'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { convertFromRaw, Editor, EditorState } from 'draft-js';

interface NewsItem {
    id: string;
    headingEng: string;
    headingHin: string;
    headingUrd: string;
    taglineEng: string;
    taglineHin: string;
    taglineUrd: string;
    pictureUrl: string;
    contentEng: string;
    contentHin: string;
    contentUrd: string;
    author: {
        name: string;
        photoUrl: string;
    };
    category: {
        name: string;
    };
    createdAt: string;
    readTime: number;
    views: number;
    tags: string[];
}

const NewsResults = ({ results }: { results: NewsItem[] }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const parseContent = (content: string) => {
        try {
            const contentState = convertFromRaw(JSON.parse(content));
            return EditorState.createWithContent(contentState);
        } catch {
            return null;
        }
    };

    return (
        <div className="space-y-6">
            {results.map((item) => {
                const editorStateEng = parseContent(item.contentEng);
                const editorStateHin = parseContent(item.contentHin);
                const editorStateUrd = parseContent(item.contentUrd);

                return (
                    <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        {/* Header Section */}
                        <div
                            className="flex justify-between items-start cursor-pointer"
                            onClick={() =>
                                setExpandedId(expandedId === item.id ? null : item.id)
                            }
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <Image
                                    src={item.author.photoUrl}
                                    alt={item.author.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full shadow-md"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {item.headingEng}
                                    </h3>
                                    <div className="text-sm text-gray-600 flex gap-2 flex-wrap">
                                        <span className="font-medium">{item.author.name}</span>
                                        <span>•</span>
                                        <span className="italic">{item.category.name}</span>
                                        <span>•</span>
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{item.readTime} min read</span>
                                        <span>•</span>
                                        <span>{item.views} views</span>
                                    </div>
                                </div>
                            </div>
                            {expandedId === item.id ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {/* Expanded Content */}
                        {expandedId === item.id && (
                            <div className="mt-4 space-y-6">
                                {/* Main Image */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Featured Image:
                                    </h4>
                                    <Image
                                        src={item.pictureUrl}
                                        alt={item.headingEng}
                                        width={400}
                                        height={250}
                                        className="rounded-lg object-cover shadow-md"
                                    />
                                </div>

                                {/* Sections */}
                                {[
                                    { title: 'English', heading: item.headingEng, tagline: item.taglineEng, content: editorStateEng },
                                    { title: 'Hindi', heading: item.headingHin, tagline: item.taglineHin, content: editorStateHin },
                                    { title: 'Urdu', heading: item.headingUrd, tagline: item.taglineUrd, content: editorStateUrd },
                                ].map(({ title, heading, tagline, content }) => (
                                    <div key={title}>
                                        <h4 className="text-lg font-semibold text-gray-800">{title}:</h4>
                                        <p className="text-sm text-gray-600 mt-2">Heading:</p>
                                        <p className="text-xl font-bold text-gray-900">{heading}</p>
                                        <p className="text-sm text-gray-600 mt-2">Tagline:</p>
                                        <p className="text-gray-700 font-medium">{tagline}</p>
                                        <p className="text-sm text-gray-600 mt-2">Content:</p>
                                        {content ? (
                                            <div className="border rounded-md p-4 bg-gray-50 shadow-sm">
                                                <Editor
                                                    editorState={content}
                                                    readOnly
                                                    onChange={() => { }}
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-gray-700">
                                                Unable to render {title} content.
                                            </p>
                                        )}
                                    </div>
                                ))}

                                {/* Tags */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Tags:</h4>
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {item.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-sm shadow-sm"
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
