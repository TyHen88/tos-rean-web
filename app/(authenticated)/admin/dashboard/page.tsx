"use client"

import {
    BarChart3,
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    Activity,
    ShieldCheck,
    Globe,
    ArrowUpRight,
    MoreHorizontal,
    MapPin,
    Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
    const stats = [
        { label: "Platform Revenue", value: "$158.4k", change: "+24%", trending: "up", icon: BarChart3, color: "primary" },
        { label: "Active Students", value: "12.5k", change: "+850", trending: "up", icon: Users, color: "accent" },
        { label: "Instructors", value: "128", change: "+12", trending: "up", icon: GraduationCap, color: "primary" },
        { label: "Published Courses", value: "482", change: "+18", trending: "up", icon: BookOpen, color: "accent" },
    ]

    const alerts = [
        { id: 1, type: "security", title: "Suspicious login attempt", detail: "5 failed attempts from Cambodia IP", time: "12 mins ago", priority: "high" },
        { id: 2, type: "moderation", title: "Course awaiting review", detail: "Advanced ML by Dr. Smith", time: "45 mins ago", priority: "medium" },
        { id: 3, type: "system", title: "Server usage spike", detail: "90% CPU usage on DB Cluster", time: "1 hour ago", priority: "low" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Platform Analysis</h1>
                    <p className="text-muted-foreground mt-1">Global monitoring and system administration control.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl gap-2 border-border/50">
                        <Globe className="w-4 h-4" /> Export Report
                    </Button>
                    <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                        <ShieldCheck className="w-4 h-4" /> System Health
                    </Button>
                </div>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}/10 group-hover:rotate-12 transition-transform`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-[oklch(0.6_0.118_184.704)]">
                                <ArrowUpRight className="w-3.5 h-3.5" /> {stat.change}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Network & Traffic Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-3xl border border-border/50 bg-card/50 p-8 min-h-[450px] relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold">Traffic & Performance</h3>
                                <p className="text-sm text-muted-foreground">Real-time monitoring across 12 regions.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-3 w-3 rounded-full bg-[oklch(0.6_0.118_184.704)] animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-70">Live Flux</span>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="relative w-full max-w-lg aspect-video bg-primary/5 rounded-2xl border border-dashed border-primary/20 flex items-center justify-center">
                                <Activity className="w-12 h-12 text-primary opacity-20 animate-bounce" />
                                <p className="absolute text-xs font-bold text-primary/40 uppercase tracking-[0.2em]">Quantum Analysis in Progress</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 mt-auto border-t border-border/30">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Response Time</p>
                                <p className="text-xl font-bold">124ms</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Uptime</p>
                                <p className="text-xl font-bold text-[oklch(0.6_0.118_184.704)]">99.98%</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Active Clusters</p>
                                <p className="text-xl font-bold">24 online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Activity & Alerts */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl border border-border/50 bg-card/50">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" /> Command Center Alerts
                        </h3>
                        <div className="space-y-4">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="p-4 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className={`rounded-lg text-[10px] font-bold ${alert.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                alert.priority === 'medium' ? 'bg-accent/10 text-accent border-accent/20' :
                                                    'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                            {alert.priority.toUpperCase()}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{alert.time}</span>
                                    </div>
                                    <h4 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{alert.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{alert.detail}</p>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 rounded-xl font-bold text-xs uppercase tracking-widest">
                            View All System Logs
                        </Button>
                    </div>

                    {/* Quick Stats Bento */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="glass-card p-6 rounded-3xl bg-accent text-accent-foreground relative overflow-hidden group">
                            <MapPin className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 group-hover:scale-120 transition-transform duration-700" />
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Global Reach</p>
                            <h4 className="text-2xl font-bold mb-4">42 Countries</h4>
                            <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/20 rounded-lg text-xs font-bold px-4">
                                View Heatmap
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
