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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FoodEntry } from "@/lib/types"

export default function NutritionPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState<"food" | "drink">("food")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fats, setFats] = useState("")
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")

  useEffect(() => {
    loadEntries()
  }, [user])

  useEffect(() => {
    filterTodayEntries()
  }, [entries, selectedDate])

  const loadEntries = () => {
    const data = localStorage.getItem("gymmine_food")
    if (data) {
      const allEntries: FoodEntry[] = JSON.parse(data)
      const userEntries = allEntries.filter((e) => e.userId === user?.id)
      setEntries(userEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    }
  }

  const filterTodayEntries = () => {
    const filtered = entries.filter((e) => e.date === selectedDate)
    setTodayEntries(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const entryData: FoodEntry = {
      id: editingEntry?.id || crypto.randomUUID(),
      userId: user!.id,
      name,
      type,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      date: selectedDate,
      mealType,
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
    }

    const data = localStorage.getItem("gymmine_food")
    const allEntries: FoodEntry[] = data ? JSON.parse(data) : []

    if (editingEntry) {
      const updatedEntries = allEntries.map((e) => (e.id === editingEntry.id ? entryData : e))
      localStorage.setItem("gymmine_food", JSON.stringify(updatedEntries))
    } else {
      allEntries.push(entryData)
      localStorage.setItem("gymmine_food", JSON.stringify(allEntries))
    }

    resetForm()
    loadEntries()
    setIsDialogOpen(false)
  }

  const handleEdit = (entry: FoodEntry) => {
    setEditingEntry(entry)
    setName(entry.name)
    setType(entry.type)
    setCalories(entry.calories.toString())
    setProtein(entry.protein.toString())
    setCarbs(entry.carbs.toString())
    setFats(entry.fats.toString())
    setMealType(entry.mealType)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const data = localStorage.getItem("gymmine_food")
      if (data) {
        const allEntries: FoodEntry[] = JSON.parse(data)
        const updatedEntries = allEntries.filter((e) => e.id !== id)
        localStorage.setItem("gymmine_food", JSON.stringify(updatedEntries))
        loadEntries()
      }
    }
  }

  const resetForm = () => {
    setEditingEntry(null)
    setName("")
    setType("food")
    setCalories("")
    setProtein("")
    setCarbs("")
    setFats("")
    setMealType("breakfast")
  }

  const getTotalNutrition = () => {
    return todayEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fats: acc.fats + entry.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    )
  }

  const getEntriesByMealType = (meal: string) => {
    return todayEntries.filter((e) => e.mealType === meal)
  }

  const totals = getTotalNutrition()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Nutrition Tracker</h1>
          <p className="text-muted-foreground text-lg">Track your daily food and drink intake</p>
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
              Log Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Entry" : "Log Food/Drink"}</DialogTitle>
              <DialogDescription>
                {editingEntry ? "Update your nutrition entry" : "Add a new food or drink entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Chicken Breast"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={(value: "food" | "drink") => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="drink">Drink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mealType">Meal Type</Label>
                <Select
                  value={mealType}
                  onValueChange={(value: "breakfast" | "lunch" | "dinner" | "snack") => setMealType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    placeholder="0"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingEntry ? "Update Entry" : "Log Entry"}
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

      {/* Date Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="date">Select Date:</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Calories</CardDescription>
            <CardTitle className="text-3xl">{totals.calories}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">kcal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Protein</CardDescription>
            <CardTitle className="text-3xl">{totals.protein}g</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">grams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Carbs</CardDescription>
            <CardTitle className="text-3xl">{totals.carbs}g</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">grams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Fats</CardDescription>
            <CardTitle className="text-3xl">{totals.fats}g</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">grams</p>
          </CardContent>
        </Card>
      </div>

      {/* Meals Breakdown */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snack">Snacks</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {todayEntries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <svg
                  className="w-16 h-16 text-muted-foreground mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No entries for this date</h3>
                <p className="text-muted-foreground mb-4">Start logging your meals and drinks</p>
                <Button onClick={() => setIsDialogOpen(true)}>Log Entry</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {["breakfast", "lunch", "dinner", "snack"].map((meal) => {
                const mealEntries = getEntriesByMealType(meal)
                if (mealEntries.length === 0) return null

                return (
                  <Card key={meal}>
                    <CardHeader>
                      <CardTitle className="capitalize">{meal}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mealEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{entry.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {entry.type}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>{entry.calories} kcal</span>
                              <span>P: {entry.protein}g</span>
                              <span>C: {entry.carbs}g</span>
                              <span>F: {entry.fats}g</span>
                            </div>
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
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
          <TabsContent key={meal} value={meal} className="space-y-4">
            {getEntriesByMealType(meal).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No {meal} entries</h3>
                  <p className="text-muted-foreground mb-4">Log your {meal} items</p>
                  <Button onClick={() => setIsDialogOpen(true)}>Log Entry</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {getEntriesByMealType(meal).map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{entry.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {entry.type}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{entry.calories} kcal</span>
                            <span>P: {entry.protein}g</span>
                            <span>C: {entry.carbs}g</span>
                            <span>F: {entry.fats}g</span>
                          </div>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
