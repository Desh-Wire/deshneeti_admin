'use client'

import { AppSidebar } from '@/components/app-sidebar'
import Navbar from '@/components/Navbar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useProtectedRoute } from '@/utils/auth'
import { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {

    const { user, loading } = useProtectedRoute();

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#ece2c8]">
                Loading...
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full bg-gray-50 min-h-screen">
                {/* Navbar Section */}
                <div className="flex items-center gap-4 py-4 px-6 bg-gradient-to-r from-gray-50 to-gray-100 shadow-md">
                    <SidebarTrigger />
                    <Navbar user={user} />
                </div>

                {/* Main Content */}
                <div className="">
                    {children}
                </div>
            </main>

        </SidebarProvider>
    )
}

export default layout