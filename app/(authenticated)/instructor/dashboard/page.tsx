"use client"

import { useState } from "react"
import {
    Users,
    BookOpen,
    TrendingUp,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Plus
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function InstructorDashboard() {
    const stats = [
        { label: "Total Students", value: "2,845", change: "+12.5%", trending: "up", icon: Users, color: "primary" },
        { label: "Active Courses", value: "12", icon: BookOpen, color: "accent" },
        { label: "Total Revenue", value: "$42,650", change: "+18.2%", trending: "up", icon: Wallet, color: "primary" },
        { label: "Avg. Rating", value: "4.8", change: "+0.2", trending: "up", icon: TrendingUp, color: "accent" },
    ]

    const recentActivities = [
        { id: 1, type: "enrollment", user: "Alex Thompson", course: "Advanced UI Design", time: "2 mins ago" },
        { id: 2, type: "rating", user: "Sarah Jenkins", value: 5, course: "Next.js Mastery", time: "15 mins ago" },
        { id: 3, type: "assignment", user: "Michael Chen", status: "submitted", course: "React Design Patterns", time: "1 hour ago" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Instructor Hub
                    </h1>
                    <p className="text-muted-foreground mt-1">Track your performance and manage your students.</p>
                </div>
                <Button className="rounded-xl px-6 gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Course
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl border border-border/50 bg-card/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}/10 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                            </div>
                            {stat.change && (
                                <div className={`flex items-center gap-1 text-sm font-bold ${stat.trending === 'up' ? 'text-[oklch(0.6_0.118_184.704)]' : 'text-destructive'}`}>
                                    {stat.trending === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {stat.change}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-70 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder for now) */}
                <div className="lg:col-span-2 glass-card rounded-3xl border border-border/50 bg-card/50 overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-6 border-b border-border/30 flex items-center justify-between">
                        <h3 className="text-xl font-bold">Revenue Growth</h3>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="rounded-lg cursor-pointer hover:bg-primary/10">7D</Badge>
                            <Badge variant="secondary" className="rounded-lg cursor-pointer">30D</Badge>
                            <Badge variant="outline" className="rounded-lg cursor-pointer hover:bg-primary/10">1Y</Badge>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center bg-primary/5 p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                            <p className="text-muted-foreground font-medium italic">Performance chart will bloom here...</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity & Notifications */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl border border-border/50 bg-card/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Live Pulse</h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 group">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                            {activity.type === 'enrollment' && <Users className="w-5 h-5 text-accent" />}
                                            {activity.type === 'rating' && <TrendingUp className="w-5 h-5 text-primary" />}
                                            {activity.type === 'assignment' && <Clock className="w-5 h-5 text-muted-foreground" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">
                                            {activity.user}
                                            <span className="text-muted-foreground font-medium ml-1">
                                                {activity.type === 'enrollment' ? 'enrolled in' :
                                                    activity.type === 'rating' ? 'rated' : 'submitted work for'}
                                            </span>
                                        </p>
                                        <p className="text-xs font-semibold text-primary truncate mt-0.5">{activity.course}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-8 rounded-xl border-dashed border-2 hover:border-primary">
                            View All Activity
                        </Button>
                    </div>

                    {/* Quick Tasks */}
                    <div className="glass-card p-6 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                            <AlertCircle className="w-24 h-24" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Attention Required</h3>
                        <p className="text-sm opacity-90 mb-6 font-medium">You have 8 assignments waiting for evaluation.</p>
                        <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold">
                            Review Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
