'use client'

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

const Navbar = ({ user }: { user: User }) => {

    const supabase = createClient();

    return (
        <div className="flex flex-row w-full justify-between px-4">
            {/* photo and heading */}
            <div className="flex flex-row items-center gap-4">
                <Link href='/dashboard/home'>
                    <img
                        src="/img/logo.png"
                        alt="Deshneeti Logo"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </Link>
                <h1 className="text-xl font-semibold">
                    Welcome, <span className="text-red-500">{user.email}</span>
                </h1>
            </div>
            {/* logout button */}
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                onClick={() => supabase.auth.signOut()}
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar