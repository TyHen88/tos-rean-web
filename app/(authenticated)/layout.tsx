"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { NavSidebar } from "@/components/nav-sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <NavSidebar />
      </aside>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="pt-24 pb-24 px-6 md:px-10 lg:pt-10 lg:pb-10">{children}</div>
      </main>
    </div>
  )
}
