"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  User,
  LogOut,
  Settings,
  Library,
  BookMarked,
  Users,
  BarChart3,
  FileText,
  Wallet,
  ShieldCheck,
  History,
  Briefcase
} from "lucide-react"

// --- Student Items ---
const studentItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-learning", label: "My Learning", icon: GraduationCap },
  { href: "/courses", label: "Browse Courses", icon: BookOpen },
  { href: "/resources", label: "Resources", icon: Library },
]

// --- Instructor Command Center ---
const instructorItems = [
  { href: "/instructor/dashboard", label: "Instructor Hub", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "Manage Courses", icon: BookMarked },
  { href: "/instructor/students", label: "Student Analytics", icon: Users },
  { href: "/instructor/assignments", label: "Evaluate Work", icon: FileText },
  { href: "/instructor/resources", label: "Resource Vault", icon: Library },
  { href: "/instructor/revenue", label: "Revenue", icon: Wallet },
]

// --- Admin Platform Control ---
const adminItems = [
  { href: "/admin/dashboard", label: "Platform Analysis", icon: BarChart3 },
  { href: "/admin/instructors", label: "Master Instructors", icon: Briefcase },
  { href: "/admin/students", label: "Student Directory", icon: Users },
  { href: "/admin/courses", label: "Course Moderation", icon: BookMarked },
  { href: "/admin/resources", label: "Global Assets", icon: Library },
  { href: "/admin/audit", label: "Audit Logs", icon: History },
  { href: "/admin/settings", label: "System Config", icon: ShieldCheck },
]

export function NavSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const role = user?.role?.toUpperCase() || "STUDENT"

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Premium Logo Section */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">TosRean</span>
        </Link>
      </div>

      {/* Navigation - Scrollable for many items */}
      <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Learner Section (Visible only for students) */}
        {role === "STUDENT" && (
          <div className="space-y-1">
            <p className="px-4 mb-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              Learner Portal
            </p>
            {studentItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Instructor Section */}
        {role === "INSTRUCTOR" && (
          <div className="space-y-1">
            <p className="px-4 mb-2 text-[10px] font-bold text-primary/70 uppercase tracking-widest">
              Instructor Command
            </p>
            {instructorItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Admin Section */}
        {role === "ADMIN" && (
          <div className="space-y-1">
            <p className="px-4 mb-2 text-[10px] font-bold text-[oklch(0.577_0.245_27.325)] uppercase tracking-widest">
              Platform Control
            </p>
            {adminItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* High-End User Profile Section */}
      <div className="p-4 border-t bg-muted/20 backdrop-blur-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3 hover:bg-background/80 hover:shadow-sm border border-transparent hover:border-border/50 transition-all duration-300">
              <Avatar className="w-10 h-10 border-2 border-primary/10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-70">
                  {role}
                </p>
              </div>
              <Settings className="w-4 h-4 text-muted-foreground transition-transform duration-500 hover:rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
            <DropdownMenuLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground/60 px-3 py-2">
              Management
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-lg py-2.5 cursor-pointer">
              <Link href="/profile" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">Public Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg py-2.5 cursor-pointer">
              <Link href="/profile" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-accent" />
                </div>
                <span className="font-medium">Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-medium">Sign Out</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
