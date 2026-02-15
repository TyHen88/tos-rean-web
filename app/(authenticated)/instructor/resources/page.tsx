"use client"

import { useState } from "react"
import {
    FileText,
    Search,
    Upload,
    FolderPlus,
    MoreVertical,
    Filter,
    Cloud,
    HardDrive,
    Download,
    Trash2,
    Share2,
    ExternalLink,
    ChevronRight,
    Database,
    ArrowUpRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ResourceVault() {
    const [view, setView] = useState<'grid' | 'list'>('grid')

    const resources = [
        { title: "UI Design Assets - Figma.zip", size: "124 MB", type: "ZIP", updated: "2h ago", downloads: 450, color: "bg-primary" },
        { title: "React Performance PDF.pdf", size: "4.2 MB", type: "PDF", updated: "1d ago", downloads: 1200, color: "bg-accent" },
        { title: "Course Curriculum v2.xlsx", size: "850 KB", type: "XLSX", updated: "3d ago", downloads: 45, color: "bg-[oklch(0.6_0.118_184.704)]" },
        { title: "Dataset_Learners.json", size: "12.5 MB", type: "JSON", updated: "1w ago", downloads: 820, color: "bg-primary" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Resource Vault</h1>
                    <p className="text-muted-foreground mt-1">Centralized repository for all your instructional assets and course materials.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-5 gap-2 border-border/50">
                        <FolderPlus className="w-4 h-4" /> New Folder
                    </Button>
                    <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                        <Upload className="w-4 h-4" /> Upload Asset
                    </Button>
                </div>
            </div>

            {/* Storage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 glass-card p-8 rounded-[2rem] border border-border/50 bg-card/50 flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted opacity-20" />
                            <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="364.4" strokeDashoffset="91.1" className="text-primary" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-xl font-bold">75%</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-60 text-center">of 50GB</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Database className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold">Storage Health</h3>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Your vault is nearing capacity. Assets are synced across 4 edge nodes for ultra-fast student delivery.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-xs font-bold text-muted-foreground">Used: 37.5GB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-muted" />
                                <span className="text-xs font-bold text-muted-foreground">Free: 12.5GB</span>
                            </div>
                        </div>
                    </div>
                    <Button className="rounded-xl border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 px-8">Upgrade</Button>
                </div>

                <div className="glass-card p-6 rounded-[2rem] border border-border/50 bg-card/50 flex flex-col justify-center items-center text-center">
                    <HardDrive className="w-10 h-10 text-accent mb-4" />
                    <h4 className="font-bold text-lg leading-tight mb-2">Edge Delivery</h4>
                    <p className="text-xs text-muted-foreground">99.9% Cache Hit Rate</p>
                    <div className="mt-6 flex items-center gap-1 text-[oklch(0.6_0.118_184.704)] font-bold text-sm">
                        <ArrowUpRight className="w-4 h-4" /> Optimized
                    </div>
                </div>
            </div>

            {/* Browser Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by filename or tag..."
                        className="pl-11 h-12 bg-card/40 backdrop-blur-md rounded-xl border-border/40"
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 w-12 rounded-xl border-border/40 p-0 flex items-center justify-center">
                        <Filter className="w-4 h-4" />
                    </Button>
                    <div className="flex bg-muted/30 p-1 rounded-xl border border-border/20">
                        <Button
                            variant={view === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg px-4"
                            onClick={() => setView('grid')}
                        >
                            Grid
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg px-4"
                            onClick={() => setView('list')}
                        >
                            List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Asset Explorer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resources.map((asset, idx) => (
                    <div key={idx} className="glass-card rounded-3xl border border-border/50 bg-card/50 p-6 hover:shadow-2xl hover:shadow-primary/5 group transition-all duration-500 cursor-pointer">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${asset.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>

                        <h4 className="font-bold text-base leading-tight truncate mb-1 group-hover:text-primary transition-colors">
                            {asset.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium mb-6 uppercase tracking-widest">{asset.size} • {asset.type}</p>

                        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border/20">
                            <div className="text-center">
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">DL Count</p>
                                <p className="font-bold text-xs">{asset.downloads}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Updated</p>
                                <p className="font-bold text-xs">{asset.updated}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                            <Button size="sm" className="flex-1 rounded-xl bg-primary text-[10px] font-bold h-9">
                                <Download className="w-3.5 h-3.5 mr-2" /> Download
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 w-9 rounded-xl border-border/40">
                                <Share2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Upload Trigger Placeholder */}
                <button className="rounded-3xl border-2 border-dashed border-border/50 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-500 flex flex-col items-center justify-center p-8 group min-h-[260px]">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-bold text-sm">Drop Assets Here</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">Max 2GB per file</p>
                </button>
            </div>
        </div>
    )
}
