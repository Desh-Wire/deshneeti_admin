'use server'

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";

// Fetch stats for Authors
export const getAuthorsStats = async () => {
    try {
        const supabase = await createClient();
        const user = await supabase.auth.getUser();

        if (!user) {
            throw new Error("You must be logged in to view this page");
        }

        const authors = await db.author.findMany({
            select: {
                id: true,
                name: true,
                
                _count: {
                    select: {
                        newsItems: true, // Count news items for each author
                    },
                },
            },
        });

        const totalAuthors = await db.author.count();

        return { authors, totalAuthors };
    } catch (e) {
        console.log(e);
    }
};

export const addAuthor = async ({ authorName, photoUrl }: { authorName: string, photoUrl: string | null }) => {
    try {
        // Ensure user is logged in
        const supabase = await createClient();
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to perform this action");
        }

        // Set default photo URL if none is provided
        const defaultPhotoUrl = "https://ncdynpeyquxlxndpxlng.supabase.co/storage/v1/object/sign/Author%20Profile%20Images/icons8-author-94.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdXRob3IgUHJvZmlsZSBJbWFnZXMvaWNvbnM4LWF1dGhvci05NC5wbmciLCJpYXQiOjE3MzQxODg3NjEsImV4cCI6MzE3MDYyNjUyNzYxfQ.ycpVfxnxDfnf3LMflZpdz2EXOs_8hHn7FunhofEqmtQ&t=2024-12-14T15%3A06%3A01.656Z";

        // Create a new author
        const newAuthor = await db.author.create({
            data: {
                name: authorName,
                photoUrl: photoUrl || defaultPhotoUrl,
            },
        });

        return newAuthor;
    } catch (e) {
        console.log(e);
        throw new Error("Failed to add author");
    }
};