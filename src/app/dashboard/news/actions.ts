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
                photoUrl: true,
            },
            where:{
                active:true
            }
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
            author: true,
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const deleteNews = async (newsId: string) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            throw new Error("You must be logged in to delete news items");
        }

        // First get the news item to get the picture path
        const newsItem = await db.newsItem.findUnique({
            where: { id: newsId },
            select: { picturePath: true }
        });

        if (newsItem?.picturePath) {
            // Delete the associated image from storage
            const { error: deleteImageError } = await supabase
                .storage
                .from("deshneeti")
                .remove([newsItem.picturePath]);

            if (deleteImageError) {
                console.error("Error deleting image:", deleteImageError);
            }
        }

        // Delete the news item from the database
        const deletedNews = await db.newsItem.delete({
            where: { id: newsId }
        });

        return deletedNews;

    } catch (error) {
        console.error("Error deleting news item:", error);
        throw error;
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

export const updateNews = async ({
    newsId,
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
    oldPicturePath
}: {
    newsId: string;
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
    oldPicturePath?: string | null;
}) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            throw new Error("You must be logged in to update news items");
        }

        // If there's a new picture and an old picture path, delete the old picture
        if (oldPicturePath && picturePath !== oldPicturePath) {
            const { error: deleteError } = await supabase
                .storage
                .from("deshneeti")
                .remove([oldPicturePath]);

            if (deleteError) {
                console.error("Error deleting old image:", deleteError);
            }
        }

        const updatedNews = await db.newsItem.update({
            where: { id: newsId },
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

        return updatedNews;

    } catch (error) {
        console.error("Error updating news item:", error);
        throw error;
    }
};