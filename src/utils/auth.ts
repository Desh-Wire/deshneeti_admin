'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

export function useAuth() {

    const supabase = createClient();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {

        const adminEmail = process.env.ADMIN_EMAIL;

        //get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsAdmin(session?.user?.email === adminEmail);
            setLoading(false);
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setIsAdmin(session?.user?.email === adminEmail);
            setLoading(false);

            if (event === "SIGNED_IN") {
                router.push("/dashboard");
            }

            if (event === "SIGNED_OUT") {
                router.push("/");
            }
        })

        return () => subscription.unsubscribe();

    }, [router])

    return { user, loading, isAdmin };
}

export function useProtectedRoute() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [loading, user, router])

    return { user, loading };
}