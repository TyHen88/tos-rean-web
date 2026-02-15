"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavSidebar } from "./nav-sidebar"
import { LayoutDashboard, BookOpen, GraduationCap, User, Library, Menu, Users } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const role = user?.role?.toUpperCase() || "STUDENT"

  const getNavItems = () => {
    if (role === "ADMIN") {
      return [
        { href: "/admin/dashboard", label: "Analysis", icon: LayoutDashboard },
        { href: "/admin/students", label: "Students", icon: Users },
        { href: "/admin/instructors", label: "Staff", icon: GraduationCap },
        { href: "/profile", label: "Profile", icon: User },
      ]
    }
    if (role === "INSTRUCTOR") {
      return [
        { href: "/instructor/dashboard", label: "Hub", icon: LayoutDashboard },
        { href: "/instructor/courses", label: "Courses", icon: GraduationCap },
        { href: "/instructor/students", label: "Learners", icon: Users },
        { href: "/profile", label: "Profile", icon: User },
      ]
    }
    return [
      { href: "/dashboard", label: "Home", icon: LayoutDashboard },
      { href: "/my-learning", label: "My Hub", icon: GraduationCap },
      { href: "/courses", label: "Browse", icon: BookOpen },
      { href: "/profile", label: "Profile", icon: User },
    ]
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                <Menu className="w-6 h-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 border-r-border/50">
              <NavSidebar />
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">TosRean</span>
          </Link>

          <div className="w-10" />
        </div>
      </div>

      {/* Mobile Bottom Navigation - Glassmorphism */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${isActive
                  ? "text-primary bg-primary/10 scale-105"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
