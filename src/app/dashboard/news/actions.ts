'use server'

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from 'uuid';

export const getAuthors = async () => {
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
            },
        });
        return authors;
    } catch (e) {
        console.log(e);
    }
};

export const getCategories = async () => {
    try {
        const supabase = await createClient();
        const user = await supabase.auth.getUser();

        if (!user) {
            throw new Error("You must be logged in to view this page");
        }

        const categories = await db.category.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        return categories;
    } catch (e) {
        console.log(e);
    }
};

export const uploadNewsImage = async ({
    file,
    oldPhotoUrl,
    oldFullPath
}: {
    file: File;
    oldPhotoUrl?: string | null;
    oldFullPath?: string | null;
}) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error("You must be logged in to upload images");
        }

        // Delete old photo if it exists using fullPath
        if (oldFullPath) {
            const { error: deleteError, data: deleteData } = await supabase
                .storage
                .from("deshneeti")
                .remove([oldFullPath]);

            console.log("Delete attempt result:", { deleteError, deleteData });

            if (deleteError) {
                console.error("Error deleting old image:", deleteError);
            }
        }

        // Validate file
        if (!file.type.startsWith("image/")) {
            throw new Error("File must be an image");
        }

        const MAX_FILE_SIZE = 500 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            throw new Error("File size must be less than 500KB");
        }

        // Generate new file path
        const fileExt = file.name.split(".").pop();
        const fileName = `news/${uuidv4()}.${fileExt}`;

        // Upload new file
        const { error: uploadError, data } = await supabase
            .storage
            .from("deshneeti")
            .upload(fileName, file, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        // Get the full path and public URL
        const fullPath = data.path; // Using path from upload response

        const { data: { publicUrl } } = supabase
            .storage
            .from("deshneeti")
            .getPublicUrl(fileName);

        return { publicUrl, fullPath };

    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export const createNews = async ({
    headingEng,
    headingHin,
    headingUrd,
    taglineEng,
    taglineHin,
    taglineUrd,
    pictureUrl,
    picturePath,
    contentEng,
    contentHin,
    contentUrd,
    authorId,
    categoryId,
    tags,
    readTime,
}: {
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
    authorId: string;
    categoryId: string;
    tags: string[];
    readTime: number;
}) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            throw new Error("You must be logged in to create news items");
        }

        const newsItem = await db.newsItem.create({
            data: {
                headingEng,
                headingHin,
                headingUrd,
                taglineEng,
                taglineHin,
                taglineUrd,
                pictureUrl,
                picturePath,
                contentEng,
                contentHin,
                contentUrd,
                authorId,
                categoryId,
                tags,
                readTime
            }
        });

        return newsItem;

    } catch (error) {
        console.error("Error creating news item:", error);
        throw error;
    }
};

export const searchNews = async (query: string) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");

    return db.newsItem.findMany({
        where: {
            OR: [
                { headingEng: { contains: query, mode: 'insensitive' } },
                { headingHin: { contains: query, mode: 'insensitive' } },
                { headingUrd: { contains: query, mode: 'insensitive' } },
                { taglineEng: { contains: query, mode: 'insensitive' } },
                { taglineHin: { contains: query, mode: 'insensitive' } },
                { taglineUrd: { contains: query, mode: 'insensitive' } },
                { contentEng: { contains: query, mode: 'insensitive' } },
                { contentHin: { contains: query, mode: 'insensitive' } },
                { contentUrd: { contains: query, mode: 'insensitive' } },
                { tags: { hasSome: [query] } },
                { author: { name: { contains: query, mode: 'insensitive' } } },
                { category: { name: { contains: query, mode: 'insensitive' } } }
            ]
        },
        include: {
            author: {
                select: {
                    name: true,
                    photoUrl: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};