"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Course } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { enrollmentsApi } from "@/lib/api/enrollments"
import { Loader2, BookOpen, Clock, Award, PlayCircle, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState<(Course & { progress: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const response = await enrollmentsApi.getMyLearning()
        setEnrolledCourses(response.data.slice(0, 2)) // Show top 2 in dashboard
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back, {user?.name}! Ready to continue learning?</p>
        </div>
        <Button asChild>
          <Link href="/courses">Explore Courses</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Courses in Progress</CardTitle>
                <BookOpen className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{enrolledCourses.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Hours Learned</CardTitle>
                <Clock className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12.5</div>
                <p className="text-xs text-muted-foreground mt-1">+2.5 hours this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Certificates Earned</CardTitle>
                <Award className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Complete a course to earn one</p>
              </CardContent>
            </Card>
          </div>

          {/* Continue Learning Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Continue Learning</h2>
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="w-full md:w-1/3 aspect-video md:aspect-auto relative bg-muted">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white/90" />
                        </div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg line-clamp-1">{course.title}</h3>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>
                        <div className="pt-4">
                          <Button size="sm" className="w-full md:w-auto gap-2" asChild>
                            <Link href={`/courses/${course.id}`}>
                              Continue Lesson <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <BookOpen className="w-12 h-12 text-muted-foreground/50" />
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">No courses enrolled</h3>
                    <p className="text-muted-foreground">Start your learning journey by enrolling in a course.</p>
                  </div>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
