"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Course, Lesson } from "@/lib/types"
import { CourseWizard } from "@/components/admin/course-wizard/CourseWizard"
import { coursesApi } from "@/lib/api/courses"
import { enrollmentsApi } from "@/lib/api/enrollments"
import { Loader2, Plus, Edit, Trash2, BookOpen, Search } from "lucide-react"

export default function AdminCoursesPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingLessons, setEditingLessons] = useState<Lesson[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isAdmin && user?.role?.toUpperCase() !== 'INSTRUCTOR') {
      router.push("/dashboard")
    }
  }, [isAdmin, user, router])

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const response = await coursesApi.listCourses()
      setCourses(response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error("Failed to load courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadLessons = async (courseId: string) => {
    try {
      const response = await enrollmentsApi.getCourseContent(courseId)
      return response.data.lessons
    } catch (error) {
      console.error("Failed to load lessons:", error)
      return []
    }
  }

  const handleSaveCourse = async (courseData: Course, lessons: Lesson[]) => {
    try {
      let savedCourse: Course;

      // Sanitize fields to avoid backend validation errors (e.g. sending ID for POST)
      const { id, createdAt, updatedAt, instructorId, instructorName, rating, studentsCount, lessonsCount, ...sanitizedData } = courseData;

      if (editingCourse) {
        const response = await coursesApi.updateCourse(editingCourse.id, sanitizedData)
        savedCourse = response.data
      } else {
        const response = await coursesApi.createCourse(sanitizedData)
        savedCourse = response.data
      }

      // Ensure each lesson has the correct courseId set
      const sanitizedLessons = lessons.map(lesson => ({
        ...lesson,
        courseId: savedCourse.id
      }));

      // Bulk save lessons
      await coursesApi.bulkSaveLessons(savedCourse.id, sanitizedLessons)

      setEditingCourse(null)
      setEditingLessons([])
      loadCourses()
      setIsWizardOpen(false)
    } catch (error) {
      console.error("Failed to save course:", error)
      alert("Failed to save course. Please check if all fields are correct.")
    }
  }

  const handleEdit = async (course: Course) => {
    setLoading(true)
    const lessons = await loadLessons(course.id)
    setEditingCourse(course)
    setEditingLessons(lessons)
    setLoading(false)
    setIsWizardOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await coursesApi.updateCourse(id, { status: 'archived' })
        loadCourses()
      } catch (error) {
        console.error("Failed to delete course:", error)
      }
    }
  }

  const handleCreateNew = () => {
    setEditingCourse(null)
    setEditingLessons([])
    setIsWizardOpen(true)
  }

  if (!isAdmin && user?.role?.toUpperCase() !== 'INSTRUCTOR') {
    return null
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
          <p className="text-muted-foreground">Create and manage your educational content</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {isWizardOpen && (
        <CourseWizard
          initialData={editingCourse}
          initialLessons={editingLessons}
          onClose={() => setIsWizardOpen(false)}
          onSave={handleSaveCourse}
        />
      )}

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Fetching courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">Create your first course to get started</p>
            <Button onClick={handleCreateNew} variant="outline">Create Course</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 aspect-video bg-muted relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(course)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(course.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="capitalize">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                      <span className="flex items-center gap-1">• {course.duration}</span>
                      <span className="flex items-center gap-1">• {course.lessonsCount} lessons</span>
                      <span className="flex items-center gap-1 font-medium text-foreground ml-auto">${course.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
