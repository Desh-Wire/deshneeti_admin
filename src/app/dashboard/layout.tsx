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
            <main className='w-full'>
                <div className='flex flex-row gap-4 items-center py-4 pl-4'>
                    <SidebarTrigger />
                    <Navbar user={user} />
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}

export default layout