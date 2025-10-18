"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { GymSchedule, TodoItem, FoodEntry } from "@/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [todaySchedules, setTodaySchedules] = useState<GymSchedule[]>([])
  const [pendingTodos, setPendingTodos] = useState<TodoItem[]>([])
  const [todayCalories, setTodayCalories] = useState(0)

  useEffect(() => {
    // Load today's schedules
    const schedulesData = localStorage.getItem("gymmine_schedules")
    if (schedulesData) {
      const schedules: GymSchedule[] = JSON.parse(schedulesData)
      const today = new Date().toISOString().split("T")[0]
      const todayItems = schedules.filter((s) => s.userId === user?.id && s.date === today && !s.completed)
      setTodaySchedules(todayItems)
    }

    // Load pending todos
    const todosData = localStorage.getItem("gymmine_todos")
    if (todosData) {
      const todos: TodoItem[] = JSON.parse(todosData)
      const pending = todos.filter((t) => t.userId === user?.id && !t.completed).slice(0, 5)
      setPendingTodos(pending)
    }

    // Calculate today's calories
    const foodData = localStorage.getItem("gymmine_food")
    if (foodData) {
      const foods: FoodEntry[] = JSON.parse(foodData)
      const today = new Date().toISOString().split("T")[0]
      const todayFoods = foods.filter((f) => f.userId === user?.id && f.date === today)
      const total = todayFoods.reduce((sum, f) => sum + f.calories, 0)
      setTodayCalories(total)
    }
  }, [user])

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground text-lg">Here's your fitness overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Workouts</CardTitle>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todaySchedules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTodos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">To complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calories Today</CardTitle>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayCalories}</div>
            <p className="text-xs text-muted-foreground mt-1">kcal consumed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your fitness routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6 bg-transparent">
              <Link href="/schedule">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Workout</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6 bg-transparent">
              <Link href="/nutrition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Log Meal</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6 bg-transparent">
              <Link href="/videos">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Watch Videos</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6 bg-transparent">
              <Link href="/progress">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Track Progress</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      {todaySchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Workouts</CardTitle>
            <CardDescription>Your scheduled gym sessions for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{schedule.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href="/schedule">View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
