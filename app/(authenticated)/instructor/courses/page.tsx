"use client"

import { useState } from "react"
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Users,
    Star,
    BookOpen,
    Edit2,
    Trash2,
    ExternalLink
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ManageCourses() {
    const [searchQuery, setSearchQuery] = useState("")

    const courses = [
        {
            id: 1,
            title: "Mastering Next.js 14: From Zero to Hero",
            status: "PUBLISHED",
            students: 456,
            rating: 4.8,
            price: "$129.99",
            updatedAt: "2 days ago",
            thumbnail: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=400&h=250&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Advanced UI/UX Design with Figma",
            status: "PUBLISHED",
            students: 892,
            rating: 4.9,
            price: "$99.00",
            updatedAt: "1 week ago",
            thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?q=80&w=400&h=250&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Node.js Microservices Architecture",
            status: "DRAFT",
            students: 0,
            rating: 0,
            price: "$149.00",
            updatedAt: "3 hours ago",
            thumbnail: "https://images.unsplash.com/photo-1537432376769-00f5c2f44ad5?q=80&w=400&h=250&auto=format&fit=crop"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Manage Courses</h1>
                    <p className="text-muted-foreground mt-1">Create, edit, and monitor your curriculum performance.</p>
                </div>
                <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    New Curriculum
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search your library..."
                        className="pl-10 h-12 bg-card/50 backdrop-blur-md rounded-xl border-border/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 rounded-xl gap-2 border-border/50 px-6">
                    <Filter className="w-4 h-4" />
                    Filters
                </Button>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="glass-card rounded-2xl border border-border/50 bg-card/50 overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                                <div className="flex gap-2 w-full">
                                    <Button size="sm" className="flex-1 gap-2 rounded-lg bg-white text-black hover:bg-white/90">
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </Button>
                                    <Button size="sm" variant="secondary" className="gap-2 rounded-lg backdrop-blur-md bg-white/10 text-white hover:bg-white/20 border-white/20">
                                        <Eye className="w-3.5 h-3.5" /> Preview
                                    </Button>
                                </div>
                            </div>
                            <Badge
                                className={`absolute top-4 left-4 rounded-lg font-bold tracking-wider text-[10px] ${course.status === 'PUBLISHED'
                                        ? 'bg-[oklch(0.6_0.118_184.704)] text-white'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {course.status}
                            </Badge>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="font-bold text-lg leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                                {course.title}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest opacity-60">Students</p>
                                        <p className="text-xs font-bold">{course.students}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest opacity-60">Rating</p>
                                        <p className="text-xs font-bold">{course.rating || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-border/30">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-0.5">Price</p>
                                    <p className="font-bold text-lg text-primary">{course.price}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl backdrop-blur-xl bg-card/95 border-border/50">
                                        <DropdownMenuItem className="rounded-lg gap-2 py-2.5">
                                            <ExternalLink className="w-4 h-4" /> View Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg gap-2 py-2.5">
                                            <Users className="w-4 h-4" /> Student List
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="rounded-lg gap-2 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
                                            <Trash2 className="w-4 h-4" /> Delete Course
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create Card Placeholder */}
                <button className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/50 bg-card/10 hover:bg-primary/5 hover:border-primary/50 transition-all duration-500 group min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">Build New Course</p>
                        <p className="text-sm text-muted-foreground mt-1">Start your legacy today.</p>
                    </div>
                </button>
            </div>
        </div>
    )
}
