'use client'

import { Home, Newspaper, Users, Tag } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/utils/utils"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard/home",
        icon: Home,
    },
    {
        title: "News",
        url: "/dashboard/news",
        icon: Newspaper,
    },
    {
        title: "Categories",
        url: "/dashboard/categories",
        icon: Tag,
    },
    {
        title: "Authors",
        url: "/dashboard/authors",
        icon: Users,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar className="w-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 py-3 text-lg font-bold text-gray-700 border-b border-gray-300">
                        Deshneeti Admin
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="mt-4 space-y-2">
                            {items.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className={cn(
                                        "flex items-center rounded-lg transition-all duration-300 cursor-pointer group",
                                        {
                                            "bg-red-50 text-red-600 font-semibold border-l-4 border-red-600":
                                                pathname === item.url,
                                            "hover:bg-gray-100 text-gray-700":
                                                pathname !== item.url,
                                        }
                                    )}
                                >
                                    <SidebarMenuButton asChild>
                                        <a
                                            href={item.url}
                                            className="flex items-center space-x-3"
                                        >
                                            <item.icon
                                                className={cn(
                                                    "w-5 h-5",
                                                    {
                                                        "stroke-red-600": pathname === item.url,
                                                        "stroke-gray-700": pathname !== item.url,
                                                    }
                                                )}
                                            />  
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
