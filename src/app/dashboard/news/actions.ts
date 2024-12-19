'use server'

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";

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