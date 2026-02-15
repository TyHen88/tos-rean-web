"use client"

import { useState } from "react"
import {
    Library,
    Search,
    Upload,
    BookOpen,
    Globe,
    FileText,
    ShieldCheck,
    Settings,
    MoreVertical,
    Download,
    Trash2,
    Lock,
    Eye,
    ChevronRight,
    Database,
    Cloud
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function GlobalResources() {
    const [activeTab, setActiveTab] = useState('all')

    const items = [
        { title: "Brand Identity Guide 2026", type: "PDF", size: "12.4 MB", access: "PUBLIC", owner: "System" },
        { title: "Instructor Terms of Service", type: "DOCX", size: "450 KB", access: "PRIVATE", owner: "Legal" },
        { title: "Platform SVG Assets Bundle", type: "ZIP", size: "245 MB", access: "RESTRICTED", owner: "Design" },
        { title: "Database Migration Script", type: "JS", size: "12 KB", access: "ADMIN_ONLY", owner: "Engineering" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Global Assets</h1>
                    <p className="text-muted-foreground mt-1">Manage system-level resources, branding materials, and platform-wide documentation.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-5 gap-2 border-border/50">
                        <Cloud className="w-4 h-4" /> Sync Edge
                    </Button>
                    <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                        <Upload className="w-4 h-4" /> Push Asset
                    </Button>
                </div>
            </div>

            {/* Platform Storage Stats */}
            <div className="glass-card p-10 rounded-[2.5rem] border border-border/40 bg-card/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                    <Database className="w-48 h-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary opacity-80">Global Namespace</p>
                        <h3 className="text-5xl font-bold tracking-tighter italic">2.4<span className="text-2xl not-italic ml-1 opacity-60">TB</span></h3>
                        <p className="text-sm text-muted-foreground font-medium">Distributed across 14 global data clusters.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between font-bold text-[10px] uppercase tracking-widest text-muted-foreground opacity-60">
                            <span>Traffic Volume</span>
                            <span>84 MB/s</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_12px_rgba(var(--primary),0.5)]" />
                        </div>
                        <p className="text-xs font-bold italic pt-1">99.9% Latency optimization target met.</p>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="p-4 rounded-2xl bg-[oklch(0.6_0.118_184.704)]/10 border border-[oklch(0.6_0.118_184.704)]/20 text-center px-10">
                            <ShieldCheck className="w-8 h-8 text-[oklch(0.6_0.118_184.704)] mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.6_0.118_184.704)]">Integrity Verified</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation & Filter */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex bg-muted/30 p-1 rounded-2xl border border-border/20 w-full lg:w-auto">
                    {['all', 'branding', 'legal', 'system'].map((tab) => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? 'secondary' : 'ghost'}
                            className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest flex-1 lg:flex-none ${activeTab === tab ? 'shadow-sm' : 'opacity-60'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search global directory..."
                        className="pl-11 h-12 bg-card/40 backdrop-blur-md rounded-xl border-border/40"
                    />
                </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, idx) => (
                    <div key={idx} className="glass-card rounded-[2rem] border border-border/40 bg-card/40 p-1 hover:border-primary/40 transition-all duration-500 overflow-hidden group">
                        <div className="p-6 flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shrink-0">
                                <FileText className="w-10 h-10 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-lg leading-tight truncate">{item.title}</h4>
                                    {item.access === 'ADMIN_ONLY' && <Lock className="w-3.5 h-3.5 text-destructive" />}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="rounded-lg text-[9px] font-bold uppercase tracking-widest border-border/40">{item.type}</Badge>
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{item.size}</span>
                                    <span className="h-3 w-px bg-border/40" />
                                    <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">{item.owner}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent/10 text-accent transition-colors">
                                    <Download className="w-5 h-5" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl backdrop-blur-xl bg-card/95 border-border/50">
                                        <DropdownMenuItem className="rounded-lg gap-2 py-2.5 font-semibold">
                                            <Eye className="w-4 h-4" /> Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg gap-2 py-2.5 font-semibold">
                                            <Settings className="w-4 h-4" /> Permissions
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="rounded-lg gap-2 py-2.5 text-destructive focus:bg-destructive/10 font-bold">
                                            <Trash2 className="w-4 h-4" /> Purge Asset
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Expansion Drawer Hint */}
                        <div className="bg-muted/10 border-t border-border/20 p-4 px-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Pattern: 1.2k reads / week</p>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest cursor-pointer hover:underline underline-offset-4">
                                Audit History <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Creation Node */}
                <div className="rounded-[2rem] border-2 border-dashed border-border/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-500 flex items-center justify-center p-8 group cursor-pointer">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Push New Namespace</h4>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Initialize Global Resource</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
