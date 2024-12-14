'use server'

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server"

export const getStats = async () => {

    try {
        //check for current user
        const supabase = await createClient();
        const user = await supabase.auth.getUser();

        //if no user, return error
        if (!user) {
            throw new Error("You must be logged in to view this page");
        }

        //get stats from supabase
        const totalNewsItems = await db.newsItem.count();
        const totalCategories = await db.category.count();
        const totalViews = await db.newsItem.aggregate({
            _sum: {
                views: true
            }
        });

        return {
            email: user.data.user?.email,
            totalNewsItems,
            totalCategories,
            totalViews: totalViews._sum.views || 0
        }
    } catch (e) {
        console.log(e);
    }

}