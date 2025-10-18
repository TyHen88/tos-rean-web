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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TodoItem } from "@/lib/types"

export default function TodosPage() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [viewMode, setViewMode] = useState<"all" | "today" | "week">("all")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [category, setCategory] = useState<"workout" | "nutrition" | "general">("general")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    loadTodos()
  }, [user])

  const loadTodos = () => {
    const data = localStorage.getItem("gymmine_todos")
    if (data) {
      const allTodos: TodoItem[] = JSON.parse(data)
      const userTodos = allTodos.filter((t) => t.userId === user?.id)
      setTodos(userTodos.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const todoData: TodoItem = {
      id: editingTodo?.id || crypto.randomUUID(),
      userId: user!.id,
      title,
      description,
      completed: editingTodo?.completed || false,
      priority,
      dueDate,
      category,
      createdAt: editingTodo?.createdAt || new Date().toISOString(),
    }

    const data = localStorage.getItem("gymmine_todos")
    const allTodos: TodoItem[] = data ? JSON.parse(data) : []

    if (editingTodo) {
      const updatedTodos = allTodos.map((t) => (t.id === editingTodo.id ? todoData : t))
      localStorage.setItem("gymmine_todos", JSON.stringify(updatedTodos))
    } else {
      allTodos.push(todoData)
      localStorage.setItem("gymmine_todos", JSON.stringify(allTodos))
    }

    resetForm()
    loadTodos()
    setIsDialogOpen(false)
  }

  const handleEdit = (todo: TodoItem) => {
    setEditingTodo(todo)
    setTitle(todo.title)
    setDescription(todo.description)
    setPriority(todo.priority)
    setCategory(todo.category)
    setDueDate(todo.dueDate)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      const data = localStorage.getItem("gymmine_todos")
      if (data) {
        const allTodos: TodoItem[] = JSON.parse(data)
        const updatedTodos = allTodos.filter((t) => t.id !== id)
        localStorage.setItem("gymmine_todos", JSON.stringify(updatedTodos))
        loadTodos()
      }
    }
  }

  const handleToggleComplete = (todo: TodoItem) => {
    const data = localStorage.getItem("gymmine_todos")
    if (data) {
      const allTodos: TodoItem[] = JSON.parse(data)
      const updatedTodos = allTodos.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
      localStorage.setItem("gymmine_todos", JSON.stringify(updatedTodos))
      loadTodos()
    }
  }

  const resetForm = () => {
    setEditingTodo(null)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setCategory("general")
    setDueDate("")
  }

  const getFilteredTodos = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)

    if (viewMode === "today") {
      return todos.filter((t) => {
        const todoDate = new Date(t.dueDate)
        todoDate.setHours(0, 0, 0, 0)
        return todoDate.getTime() === today.getTime()
      })
    } else if (viewMode === "week") {
      return todos.filter((t) => {
        const todoDate = new Date(t.dueDate)
        return todoDate >= today && todoDate <= weekFromNow
      })
    }
    return todos
  }

  const filteredTodos = getFilteredTodos()
  const completedCount = filteredTodos.filter((t) => t.completed).length
  const totalCount = filteredTodos.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-primary text-primary-foreground"
      case "low":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "workout":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case "nutrition":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        )
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Todos</h1>
          <p className="text-muted-foreground text-lg">Track your daily and weekly tasks</p>
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
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTodo ? "Edit Todo" : "Add New Todo"}</DialogTitle>
              <DialogDescription>{editingTodo ? "Update your todo item" : "Create a new todo item"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete morning workout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about this task"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workout">Workout</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingTodo ? "Update Todo" : "Create Todo"}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-3xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalCount} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Tasks</CardDescription>
            <CardTitle className="text-3xl">{totalCount - completedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Tasks to complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Tasks finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value={viewMode} className="space-y-4">
          {filteredTodos.length === 0 ? (
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No todos found</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first todo</p>
                <Button onClick={() => setIsDialogOpen(true)}>Add Todo</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <Card key={todo.id} className={todo.completed ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleComplete(todo)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold ${todo.completed ? "line-through" : ""}`}>{todo.title}</h3>
                            {todo.description && (
                              <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={getPriorityColor(todo.priority)}>{todo.priority}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getCategoryIcon(todo.category)}
                            {todo.category}
                          </Badge>
                          <Badge variant="outline">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(todo)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(todo.id)}>
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
      </Tabs>
    </div>
  )
}
