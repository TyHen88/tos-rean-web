"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Course, Lesson } from "@/lib/types"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { coursesApi } from "@/lib/api/courses"
import { enrollmentsApi } from "@/lib/api/enrollments"
import {
    Loader2,
    ArrowLeft,
    CheckCircle,
    PlayCircle,
    Lock,
    ChevronRight,
    ChevronLeft,
    BookOpen,
    Clock
} from "lucide-react"

export default function CourseLearnPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const { user, isAdmin } = useAuth()
    const [course, setCourse] = useState<Course | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [completedLessons, setCompletedLessons] = useState<string[]>([])
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                // Load course details
                const courseRes = await coursesApi.getCourseDetails(id)

                const normalizedCourse = {
                    ...courseRes.data,
                    rating: courseRes.data.rating ?? (typeof courseRes.data.averageRating === 'string'
                        ? parseFloat(courseRes.data.averageRating)
                        : courseRes.data.averageRating),
                    studentsCount: courseRes.data.studentsCount ?? courseRes.data.enrollmentCount ?? 0,
                    lessonsCount: courseRes.data.lessonsCount ?? 0,
                }

                setCourse(normalizedCourse)

                // Load course content (lessons)
                try {
                    const contentRes = await enrollmentsApi.getCourseContent(id)
                    const loadedLessons = contentRes.data?.course?.lessons || []
                    setLessons(loadedLessons)

                    // Update course with actual lesson count
                    setCourse(prev => prev ? { ...prev, lessonsCount: loadedLessons.length } : prev)

                    // Load enrollment progress
                    // TODO: Implement progress tracking API
                    // For now, using mock data
                    setCompletedLessons([])
                    setProgress(0)
                } catch (error: any) {
                    const isNotEnrolled = error.status === 403 || error.message?.toLowerCase().includes("not enrolled")

                    if (isNotEnrolled && !isAdmin && user?.id !== courseRes.data.instructorId) {
                        // Redirect to course detail page if not enrolled
                        router.push(`/courses/${id}`)
                        return
                    }

                    console.error("Failed to load course content:", error)
                }
            } catch (error) {
                console.error("Failed to load course:", error)
                router.push("/courses")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [id, router, user, isAdmin])

    const currentLesson = lessons[currentLessonIndex]

    const handleNextLesson = () => {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1)
        }
    }

    const handlePreviousLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1)
        }
    }

    const handleMarkComplete = () => {
        if (currentLesson && !completedLessons.includes(currentLesson.id)) {
            const newCompleted = [...completedLessons, currentLesson.id]
            setCompletedLessons(newCompleted)
            setProgress((newCompleted.length / lessons.length) * 100)

            // TODO: Call API to save progress
            // enrollmentsApi.updateProgress(id, { completedLessons: newCompleted })
        }
    }

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
        return `https://www.youtube.com/embed/${videoId}`
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

    if (lessons.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href={`/courses/${id}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Course
                    </Link>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>No Lessons Available</CardTitle>
                        <CardDescription>
                            This course doesn't have any lessons yet. Please check back later.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0">
                    <Link href={`/courses/${id}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Course
                    </Link>
                </Button>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        Lesson {currentLessonIndex + 1} of {lessons.length}
                    </div>
                    <Progress value={progress} className="w-32" />
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Player */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="aspect-video relative rounded-t-xl overflow-hidden bg-black">
                                {currentLesson?.videoUrl ? (
                                    <iframe
                                        src={getYouTubeEmbedUrl(currentLesson.videoUrl)}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white">
                                        <div className="text-center">
                                            <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg">No video available for this lesson</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold mb-2">{currentLesson?.title}</h1>
                                        <p className="text-muted-foreground">{currentLesson?.description}</p>
                                    </div>
                                    {completedLessons.includes(currentLesson?.id || '') ? (
                                        <Badge variant="default" className="ml-4">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Completed
                                        </Badge>
                                    ) : (
                                        <Button onClick={handleMarkComplete} variant="outline" className="ml-4">
                                            Mark as Complete
                                        </Button>
                                    )}
                                </div>

                                {/* Lesson Navigation */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={handlePreviousLesson}
                                        disabled={currentLessonIndex === 0}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={handleNextLesson}
                                        disabled={currentLessonIndex === lessons.length - 1}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lesson Content */}
                    {currentLesson?.content && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Lesson Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    {currentLesson.content}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Lesson List */}
                <div className="space-y-6">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-lg">Course Content</CardTitle>
                            <CardDescription>
                                {completedLessons.length} of {lessons.length} lessons completed
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[600px] overflow-y-auto">
                                {lessons.map((lesson, index) => {
                                    const isCompleted = completedLessons.includes(lesson.id)
                                    const isCurrent = index === currentLessonIndex

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentLessonIndex(index)}
                                            className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${isCurrent ? 'bg-muted' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCompleted
                                                    ? 'bg-green-500 text-white'
                                                    : isCurrent
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground'
                                                    }`}>
                                                    {isCompleted ? (
                                                        <CheckCircle className="w-4 h-4" />
                                                    ) : (
                                                        <span className="text-xs font-bold">{index + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-medium text-sm mb-1 ${isCurrent ? 'text-primary' : ''
                                                        }`}>
                                                        {lesson.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{lesson.duration} min</span>
                                                        {lesson.isFree && (
                                                            <Badge variant="secondary" className="text-xs">Free</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
