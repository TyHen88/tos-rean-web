"use client"

import { useState } from "react"
import {
    History,
    Search,
    Filter,
    ShieldAlert,
    Terminal,
    User,
    Globe,
    Download,
    MoreVertical,
    ArrowUpRight,
    Database,
    ShieldCheck,
    AlertTriangle,
    Fingerprint,
    ChevronRight,
    RefreshCw
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AuditLogs() {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const logs = [
        {
            id: "LOG-1240",
            action: "COURSE_PUBLISHED",
            performer: "Dr. Jonathan Smith",
            target: "Quantum Computing v2",
            time: "2 mins ago",
            ip: "103.14.24.11",
            severity: "info",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
            id: "LOG-1239",
            action: "USER_ROLE_MODIFIED",
            performer: "Admin System",
            target: "Sarah Jenkins -> INSTRUCTOR",
            time: "15 mins ago",
            ip: "Internal",
            severity: "warning",
            avatar: null
        },
        {
            id: "LOG-1238",
            action: "SYSTEM_CONFIG_UDP",
            performer: "Top Admin",
            target: "Security Policy: MFA Policy",
            time: "1 hour ago",
            ip: "154.21.114.2",
            severity: "critical",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground mt-1">Immutable system-wide ledger tracking every administrative action and security event.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-5 gap-2 border-border/50">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                    <Button
                        className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20"
                        onClick={() => {
                            setIsRefreshing(true)
                            setTimeout(() => setIsRefreshing(false), 1000)
                        }}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh Feed
                    </Button>
                </div>
            </div>

            {/* Security Metrics Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-3xl border border-border/50 bg-card/10 flex items-center justify-between overflow-hidden relative group">
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-5 group-hover:scale-125 transition-transform duration-700" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Integrity Hash</p>
                        <div className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-primary" />
                            <code className="text-sm font-bold opacity-80">SHA-256: 8a4f...21e</code>
                        </div>
                    </div>
                    <Badge className="bg-[oklch(0.6_0.118_184.704)]/20 text-[oklch(0.6_0.118_184.704)] border-transparent font-bold tracking-widest text-[10px]">VERIFIED</Badge>
                </div>
                <div className="glass-card p-8 rounded-3xl border border-border/50 bg-card/10 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">High Severity Events</p>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                        <h3 className="text-3xl font-bold">0</h3>
                        <span className="text-xs font-bold text-muted-foreground opacity-60 ml-2">(Last 24h)</span>
                    </div>
                </div>
                <div className="glass-card p-8 rounded-3xl border border-border/50 bg-card/10 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">Identity Verification</p>
                    <div className="flex items-center gap-3">
                        <Fingerprint className="w-6 h-6 text-accent" />
                        <h3 className="text-3xl font-bold italic">100%</h3>
                        <Badge className="bg-accent/10 text-accent border-transparent text-[8px] font-bold">ENFORCED</Badge>
                    </div>
                </div>
            </div>

            {/* Log Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search logs by action, performer or fingerprint..."
                        className="pl-11 h-12 bg-card/40 backdrop-blur-md rounded-xl border-border/40 focus:ring-primary/20"
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-xl gap-2 border-border/40 px-6 font-bold text-xs uppercase tracking-widest hover:bg-primary/5">
                        <Filter className="w-4 h-4" /> Level
                    </Button>
                    <Button variant="outline" className="h-12 rounded-xl border-border/40 px-6 font-bold text-xs uppercase tracking-widest">
                        Date Range
                    </Button>
                </div>
            </div>

            {/* Terminal Feed Layout */}
            <div className="glass-card rounded-3xl border border-border/50 bg-black/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/10 bg-muted/30">
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Trace ID</th>
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Action Event</th>
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Performer</th>
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Context / Target</th>
                                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Moment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-primary/5 transition-all duration-300 group">
                                    <td className="p-6">
                                        <code className="text-xs font-bold text-primary opacity-60 group-hover:opacity-100 transition-opacity">{log.id}</code>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${log.severity === 'critical' ? 'bg-destructive shadow-[0_0_8px_rgba(var(--destructive))]' :
                                                    log.severity === 'warning' ? 'bg-accent' : 'bg-[oklch(0.6_0.118_184.704)]'
                                                }`} />
                                            <span className="font-bold text-xs tracking-tight uppercase">{log.action.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8 border border-border/30">
                                                <AvatarImage src={log.avatar || ''} />
                                                <AvatarFallback className="bg-muted text-[10px] font-bold uppercase">{log.performer[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold leading-none mb-0.5">{log.performer}</span>
                                                <span className="text-[9px] font-bold text-muted-foreground opacity-60 uppercase tracking-widest">{log.ip}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 min-w-[200px]">
                                        <p className="text-xs font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                            {log.target}
                                        </p>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold">{log.time}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Terminal Sync Footer */}
                <div className="p-6 border-t border-border/10 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-muted-foreground animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                            Synced with Blockchain Audit Service
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest h-8 px-4 border border-border/30 rounded-xl hover:bg-primary/10 transition-all">
                            Deep Inspection
                        </Button>
                        <Button className="text-[10px] font-bold uppercase tracking-widest h-8 px-5 rounded-xl shadow-lg shadow-black/20">
                            Next Epoch
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
