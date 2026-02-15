"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    ChevronRight,
    DollarSign,
    Download,
    History,
    PieChart,
    TrendingUp,
    Wallet
} from "lucide-react"

export default function InstructorRevenue() {
    const earningsData = [
        { month: "Jan 2026", amount: "$8,450", status: "PAID", method: "Direct Deposit" },
        { month: "Dec 2025", amount: "$12,800", status: "PAID", method: "PayPal" },
        { month: "Nov 2025", amount: "$9,200", status: "PAID", method: "Direct Deposit" },
    ]

    const courseRevenue = [
        { title: "Advanced UI Masterclass", share: "45%", revenue: "$18,500", color: "bg-primary" },
        { title: "Next.js Mastery", share: "30%", revenue: "$12,300", color: "bg-accent" },
        { title: "React Fundamentals", share: "15%", revenue: "$6,150", color: "bg-[oklch(0.6_0.118_184.704)]" },
        { title: "Node.js Basics", share: "10%", revenue: "$4,100", color: "bg-muted" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Revenue Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Track your earnings, manage payouts, and analyze fiscal growth.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl px-5 gap-2 border-border/50">
                        <Download className="w-4 h-4" />
                        Tax Documents
                    </Button>
                    <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                        <Calendar className="w-4 h-4" />
                        Payout Schedule
                    </Button>
                </div>
            </div>

            {/* Primary Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <Wallet className="w-24 h-24" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Available for Payout</p>
                    <h3 className="text-5xl font-bold tracking-tight mb-6">$4,250.00</h3>
                    <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold h-12">
                        Request Immediate Payout
                    </Button>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border border-border/50 bg-card/50 flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Net Earnings (MTD)</p>
                        <div className="flex items-center gap-3">
                            <h3 className="text-4xl font-bold">$12,482</h3>
                            <div className="flex items-center gap-1 text-sm font-bold text-[oklch(0.6_0.118_184.704)] mt-1">
                                <ArrowUpRight className="w-4 h-4" /> 18%
                            </div>
                        </div>
                    </div>
                    <div className="pt-6">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[70%] rounded-full" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 opacity-60">70% of Monthly Goal reached</p>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border border-border/50 bg-card/50 flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Sales Count</p>
                        <div className="flex items-center gap-3">
                            <h3 className="text-4xl font-bold">1,248</h3>
                            <div className="flex items-center gap-1 text-sm font-bold text-destructive mt-1">
                                <ArrowDownRight className="w-4 h-4" /> 2%
                            </div>
                        </div>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground pt-6 italic leading-relaxed">
                        Market conversion rate is down slightly this month. Consider a seasonal promotion?
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Course Breakdown */}
                <div className="glass-card p-8 rounded-[2rem] border border-border/50 bg-card/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-primary" /> Revenue by Course
                        </h3>
                        <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest opacity-60">Full Digest</Button>
                    </div>

                    <div className="space-y-6">
                        {courseRevenue.map((course, idx) => (
                            <div key={idx} className="space-y-2 group cursor-pointer">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="group-hover:text-primary transition-colors">{course.title}</span>
                                    <span className="text-muted-foreground opacity-60">{course.revenue}</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                                    <div className={`h-full ${course.color} transition-all duration-1000`} style={{ width: course.share }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 rounded-2xl bg-muted/20 border border-border/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Top Growth: Next.js Mastery</p>
                                <p className="text-xs text-muted-foreground">Up 42% in organic sales this week.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout History */}
                <div className="glass-card p-8 rounded-[2rem] border border-border/50 bg-card/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" /> Payout History
                        </h3>
                        <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest opacity-60">Statements</Button>
                    </div>

                    <div className="space-y-4">
                        {earningsData.map((payout, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-transparent hover:border-border/50 hover:bg-muted/40 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border/30 group-hover:scale-110 transition-transform">
                                        <DollarSign className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{payout.month}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{payout.method}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg leading-tight mb-1">{payout.amount}</p>
                                    <Badge variant="outline" className="rounded-lg bg-[oklch(0.6_0.118_184.704)]/10 text-[oklch(0.6_0.118_184.704)] border-transparent font-bold text-[9px] py-0.5">
                                        {payout.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full mt-8 rounded-xl border-dashed border-2 py-6 gap-2 group hover:border-primary">
                        <span className="font-bold">View Comprehensive Ledger</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
