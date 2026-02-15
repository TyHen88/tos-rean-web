"use client"

import { useState } from "react"
import {
    Settings,
    ShieldCheck,
    Wallet,
    Globe,
    Brush,
    Bell,
    Database,
    Key,
    Save,
    RefreshCw,
    Lock,
    Eye,
    Zap,
    HardDrive,
    Activity,
    ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/swtich"

export default function SystemSettings() {
    const [activeTab, setActiveTab] = useState('security')

    const navItems = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'payments', label: 'Financials', icon: Wallet },
        { id: 'appearance', label: 'Interface', icon: Brush },
        { id: 'advanced', label: 'Core Engine', icon: Activity },
    ]

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/20 pb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">System Config</h1>
                    <p className="text-muted-foreground mt-1">Global administrative parameters and platform logic overrides.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-5 gap-2 border-border/40 font-bold text-xs uppercase tracking-widest">
                        <RefreshCw className="w-4 h-4" /> Reset
                    </Button>
                    <Button className="rounded-xl px-8 gap-2 shadow-2xl shadow-primary/30 font-bold text-xs uppercase tracking-widest h-11">
                        <Save className="w-4 h-4" /> Commit Changes
                    </Button>
                </div>
            </div>

            {/* Horizontal Tabbar Navigation */}
            <div className="flex bg-muted/20 p-1.5 rounded-[1.25rem] border border-border/20 backdrop-blur-md overflow-x-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-500 group whitespace-nowrap ${isActive
                                ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30 scale-[1.02]'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 transition-transform duration-500 ${isActive ? '' : 'group-hover:rotate-12'}`} />
                            <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Action Panel */}
            <div className="space-y-8 pb-20">
                {activeTab === 'security' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Security Hero Card */}
                        <div className="glass-card p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background/5 to-transparent border border-primary/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                                <Lock className="w-56 h-56" />
                            </div>
                            <div className="relative z-10 max-w-2xl">
                                <Badge className="bg-primary/20 text-primary border-transparent font-bold tracking-[0.3em] text-[10px] mb-6 px-4 py-1.5 rounded-full">PLATFORM SECURITY</Badge>
                                <h2 className="text-4xl font-bold mb-6 tracking-tight">Enterprise Grade Shielding</h2>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                                    Configure low-level security parameters, authentication flows, and automated threat mitigation strategies.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card p-10 rounded-[2.5rem] border border-border/40 bg-card/40 space-y-8 hover:border-primary/20 transition-colors">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                                        <Key className="w-6 h-6 text-accent" />
                                    </div>
                                    <h3 className="font-bold text-xl tracking-tight">Authentication</h3>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="font-bold text-base">Force MFA for Admins</Label>
                                            <p className="text-sm text-muted-foreground">Require hardware key or TOTP for elevated roles.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="font-bold text-base">Session Timeout</Label>
                                            <p className="text-sm text-muted-foreground">Inactivity duration before auto-logout (mins).</p>
                                        </div>
                                        <Input defaultValue="30" className="w-24 h-12 bg-muted/30 border-border/20 font-bold text-center text-lg rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-10 rounded-[2.5rem] border border-border/40 bg-card/40 space-y-8 hover:border-destructive/20 transition-colors">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-destructive" />
                                    </div>
                                    <h3 className="font-bold text-xl tracking-tight">Automated Mitigation</h3>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="font-bold text-base">Rate Limiting</Label>
                                            <p className="text-sm text-muted-foreground">Auto-block IPs with 100+ req/min.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="font-bold text-base">Maintenance Mode</Label>
                                            <p className="text-sm text-muted-foreground">Lock all non-admin access immediately.</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* API Protection Settings */}
                        <div className="glass-card p-12 rounded-[3rem] border border-border/30 bg-card/30 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Database className="w-8 h-8 text-primary" />
                                    <h3 className="text-2xl font-bold tracking-tight">Encrypted Secrets (Vault)</h3>
                                </div>
                                <Badge variant="outline" className="rounded-xl border-primary/40 text-primary font-bold px-4 py-1.5 uppercase tracking-widest text-[10px]">HSM ACTIVE</Badge>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Firebase Server Key</Label>
                                    <div className="relative group/field">
                                        <Input type="password" value="********************************" readOnly className="h-14 bg-muted/20 border-border/20 pr-14 font-mono text-base rounded-2xl group-hover/field:border-primary/30 transition-colors" />
                                        <Button variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl hover:bg-primary/10">
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">PayWay Secret Token</Label>
                                    <div className="relative group/field">
                                        <Input type="password" value="********************************" readOnly className="h-14 bg-muted/20 border-border/20 pr-14 font-mono text-base rounded-2xl group-hover/field:border-primary/30 transition-colors" />
                                        <Button variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl hover:bg-primary/10">
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-border/20">
                                <Button variant="outline" className="rounded-2xl h-14 px-8 gap-3 border-border/40 font-bold text-xs uppercase tracking-widest hover:border-primary/50 hover:bg-primary/5 transition-all">
                                    <Key className="w-5 h-5" /> Rotate Global Access Keys
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab !== 'security' && (
                    <div className="h-[500px] glass-card rounded-[3rem] border border-dashed border-border/50 flex flex-col items-center justify-center text-center p-16 space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center relative">
                            <RefreshCw className="w-12 h-12 text-primary animate-spin-slow" />
                            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight">Syncing {activeTab[0].toUpperCase() + activeTab.slice(1)} Module...</h3>
                        <p className="text-lg text-muted-foreground max-w-md font-medium leading-relaxed italic">
                            Platform engines are currently reconciling the global configuration state for this module. Stand by for neural sync.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
