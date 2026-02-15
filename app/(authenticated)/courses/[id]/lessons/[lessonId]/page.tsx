"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    ChevronRight,
    ChevronLeft
} from "lucide-react"

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string
    const lessonId = params.lessonId as string
    const { user, isAdmin } = useAuth()
    const [course, setCourse] = useState<Course | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                // Load course details
                const courseRes = await coursesApi.getCourseDetails(courseId)
                setCourse(courseRes.data)

                // Load course content
                try {
                    const contentRes = await enrollmentsApi.getCourseContent(courseId)
                    const loadedLessons = contentRes.data.lessons || []
                    setLessons(loadedLessons)

                    // Find the current lesson
                    const lesson = loadedLessons.find((l: Lesson) => l.id === lessonId)
                    if (lesson) {
                        setCurrentLesson(lesson)
                    } else {
                        // Lesson not found
                        router.push(`/courses/${courseId}`)
                    }
                } catch (error: any) {
                    const isNotEnrolled = error.status === 403 || error.message?.toLowerCase().includes("not enrolled")

                    if (isNotEnrolled && !isAdmin && user?.id !== courseRes.data.instructorId) {
                        router.push(`/courses/${courseId}`)
                        return
                    }

                    console.error("Failed to load lesson:", error)
                }
            } catch (error) {
                console.error("Failed to load course:", error)
                router.push("/courses")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [courseId, lessonId, router, user, isAdmin])

    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
        return `https://www.youtube.com/embed/${videoId}`
    }

    if (loading || !currentLesson) {
        return (
            <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading lesson...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0">
                    <Link href={`/courses/${courseId}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Course
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    {currentLesson.isFree && (
                        <Badge variant="secondary">Free Preview</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                        Lesson {currentIndex + 1} of {lessons.length}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Video Player */}
                <Card>
                    <CardContent className="p-0">
                        <div className="aspect-video relative rounded-t-xl overflow-hidden bg-black">
                            {currentLesson.videoUrl ? (
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
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
                                <p className="text-lg text-muted-foreground">{currentLesson.description}</p>
                            </div>

                            {/* Lesson Navigation */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                {previousLesson ? (
                                    <Button variant="outline" asChild>
                                        <Link href={`/courses/${courseId}/lessons/${previousLesson.id}`}>
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Previous: {previousLesson.title}
                                        </Link>
                                    </Button>
                                ) : (
                                    <div />
                                )}

                                {nextLesson ? (
                                    <Button variant="default" asChild>
                                        <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                                            Next: {nextLesson.title}
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="default" asChild>
                                        <Link href={`/courses/${courseId}`}>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Complete Course
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lesson Content */}
                {currentLesson.content && (
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Lesson Notes</h2>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Attachments */}
                {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Resources</h2>
                            <div className="space-y-2">
                                {currentLesson.attachments.map((attachment, index) => (
                                    <a
                                        key={index}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary">📎</span>
                                        </div>
                                        <span className="font-medium">{attachment.name}</span>
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
