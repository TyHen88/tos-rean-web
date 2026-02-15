"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Course, Lesson } from "@/lib/types"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { coursesApi } from "@/lib/api/courses"
import { enrollmentsApi } from "@/lib/api/enrollments"
import { Loader2, ArrowLeft, BookOpen, Clock, Star, Users, PlayCircle, Lock, CheckCircle } from "lucide-react"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { user, isAdmin } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollLoading, setEnrollLoading] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const courseRes = await coursesApi.getCourseDetails(id)

        // Normalize the course data to handle field name differences
        const normalizedCourse = {
          ...courseRes.data,
          // Map averageRating to rating for display
          rating: courseRes.data.rating ?? (typeof courseRes.data.averageRating === 'string'
            ? parseFloat(courseRes.data.averageRating)
            : courseRes.data.averageRating),
          // Map enrollmentCount to studentsCount for display
          studentsCount: courseRes.data.studentsCount ?? courseRes.data.enrollmentCount ?? 0,
          // Ensure lessonsCount is set (will be updated when lessons load)
          lessonsCount: courseRes.data.lessonsCount ?? 0,
        }

        setCourse(normalizedCourse)

        // Try to fetch lessons if enrolled or admin/instructor
        try {
          const contentRes = await enrollmentsApi.getCourseContent(id)
          const loadedLessons = contentRes.data.lessons || []
          setLessons(loadedLessons)
          setIsEnrolled(true)

          // Update lessonsCount based on actual lessons
          setCourse(prev => prev ? { ...prev, lessonsCount: loadedLessons.length } : prev)
        } catch (error: any) {
          // If 403/Not Enrolled, we just show the public view
          const isNotEnrolled = error.status === 403 || error.message?.toLowerCase().includes("not enrolled");

          if (isNotEnrolled) {
            setIsEnrolled(false)
          } else {
            console.error("Failed to load course content:", error)
          }
        }
      } catch (error) {
        console.error("Failed to load course details:", error)
        router.push("/courses")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, router])

  const handleEnroll = async () => {
    setEnrollLoading(true)
    try {
      const response = await enrollmentsApi.initiateCheckout(id)
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl
      }
    } catch (error) {
      console.error("Enrollment failed:", error)
      alert("Failed to initiate enrollment. Please try again.")
    } finally {
      setEnrollLoading(false)
    }
  }

  if (loading || !course) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
        <Link href="/courses">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{course.description}</p>

            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div className="flex items-center gap-1">
                <Badge variant="secondary">{course.category}</Badge>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 font-medium">
                <Star className="w-4 h-4 fill-current" /> {course.rating?.toFixed(1) || 'N/A'} ({course.studentsCount || 0} students)
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" /> {course.duration}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="w-4 h-4" /> {course.lessonsCount || lessons.length || 0} lessons
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" /> {course.instructorName}
              </div>
            </div>
          </div>

          <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg border">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer hover:bg-black/50 transition-colors">
              <PlayCircle className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <Card>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {lessons.map((lesson, index) => (
                    <AccordionItem value={lesson.id} key={lesson.id} className="px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${lesson.isFree || isEnrolled || isAdmin || (user?.id === course?.instructorId) ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <span className="font-medium">{lesson.title}</span>
                            <div className="text-xs text-muted-foreground font-normal">{lesson.duration} min</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-11 text-muted-foreground">
                        {lesson.description}
                        <div className="mt-2 flex items-center gap-2">
                          {isEnrolled || isAdmin || (user?.id === course?.instructorId) ? (
                            <Button size="sm" variant="secondary" className="h-7 text-xs" asChild>
                              <Link href={`/courses/${id}/lessons/${lesson.id}`}>
                                Start Lesson
                              </Link>
                            </Button>
                          ) : lesson.isFree ? (
                            <Button size="sm" variant="secondary" className="h-7 text-xs">Preview Lesson</Button>
                          ) : (
                            <span className="flex items-center gap-1 text-xs"><Lock className="w-3 h-3" /> Locked</span>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">${course.price}</CardTitle>
              <CardDescription>One-time payment. Lifetime access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEnrolled || isAdmin || (user?.id === course?.instructorId) ? (
                <Button size="lg" className="w-full" variant="outline" asChild>
                  <Link href={`/courses/${id}/learn`}>Continue Learning</Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                >
                  {enrollLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enroll Now
                </Button>
              )}
              <p className="text-xs text-center text-muted-foreground">30-Day Money-Back Guarantee</p>

              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm">This course includes:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> {course.duration} on-demand video
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> {course.lessonsCount || lessons.length || 0} lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> Certificate of completion
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Access on mobile and TV
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
