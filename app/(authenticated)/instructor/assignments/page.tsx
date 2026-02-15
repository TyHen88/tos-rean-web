"use client"

import { useState } from "react"
import {
    FileText,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    MessageSquare,
    ChevronRight,
    Filter,
    Calendar,
    Zap,
    Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EvaluateWork() {
    const submissions = [
        {
            id: 1,
            student: "Michael Chen",
            assignment: "Module 4: Responsive Ecosystems",
            course: "Advanced UI Masterclass",
            status: "PENDING",
            submittedAt: "2 hours ago",
            complexity: "Medium",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 2,
            student: "Sarah Jenkins",
            assignment: "Module 2: Hook Architecture",
            course: "Next.js Mastery",
            status: "REVIEWING",
            submittedAt: "5 hours ago",
            complexity: "High",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: 3,
            student: "David Miller",
            assignment: "Initial Portfolio Draft",
            course: "UI Design Fundamentals",
            status: "GRADED",
            submittedAt: "1 day ago",
            complexity: "Low",
            score: "98/100",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Evaluate Work</h1>
                    <p className="text-muted-foreground mt-1">Review student submissions, provide critical feedback and award certifications.</p>
                </div>
                <div className="flex items-center gap-4 py-2 px-6 rounded-2xl bg-primary/10 border border-primary/20">
                    <Zap className="w-5 h-5 text-primary animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-70 leading-none">Review Queue</span>
                        <span className="font-bold text-lg leading-tight">12 Pending</span>
                    </div>
                </div>
            </div>

            {/* Queue Filter Surface */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by student name or assignment..."
                        className="pl-11 h-12 bg-card/40 backdrop-blur-md rounded-xl border-border/40"
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-xl gap-2 border-border/40 px-6">
                        <Filter className="w-4 h-4" /> Filter by Complexity
                    </Button>
                    <Button variant="outline" className="h-12 rounded-xl border-border/40 px-6">
                        Module
                    </Button>
                </div>
            </div>

            {/* Evaluation Queue */}
            <div className="space-y-4">
                {submissions.map((sub) => (
                    <div key={sub.id} className="glass-card rounded-3xl border border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-300 group overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center">
                            {/* Status Ribbon */}
                            <div className={`lg:w-2 min-h-[1rem] ${sub.status === 'PENDING' ? 'bg-accent' :
                                sub.status === 'REVIEWING' ? 'bg-primary' :
                                    'bg-[oklch(0.6_0.118_184.704)]'
                                }`} />

                            <div className="flex flex-1 flex-col lg:flex-row lg:items-center p-6 gap-6">
                                {/* Student Info */}
                                <div className="flex items-center gap-4 lg:min-w-[280px]">
                                    <Avatar className="w-12 h-12 border-2 border-background shadow-lg">
                                        <AvatarImage src={sub.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{sub.student[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold group-hover:text-primary transition-colors">{sub.student}</h4>
                                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                                            <Calendar className="w-3 h-3" /> Submitted {sub.submittedAt}
                                        </p>
                                    </div>
                                </div>

                                {/* Assignment Detail */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-bold text-sm tracking-tight">{sub.assignment}</span>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{sub.course}</p>
                                </div>

                                {/* Metrics */}
                                <div className="flex items-center gap-8 lg:min-w-[240px]">
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60 text-center">Complexity</p>
                                        <Badge variant="outline" className="rounded-lg text-[9px] font-bold px-2 py-0">
                                            {sub.complexity}
                                        </Badge>
                                    </div>
                                    <div className="text-right flex-1">
                                        {sub.status === 'GRADED' ? (
                                            <div className="flex flex-col items-end">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Success Score</p>
                                                <div className="flex items-center gap-1 font-bold text-lg text-[oklch(0.6_0.118_184.704)]">
                                                    <Star className="w-4 h-4 fill-current" /> {sub.score}
                                                </div>
                                            </div>
                                        ) : (
                                            <Badge className={`rounded-lg font-bold text-[10px] tracking-widest py-1.5 px-4 ${sub.status === 'PENDING' ? 'bg-accent/10 text-accent border-accent/20' :
                                                'bg-primary/10 text-primary border-primary/20'
                                                }`}>
                                                {sub.status}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Action Trigger */}
                                <div className="flex items-center gap-3 justify-end border-t lg:border-t-0 lg:pl-6 border-border/20 pt-4 lg:pt-0">
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                    <Button className={`rounded-xl px-6 font-bold shadow-lg ${sub.status === 'GRADED' ? 'bg-muted text-muted-foreground hover:bg-muted' : 'bg-primary shadow-primary/20'
                                        }`}>
                                        {sub.status === 'GRADED' ? 'View Grade' : 'Evaluate'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Smart Tip */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border/40 flex items-start gap-4 shadow-inner">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
                    <Star className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <div>
                    <h4 className="font-bold text-sm mb-1">AI Insight: Quality Trend</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        "Student comprehension in <strong>Responsive Ecosystems</strong> has increased by 14% this week. Consider recommending the 'Advanced Auto Layout' deep dive to these learners."
                    </p>
                </div>
            </div>
        </div>
    )
}
