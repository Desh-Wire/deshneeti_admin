'use client'

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

const Navbar = ({ user }: { user: User }) => {
    const supabase = createClient();

    return (
        <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 shadow-md px-6 py-4 flex items-center justify-between">
            {/* Logo and Heading */}
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/home">
                    <img
                        src="/img/logo.png"
                        alt="Deshneeti Logo"
                        className="w-12 h-12 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                </Link>
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                    Welcome, <span className="text-red-500">{user.email}</span>
                </h1>
            </div>

            {/* Logout Button */}
            <button
                className="bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium 
                shadow-md transition-all duration-300 
                hover:bg-red-600 hover:shadow-lg active:scale-95"
                onClick={() => supabase.auth.signOut()}
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;
