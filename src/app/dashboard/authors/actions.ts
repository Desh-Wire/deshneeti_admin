'use server'

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from 'uuid';

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
                photoUrl: true,
                email: true,
                fullPath: true,

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

export const addAuthor = async ({ authorName, email, photoUrl, fullPath }: { authorName: string, email: string, photoUrl: string | null, fullPath: string }) => {
    try {
        //print the authorName, email, and photoUrl
        // console.log(authorName, email, photoUrl);
        // Ensure user is logged in
        const supabase = await createClient();
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to perform this action");
        }

        // Set default photo URL if none is provided
        const defaultPhotoUrl = "https://ncdynpeyquxlxndpxlng.supabase.co/storage/v1/object/public/deshneeti/author/icons8-author-94.png?t=2024-12-17T15%3A00%3A31.303Z";

        // Create a new author
        const newAuthor = await db.author.create({
            data: {
                name: authorName,
                email: email,
                photoUrl: photoUrl || defaultPhotoUrl,
                fullPath: fullPath
            },
        });

        return newAuthor;
    } catch (e) {
        console.log(e);
        throw new Error("Failed to add author");
    }
};

export const deleteAuthor = async (authorId: string) => {
    try {
        const supabase = await createClient();

        // Step 1: Fetch author details to get the photo URL
        const { data: author, error: fetchError } = await supabase
            .from("authors")
            .select("photoUrl")
            .eq("id", authorId)
            .single();

        if (fetchError || !author) {
            throw new Error("Author not found or failed to fetch author details.");
        }

        const photoUrl = author.photoUrl;

        // Step 2: Delete the author record
        const { error: deleteError } = await supabase.from("authors").delete().eq("id", authorId);

        if (deleteError) {
            throw new Error("Failed to delete author record.");
        }

        // Step 3: Delete the photo from Supabase Storage (if photoUrl exists)
        if (photoUrl) {
            // Extract the filename from the photo URL
            const filePath = photoUrl.split("/").pop(); // Gets the filename

            if (filePath) {
                const { error: storageError } = await supabase
                    .storage
                    .from("Author Profile Images")
                    .remove([filePath]);

                if (storageError) {
                    console.warn("Failed to delete photo from storage:", storageError.message);
                    // Optional: Log the error without blocking the main deletion process
                }
            }
        }

        return { success: true, message: "Author and associated photo deleted successfully." };
    } catch (error) {
        console.error("Error deleting author:", error);
        throw new Error("An error occurred while deleting the author.");
    }
}

export const updateAuthor = async ({
    authorId,
    authorName,
    email,
    photoUrl,
    fullPath,
}: {
    authorId: string;
    authorName: string;
    email: string;
    photoUrl: string | null;
    fullPath: string | null;
}) => {
    try {
        const supabase = await createClient();
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to perform this action");
        }

        // Update the author
        const updatedAuthor = await db.author.update({
            where: { id: authorId },
            data: {
                name: authorName,
                email: email,
                photoUrl: photoUrl || undefined,
                fullPath: fullPath || undefined,
            },
        });

        return updatedAuthor;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update author");
    }
};


export const uploadAuthorImage = async ({
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
        const fileName = `author/${uuidv4()}.${fileExt}`;

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

