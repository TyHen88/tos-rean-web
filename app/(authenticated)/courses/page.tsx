"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { coursesApi } from "@/lib/api/courses"
import type { Course } from "@/lib/types"
import Link from "next/link"
import { BookOpen, Search, Filter, Star, Clock, Users, MoreVertical, Loader2 } from "lucide-react"

export default function CoursesPage() {
  const { user, isAdmin } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const loadInitialData = useCallback(async () => {
    try {
      const catRes = await coursesApi.listCategories()
      setCategories(catRes.data)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const loadCourses = useCallback(async () => {
    setLoading(true)
    try {
      const response = await coursesApi.listCourses({
        search: searchQuery || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        level: levelFilter === "all" ? undefined : levelFilter,
      })
      setCourses(response.data)
    } catch (error) {
      console.error("Failed to load courses:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, categoryFilter, levelFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses()
    }, 500) // Debounce search
    return () => clearTimeout(timer)
  }, [loadCourses])

  const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "BEGINNER": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "INTERMEDIATE": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "ADVANCED": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-muted-foreground mt-2">Discover new skills and advance your career with our best courses.</p>
        </div>
        {(isAdmin || user?.role === 'instructor') && (
          <Button asChild size="lg" className="gap-2">
            <Link href="/courses/new">
              <BookOpen className="w-4 h-4" />
              Create Course
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading excellent courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
          <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          <Button variant="link" onClick={() => {
            setSearchQuery("")
            setCategoryFilter("all")
            setLevelFilter("all")
          }} className="mt-4">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course: Course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="block h-full">
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-muted-foreground/20 overflow-hidden flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <Badge className="absolute top-3 right-3 shadow-sm bg-background/90 text-foreground backdrop-blur hover:bg-background">
                    {course.category}
                  </Badge>
                </div>

                <CardHeader className="p-4 space-y-2 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs font-medium flex items-center gap-1">
                    By {course.instructorName}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3 flex-1">
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{course.rating}</span>
                    <span className="text-muted-foreground font-normal">({course.studentsCount.toLocaleString()})</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course.lessonsCount} lessons
                    </div>
                  </div>

                  <Badge variant="secondary" className={`text-xs font-normal border-0 ${getLevelColor(course.level)}`}>
                    {course.level}
                  </Badge>
                </CardContent>

                <CardFooter className="p-4 pt-0 border-t bg-muted/10 mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${course.price}</span>
                  <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors -mr-2">
                    Details <MoreVertical className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
