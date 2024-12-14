'use server'

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";

// Fetch stats for Categories
export const getCategoriesStats = async () => {
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
                _count: {
                    select: {
                        newsItems: true, // Count news items in each category
                    },
                },
            },
        });

        const totalCategories = await db.category.count();

        return { categories, totalCategories };
    } catch (e) {
        console.log(e);
    }
};

export const addCategory = async (categoryName: string) => {
    try {
        // Ensure user is logged in
        const supabase = await createClient();
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to perform this action");
        }

        // Create a new category
        const newCategory = await db.category.create({
            data: {
                name: categoryName,
            },
        });

        return newCategory;
    } catch (e) {
        console.log(e);
        throw new Error("Failed to add category");
    }
};