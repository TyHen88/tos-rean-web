"use client"

import { useState } from "react"
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  ShieldCheck,
  History,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default function CourseModeration() {
  const [queue, setQueue] = useState([
    {
      id: 1,
      title: "Advanced Quantum Computing for UX",
      instructor: "Dr. Jonathan Smith",
      submissionDate: "2h ago",
      complexity: "Advanced",
      status: "AWAITING_REVIEW",
      lessons: 24,
      instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Introduction to Organic Architecture",
      instructor: "Sarah Jenkins",
      submissionDate: "5h ago",
      complexity: "Beginner",
      status: "UNDER_MODERATION",
      lessons: 12,
      instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Mastering Next.js 15: Edge Edition",
      instructor: "Michael Chen",
      submissionDate: "1d ago",
      complexity: "Advanced",
      status: "AWAITING_REVIEW",
      lessons: 48,
      instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop"
    },
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Course Moderation</h1>
          <p className="text-muted-foreground mt-1">Review, approve, or flag curriculum submissions to maintain platform quality.</p>
        </div>
        <div className="flex items-center gap-4 py-2 px-6 rounded-2xl bg-accent/10 border border-accent/20">
          <ShieldCheck className="w-5 h-5 text-accent animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent opacity-70 leading-none">Security Status</span>
            <span className="font-bold text-lg leading-tight text-foreground">Scan Shield Active</span>
          </div>
        </div>
      </div>

      {/* Moderation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-border/50 bg-card/50 flex flex-col justify-between group cursor-pointer hover:border-primary/50 transition-colors">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-2">Review Queue</p>
            <h3 className="text-3xl font-bold italic group-hover:text-primary transition-colors">12</h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[oklch(0.6_0.118_184.704)] mt-4">
            <TrendingUp className="w-3.5 h-3.5" /> High Urgency Items
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-border/50 bg-card/50 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-2">Avg. Review Time</p>
            <h3 className="text-3xl font-bold italic">4.2<span className="text-sm font-medium not-italic ml-1 opacity-60">h</span></h3>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">Targets met</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-border/50 bg-card/50 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-2">Quality Index</p>
            <h3 className="text-3xl font-bold italic text-[oklch(0.6_0.118_184.704)]">98.4%</h3>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">Pass rate</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-border/50 bg-card/50 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-2">Flagged Today</p>
            <h3 className="text-3xl font-bold italic text-destructive">2</h3>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">Resolved: 100%</p>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by course title or instructor..."
            className="pl-11 h-12 bg-card/40 backdrop-blur-md rounded-xl border-border/40"
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl border-border/40 px-6 gap-2 font-bold text-xs uppercase tracking-widest hover:bg-primary/5">
          <Filter className="w-4 h-4" /> Priority Selection
        </Button>
      </div>

      {/* Course Moderation Feed */}
      <div className="space-y-4">
        {queue.map((course) => (
          <div key={course.id} className="glass-card rounded-3xl border border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-500 overflow-hidden group">
            <div className="flex flex-col lg:flex-row lg:items-center p-8 gap-8">
              {/* Submission Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>

              {/* Course & Instructor Info */}
              <div className="flex-1 min-w-[300px]">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-xl group-hover:text-primary transition-colors">{course.title}</h4>
                  {course.lessons > 25 && (
                    <Badge className="bg-accent/10 text-accent border-accent/20 rounded-lg text-[9px] font-bold uppercase tracking-widest">Compendium</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-6 h-6 border border-border/30">
                    <AvatarImage src={course.instructorAvatar} />
                    <AvatarFallback className="text-[9px] font-bold">{course.instructor[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-bold opacity-70 underline decoration-primary/20 hover:decoration-primary transition-all cursor-pointer">
                    {course.instructor}
                  </p>
                  <span className="h-4 w-px bg-border/40 mx-1" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {course.submissionDate}
                  </p>
                </div>
              </div>

              {/* Quality Metrics */}
              <div className="flex items-center gap-10 lg:min-w-[280px]">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-50">Lessons</p>
                  <p className="font-bold text-lg leading-none">{course.lessons}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-50">Level</p>
                  <Badge variant="outline" className="rounded-lg text-[9px] font-bold px-2 py-0 border-border/30">
                    {course.complexity}
                  </Badge>
                </div>
                <div className="text-right flex-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-50">Status</p>
                  <Badge className={`rounded-lg font-bold text-[9px] tracking-widest py-1 px-3 ${course.status === 'UNDER_MODERATION' ? 'bg-accent/10 text-accent border-accent/20' :
                    'bg-primary/20 text-primary border-primary/30'
                    }`}>
                    {course.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex items-center gap-3 justify-end border-t lg:border-t-0 lg:pl-8 border-border/20 pt-6 lg:pt-0">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-destructive/10 text-destructive opacity-40 hover:opacity-100 transition-all">
                  <XCircle className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent/10 text-accent">
                  <Eye className="w-5 h-5" />
                </Button>
                <Button className="rounded-xl px-8 font-bold bg-primary shadow-lg shadow-primary/20 group-hover:scale-[1.03] transition-transform">
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Hint */}
      <div className="p-6 rounded-3xl bg-muted/20 border border-border/30 flex items-center justify-between group cursor-pointer hover:bg-muted/40 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/30">
            <History className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-bold text-sm">View Full Moderation Audit</h4>
            <p className="text-xs text-muted-foreground font-medium">1,240 decisions made this month.</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  )
}
