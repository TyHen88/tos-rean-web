"use client"

import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Mail,
    MessageSquare,
    Eye,
    Activity,
    Award,
    BookOpen,
    History
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function InstructorStudents() {
    const students = [
        {
            id: 1,
            name: "Alex Thompson",
            email: "alex.t@example.com",
            course: "Advanced UI Masterclass",
            progress: 92,
            performance: "Exemplary",
            engagement: "High",
            lastActive: "10 mins ago",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Maria Garcia",
            email: "m.garcia@example.com",
            course: "Next.js Fundamentals",
            progress: 45,
            performance: "Average",
            engagement: "Medium",
            lastActive: "2 hours ago",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "James Wilson",
            email: "j.wilson@example.com",
            course: "Advanced UI Masterclass",
            progress: 15,
            performance: "Needs Help",
            engagement: "Low",
            lastActive: "3 days ago",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Student Analytics</h1>
                    <p className="text-muted-foreground mt-1">Deep-dive into learner engagement and curriculum success.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-5 gap-2 border-border/50">
                        <MessageSquare className="w-4 h-4" />
                        Bulk Message
                    </Button>
                    <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                        <Activity className="w-4 h-4" />
                        Retention Report
                    </Button>
                </div>
            </div>

            {/* Analytics Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Engagement Index</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h3 className="text-4xl font-bold italic">84%</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-[oklch(0.6_0.118_184.704)] pb-1">
                            <ArrowUpRight className="w-3.5 h-3.5" /> +12%
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Higher than 82% of other instructors.</p>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-accent/5 border border-accent/10">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4">Completion Velocity</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h3 className="text-4xl font-bold italic">14<span className="text-xl font-medium not-italic ml-1">days</span></h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-[oklch(0.6_0.118_184.704)] pb-1">
                            <ArrowUpRight className="w-3.5 h-3.5" /> -3 days
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Average time to complete a course module.</p>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-muted/20 border border-border/20">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Certified Learners</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h3 className="text-4xl font-bold italic">842</h3>
                        <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">New Record</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Total certificates issued in the last 30 days.</p>
                </div>
            </div>

            {/* Control Surface */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search learners..."
                        className="pl-11 h-12 bg-card/40 backdrop-blur-md rounded-xl border-border/40"
                    />
                </div>
                <Button variant="outline" className="h-12 rounded-xl border-border/40 px-6 gap-2">
                    <Filter className="w-4 h-4" /> Filter by Performance
                </Button>
            </div>

            {/* Student List Container */}
            <div className="glass-card rounded-3xl border border-border/50 bg-card/50 overflow-hidden shadow-2xl shadow-primary/5">
                <div className="grid grid-cols-1 divide-y divide-border/20">
                    {students.map((student) => (
                        <div key={student.id} className="p-6 hover:bg-primary/5 transition-all duration-300 group">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                {/* Profile Brief */}
                                <div className="flex items-center gap-4 min-w-[300px]">
                                    <div className="relative">
                                        <Avatar className="w-14 h-14 border-2 border-primary/10 group-hover:border-primary transition-all duration-500">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{student.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-card flex items-center justify-center ${student.engagement === 'High' ? 'bg-[oklch(0.6_0.118_184.704)]' :
                                                student.engagement === 'Medium' ? 'bg-accent' : 'bg-destructive'
                                            }`}>
                                            <Activity className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight">{student.name}</h4>
                                        <p className="text-xs text-primary font-bold mt-0.5">{student.course}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
                                            <History className="w-3 h-3" /> Seen {student.lastActive}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Visual */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                                        <span>Course Progress</span>
                                        <span className="text-primary">{student.progress}%</span>
                                    </div>
                                    <div className="h-2.5 bg-muted rounded-full overflow-hidden p-0.5 border border-border/20">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                                            style={{ width: `${student.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Performance Badge */}
                                <div className="flex items-center gap-4 lg:min-w-[200px] justify-end">
                                    <div className="text-right mr-4">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest opacity-60">Success Score</p>
                                        <p className={`text-sm font-bold ${student.performance === 'Exemplary' ? 'text-[oklch(0.6_0.118_184.704)]' :
                                                student.performance === 'Average' ? 'text-accent' : 'text-destructive'
                                            }`}>
                                            {student.performance}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 text-primary">
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent text-accent">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
