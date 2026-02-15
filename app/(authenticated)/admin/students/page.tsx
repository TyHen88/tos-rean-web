"use client"

import { useState } from "react"
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Download,
    BookOpen,
    Trophy,
    History,
    Mail,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    UserPlus
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StudentDirectory() {
    const [searchQuery, setSearchQuery] = useState("")

    const students = [
        {
            id: 1,
            name: "Alex Thompson",
            email: "alex.t@example.com",
            enrolled: 4,
            progress: "85%",
            completed: 2,
            status: "ACTIVE",
            joinedAt: "Jan 12, 2026",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Emma Wilson",
            email: "emma.w@example.com",
            enrolled: 12,
            progress: "92%",
            completed: 8,
            status: "TOP_LEARNER",
            joinedAt: "Dec 05, 2025",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "David Miller",
            email: "david.m@example.com",
            enrolled: 2,
            progress: "45%",
            completed: 0,
            status: "INACTIVE",
            joinedAt: "Feb 01, 2026",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Student Directory</h1>
                    <p className="text-muted-foreground mt-1">Manage global student records, enrollments and progress tracking.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-5 gap-2 border-border/50">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                        <UserPlus className="w-4 h-4" />
                        Add Student
                    </Button>
                </div>
            </div>

            {/* Control Strip */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students by name, email or ID..."
                        className="pl-11 h-12 bg-card/50 backdrop-blur-md rounded-xl border-border/50 focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-xl gap-2 border-border/50 px-6">
                        <BookOpen className="w-4 h-4" />
                        Course
                    </Button>
                    <Button variant="outline" className="h-12 rounded-xl border-border/50 px-6">
                        Status
                    </Button>
                </div>
            </div>

            {/* Directory Table */}
            <div className="glass-card rounded-3xl border border-border/50 bg-card/50 overflow-hidden shadow-2xl shadow-primary/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/20 bg-muted/20">
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Student Profile</th>
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">Learning Journey</th>
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">Status</th>
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border-2 border-primary/10 group-hover:border-primary/40 transition-all duration-300">
                                                <AvatarImage src={student.avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-bold">
                                                    {student.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-base leading-tight">{student.name}</p>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-8">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest opacity-60">Enrolled</p>
                                                <p className="font-bold text-sm tracking-tight">{student.enrolled}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest opacity-60">Avg. Progress</p>
                                                <p className="font-bold text-sm text-primary">{student.progress}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest opacity-60">Certified</p>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Trophy className="w-3 h-3 text-accent" />
                                                    <p className="font-bold text-sm">{student.completed}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-center">
                                            <Badge className={`rounded-lg font-bold text-[10px] tracking-widest px-2.5 py-1 ${student.status === 'TOP_LEARNER'
                                                    ? 'bg-[oklch(0.6_0.118_184.704)]/20 text-[oklch(0.6_0.118_184.704)] border-[oklch(0.6_0.118_184.704)]/30'
                                                    : student.status === 'ACTIVE'
                                                        ? 'bg-primary/10 text-primary border-primary/20'
                                                        : 'bg-muted text-muted-foreground opacity-70'
                                                }`} variant="outline">
                                                {student.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                                                <History className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-accent border border-transparent hover:border-border/50">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
                                                    <DropdownMenuLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60 px-3 py-2">Quick Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-xl gap-3 py-2.5 cursor-pointer">
                                                        <Mail className="w-4 h-4 text-primary" />
                                                        <span className="font-semibold text-sm">Send Direct Email</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl gap-3 py-2.5 cursor-pointer">
                                                        <Edit2 className="w-4 h-4 text-accent" />
                                                        <span className="font-semibold text-sm">View Learning Path</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="rounded-xl gap-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="font-semibold text-sm">Disable Account</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Rich Footer */}
                <div className="p-6 border-t border-border/20 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        <span>Page 1 of 540</span>
                        <span className="h-4 w-px bg-border/50" />
                        <span>Total: 12,482 Students</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-9 px-4 rounded-xl gap-2 border-border/40 font-bold text-xs uppercase" disabled>
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </Button>
                        <Button variant="outline" className="h-9 px-4 rounded-xl gap-2 border-border/40 font-bold text-xs uppercase hover:bg-primary hover:text-white transition-all">
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
