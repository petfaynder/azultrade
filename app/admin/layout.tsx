"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, FileText, Users, Settings, LogOut, Menu, X, Bell, Search, Mail as MailIcon, ClipboardList, Target, Lightbulb, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Suspense } from "react"

const navigation = [
   { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
   { name: "Messages", href: "/admin/messages", icon: MailIcon },
   { name: "Quote Requests", href: "/admin/quotes", icon: ClipboardList },
   { name: "Products", href: "/admin/products", icon: Package },
   { name: "SEO Dashboard", href: "/admin/seo-dashboard", icon: Target },
   { name: "Content Opportunities", href: "/admin/content-opportunities", icon: Lightbulb },
   { name: "Categories", href: "/admin/categories", icon: Package },
   { name: "Blog", href: "/admin/blog", icon: FileText },
   { name: "JSON Blog Create", href: "/admin/blog/json-create", icon: FileText },
   { name: "Image Upload", href: "/admin/image-upload", icon: ImageIcon }, // New entry
   { name: "Users", href: "/admin/users", icon: Users },
   { name: "Settings", href: "/admin/settings", icon: Settings },
 ]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/admin/messages?status=Yeni&limit=1")
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count || 0)
      }
    } catch (error) {
      console.error("Failed to fetch unread messages count:", error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Fetch every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3 flex-grow overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.name === "Messages" && unreadCount > 0 && (
                    <Badge className="ml-auto">{unreadCount}</Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
        <div className="mt-auto px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex-1 overflow-auto">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search..." className="pl-10 w-full bg-gray-50 border-0 focus:ring-0 focus:border-transparent" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
