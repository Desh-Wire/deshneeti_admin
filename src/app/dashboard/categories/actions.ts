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


export const updateCategory = async ({ categoryId, categoryName }: { categoryId: string, categoryName: string }) => {
    try {
        // Ensure user is logged in
        const supabase = await createClient();
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to perform this action");
        }

        // Update the category
        const updatedCategory = await db.category.update({
            where: { id: categoryId },
            data: { name: categoryName },
        });

        return updatedCategory;

    } catch (e) {
        console.log(e);
        throw new Error("Failed to update category");
    }
}


export const deleteCategory = async (categoryId: string) => {
    try {
        // Ensure user is logged in
        const supabase = await createClient();
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error("You must be logged in to perform this action");
        }

        // Delete the category
        const deletedCategory = await db.category.delete({
            where: { id: categoryId },
        });

        return deletedCategory;

    } catch (e) {
        console.log(e);
        throw new Error("Failed to delete category");
    }
}

export const searchCategory = async (category:string) => {
    try {
        const supabase = await createClient();
        const user = await supabase.auth.getUser();

        if (!user) {
            throw new Error("You must be logged in to view this page");
        }

        const categories = await db.category.findMany({
            where: {
                name: {
                    contains: category,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        newsItems: true,
                    },
                },
            },
        });

        return categories;
    } catch (e) {
        console.log(e);
    }
}