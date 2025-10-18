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
import type { ProgressEntry } from "@/lib/types"

export default function ProgressPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(null)

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [weight, setWeight] = useState("")
  const [bodyFat, setBodyFat] = useState("")
  const [chest, setChest] = useState("")
  const [waist, setWaist] = useState("")
  const [hips, setHips] = useState("")
  const [arms, setArms] = useState("")
  const [legs, setLegs] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    loadEntries()
  }, [user])

  const loadEntries = () => {
    const data = localStorage.getItem("gymmine_progress")
    if (data) {
      const allEntries: ProgressEntry[] = JSON.parse(data)
      const userEntries = allEntries.filter((e) => e.userId === user?.id)
      setEntries(userEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const entryData: ProgressEntry = {
      id: editingEntry?.id || crypto.randomUUID(),
      userId: user!.id,
      date,
      weight: weight ? Number(weight) : undefined,
      bodyFat: bodyFat ? Number(bodyFat) : undefined,
      measurements: {
        chest: chest ? Number(chest) : undefined,
        waist: waist ? Number(waist) : undefined,
        hips: hips ? Number(hips) : undefined,
        arms: arms ? Number(arms) : undefined,
        legs: legs ? Number(legs) : undefined,
      },
      notes,
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
    }

    const data = localStorage.getItem("gymmine_progress")
    const allEntries: ProgressEntry[] = data ? JSON.parse(data) : []

    if (editingEntry) {
      const updatedEntries = allEntries.map((e) => (e.id === editingEntry.id ? entryData : e))
      localStorage.setItem("gymmine_progress", JSON.stringify(updatedEntries))
    } else {
      allEntries.push(entryData)
      localStorage.setItem("gymmine_progress", JSON.stringify(allEntries))
    }

    resetForm()
    loadEntries()
    setIsDialogOpen(false)
  }

  const handleEdit = (entry: ProgressEntry) => {
    setEditingEntry(entry)
    setDate(entry.date)
    setWeight(entry.weight?.toString() || "")
    setBodyFat(entry.bodyFat?.toString() || "")
    setChest(entry.measurements?.chest?.toString() || "")
    setWaist(entry.measurements?.waist?.toString() || "")
    setHips(entry.measurements?.hips?.toString() || "")
    setArms(entry.measurements?.arms?.toString() || "")
    setLegs(entry.measurements?.legs?.toString() || "")
    setNotes(entry.notes)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const data = localStorage.getItem("gymmine_progress")
      if (data) {
        const allEntries: ProgressEntry[] = JSON.parse(data)
        const updatedEntries = allEntries.filter((e) => e.id !== id)
        localStorage.setItem("gymmine_progress", JSON.stringify(updatedEntries))
        loadEntries()
      }
    }
  }

  const resetForm = () => {
    setEditingEntry(null)
    setDate(new Date().toISOString().split("T")[0])
    setWeight("")
    setBodyFat("")
    setChest("")
    setWaist("")
    setHips("")
    setArms("")
    setLegs("")
    setNotes("")
  }

  const getLatestStats = () => {
    if (entries.length === 0) return null
    return entries[0]
  }

  const getWeightChange = () => {
    if (entries.length < 2) return null
    const latest = entries[0].weight
    const previous = entries[1].weight
    if (!latest || !previous) return null
    const change = latest - previous
    return { change, percentage: ((change / previous) * 100).toFixed(1) }
  }

  const latestStats = getLatestStats()
  const weightChange = getWeightChange()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Progress Tracking</h1>
          <p className="text-muted-foreground text-lg">Monitor your fitness journey and body measurements</p>
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
              Log Progress
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Progress Entry" : "Log Progress"}</DialogTitle>
              <DialogDescription>
                {editingEntry ? "Update your progress entry" : "Record your current measurements and stats"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat (%)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="15.5"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Body Measurements (cm)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chest" className="text-sm text-muted-foreground">
                      Chest
                    </Label>
                    <Input
                      id="chest"
                      type="number"
                      step="0.1"
                      placeholder="95"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist" className="text-sm text-muted-foreground">
                      Waist
                    </Label>
                    <Input
                      id="waist"
                      type="number"
                      step="0.1"
                      placeholder="80"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hips" className="text-sm text-muted-foreground">
                      Hips
                    </Label>
                    <Input
                      id="hips"
                      type="number"
                      step="0.1"
                      placeholder="95"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arms" className="text-sm text-muted-foreground">
                      Arms
                    </Label>
                    <Input
                      id="arms"
                      type="number"
                      step="0.1"
                      placeholder="35"
                      value={arms}
                      onChange={(e) => setArms(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legs" className="text-sm text-muted-foreground">
                      Legs
                    </Label>
                    <Input
                      id="legs"
                      type="number"
                      step="0.1"
                      placeholder="55"
                      value={legs}
                      onChange={(e) => setLegs(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How are you feeling? Any observations?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingEntry ? "Update Entry" : "Log Progress"}
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

      {/* Current Stats */}
      {latestStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Current Weight</CardDescription>
              <CardTitle className="text-3xl">{latestStats.weight || "-"}</CardTitle>
            </CardHeader>
            <CardContent>
              {weightChange && (
                <p className={`text-xs ${weightChange.change > 0 ? "text-destructive" : "text-accent"}`}>
                  {weightChange.change > 0 ? "+" : ""}
                  {weightChange.change.toFixed(1)} kg ({weightChange.percentage}%)
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Body Fat</CardDescription>
              <CardTitle className="text-3xl">{latestStats.bodyFat ? `${latestStats.bodyFat}%` : "-"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Percentage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Entries</CardDescription>
              <CardTitle className="text-3xl">{entries.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Progress logs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Last Updated</CardDescription>
              <CardTitle className="text-lg">{new Date(latestStats.date).toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Most recent entry</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress History */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No progress entries yet</h3>
            <p className="text-muted-foreground mb-4">Start tracking your fitness journey</p>
            <Button onClick={() => setIsDialogOpen(true)}>Log Progress</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Progress History</CardTitle>
            <CardDescription>Your fitness journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{new Date(entry.date).toLocaleDateString()}</h3>
                      {entry.notes && <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(entry)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(entry.id)}>
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
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {entry.weight && (
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-semibold">{entry.weight} kg</p>
                      </div>
                    )}
                    {entry.bodyFat && (
                      <div>
                        <p className="text-muted-foreground">Body Fat</p>
                        <p className="font-semibold">{entry.bodyFat}%</p>
                      </div>
                    )}
                    {entry.measurements?.chest && (
                      <div>
                        <p className="text-muted-foreground">Chest</p>
                        <p className="font-semibold">{entry.measurements.chest} cm</p>
                      </div>
                    )}
                    {entry.measurements?.waist && (
                      <div>
                        <p className="text-muted-foreground">Waist</p>
                        <p className="font-semibold">{entry.measurements.waist} cm</p>
                      </div>
                    )}
                    {entry.measurements?.hips && (
                      <div>
                        <p className="text-muted-foreground">Hips</p>
                        <p className="font-semibold">{entry.measurements.hips} cm</p>
                      </div>
                    )}
                    {entry.measurements?.arms && (
                      <div>
                        <p className="text-muted-foreground">Arms</p>
                        <p className="font-semibold">{entry.measurements.arms} cm</p>
                      </div>
                    )}
                    {entry.measurements?.legs && (
                      <div>
                        <p className="text-muted-foreground">Legs</p>
                        <p className="font-semibold">{entry.measurements.legs} cm</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
