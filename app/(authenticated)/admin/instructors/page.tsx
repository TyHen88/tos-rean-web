"use client"

import { useState } from "react"
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    Mail,
    GraduationCap,
    CheckCircle2,
    ShieldAlert,
    Edit2,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight
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

export default function ManageInstructors() {
    const [searchQuery, setSearchQuery] = useState("")

    const instructors = [
        {
            id: 1,
            name: "Dr. Jonathan Smith",
            email: "jonathan.s@tosrean.com",
            courses: 14,
            students: "4.2k",
            rating: 4.9,
            status: "ACTIVE",
            specialty: "Machine Learning",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            email: "sarah.j@tosrean.com",
            courses: 8,
            students: "1.8k",
            rating: 4.7,
            status: "PENDING_REVIEW",
            specialty: "UI/UX Design",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Michael Chen",
            email: "m.chen@tosrean.com",
            courses: 21,
            students: "8.5k",
            rating: 4.8,
            status: "ACTIVE",
            specialty: "Fullstack Development",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Master Instructors</h1>
                    <p className="text-muted-foreground mt-1">Onboard, moderate, and monitor your teaching elite.</p>
                </div>
                <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    Onboard Instructor
                </Button>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email or specialty..."
                        className="pl-11 h-12 bg-card/40 backdrop-blur-md rounded-xl border-border/40 focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-xl gap-2 border-border/40 px-6">
                        <Filter className="w-4 h-4" />
                        Specialty
                    </Button>
                    <Button variant="outline" className="h-12 rounded-xl border-border/40 px-6">
                        Status
                    </Button>
                </div>
            </div>

            {/* Modern Table Layout */}
            <div className="glass-card rounded-3xl border border-border/50 bg-card/50 overflow-hidden shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/30 bg-muted/20">
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Instructor</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Stats</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {instructors.map((instructor) => (
                                <tr key={instructor.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border-2 border-primary/20 group-hover:border-primary transition-colors">
                                                <AvatarImage src={instructor.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {instructor.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                                                    {instructor.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
                                                    <GraduationCap className="w-3 h-3" /> {instructor.specialty}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Courses</p>
                                                <p className="font-bold">{instructor.courses}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Impact</p>
                                                <p className="font-bold text-[oklch(0.6_0.118_184.704)]">{instructor.students}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <Badge className={`rounded-lg font-bold text-[10px] tracking-wider ${instructor.status === 'ACTIVE'
                                                ? 'bg-[oklch(0.6_0.118_184.704)]/10 text-[oklch(0.6_0.118_184.704)] border-[oklch(0.6_0.118_184.704)]/20'
                                                : 'bg-accent/10 text-accent border-accent/20'
                                            }`} variant="outline">
                                            {instructor.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-accent">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
                                                    <DropdownMenuItem className="rounded-lg gap-2 py-2.5">
                                                        <ExternalLink className="w-4 h-4" /> View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg gap-2 py-2.5">
                                                        <Edit2 className="w-4 h-4" /> Edit Permissions
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="rounded-lg gap-2 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
                                                        <Trash2 className="w-4 h-4" /> Revoke Access
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

                {/* Pagination Footer */}
                <div className="p-6 border-t border-border/30 bg-muted/10 flex items-center justify-between">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                        Showing 3 of 128 instructors
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
