"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { GymSchedule } from "@/lib/types"

export default function SchedulePage() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<GymSchedule[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<GymSchedule[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<GymSchedule | null>(null)
  const [viewMode, setViewMode] = useState<"all" | "upcoming" | "completed">("all")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [exercises, setExercises] = useState("")

  useEffect(() => {
    loadSchedules()
  }, [user])

  useEffect(() => {
    filterSchedules()
  }, [schedules, viewMode])

  const loadSchedules = () => {
    const data = localStorage.getItem("gymmine_schedules")
    if (data) {
      const allSchedules: GymSchedule[] = JSON.parse(data)
      const userSchedules = allSchedules.filter((s) => s.userId === user?.id)
      setSchedules(userSchedules.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    }
  }

  const filterSchedules = () => {
    const today = new Date().toISOString().split("T")[0]
    let filtered = schedules

    if (viewMode === "upcoming") {
      filtered = schedules.filter((s) => s.date >= today && !s.completed)
    } else if (viewMode === "completed") {
      filtered = schedules.filter((s) => s.completed)
    }

    setFilteredSchedules(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const scheduleData: GymSchedule = {
      id: editingSchedule?.id || crypto.randomUUID(),
      userId: user!.id,
      title,
      description,
      date,
      startTime,
      endTime,
      exercises: exercises
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      completed: editingSchedule?.completed || false,
      createdAt: editingSchedule?.createdAt || new Date().toISOString(),
    }

    const data = localStorage.getItem("gymmine_schedules")
    const allSchedules: GymSchedule[] = data ? JSON.parse(data) : []

    if (editingSchedule) {
      const updatedSchedules = allSchedules.map((s) => (s.id === editingSchedule.id ? scheduleData : s))
      localStorage.setItem("gymmine_schedules", JSON.stringify(updatedSchedules))
    } else {
      allSchedules.push(scheduleData)
      localStorage.setItem("gymmine_schedules", JSON.stringify(allSchedules))
    }

    resetForm()
    loadSchedules()
    setIsDialogOpen(false)
  }

  const handleEdit = (schedule: GymSchedule) => {
    setEditingSchedule(schedule)
    setTitle(schedule.title)
    setDescription(schedule.description)
    setDate(schedule.date)
    setStartTime(schedule.startTime)
    setEndTime(schedule.endTime)
    setExercises(schedule.exercises.join(", "))
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      const data = localStorage.getItem("gymmine_schedules")
      if (data) {
        const allSchedules: GymSchedule[] = JSON.parse(data)
        const updatedSchedules = allSchedules.filter((s) => s.id !== id)
        localStorage.setItem("gymmine_schedules", JSON.stringify(updatedSchedules))
        loadSchedules()
      }
    }
  }

  const handleToggleComplete = (schedule: GymSchedule) => {
    const data = localStorage.getItem("gymmine_schedules")
    if (data) {
      const allSchedules: GymSchedule[] = JSON.parse(data)
      const updatedSchedules = allSchedules.map((s) => (s.id === schedule.id ? { ...s, completed: !s.completed } : s))
      localStorage.setItem("gymmine_schedules", JSON.stringify(updatedSchedules))
      loadSchedules()
    }
  }

  const resetForm = () => {
    setEditingSchedule(null)
    setTitle("")
    setDescription("")
    setDate("")
    setStartTime("")
    setEndTime("")
    setExercises("")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gym Schedule</h1>
          <p className="text-muted-foreground text-lg">Plan and track your workout sessions</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
              <DialogDescription>
                {editingSchedule ? "Update your workout schedule" : "Create a new workout schedule"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Workout Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Upper Body Strength"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your workout session"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercises">Exercises (comma-separated)</Label>
                <Textarea
                  id="exercises"
                  placeholder="e.g., Bench Press, Squats, Deadlifts"
                  value={exercises}
                  onChange={(e) => setExercises(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingSchedule ? "Update Schedule" : "Create Schedule"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={viewMode === "all" ? "default" : "outline"} onClick={() => setViewMode("all")}>
          All
        </Button>
        <Button variant={viewMode === "upcoming" ? "default" : "outline"} onClick={() => setViewMode("upcoming")}>
          Upcoming
        </Button>
        <Button variant={viewMode === "completed" ? "default" : "outline"} onClick={() => setViewMode("completed")}>
          Completed
        </Button>
      </div>

      {/* Schedule List */}
      {filteredSchedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No schedules found</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first workout schedule</p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Schedule</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className={schedule.completed ? "opacity-75" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{schedule.title}</CardTitle>
                    <CardDescription>{schedule.description}</CardDescription>
                  </div>
                  {schedule.completed && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{new Date(schedule.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                </div>

                {schedule.exercises.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Exercises:</p>
                    <div className="flex flex-wrap gap-2">
                      {schedule.exercises.map((exercise, index) => (
                        <Badge key={index} variant="outline">
                          {exercise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant={schedule.completed ? "outline" : "default"}
                    onClick={() => handleToggleComplete(schedule)}
                    className="flex-1"
                  >
                    {schedule.completed ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(schedule)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(schedule.id)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
