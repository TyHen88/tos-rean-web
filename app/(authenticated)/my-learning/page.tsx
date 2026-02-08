"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Course } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { enrollmentsApi } from "@/lib/api/enrollments"
import { Loader2, BookOpen, PlayCircle, Clock } from "lucide-react"

export default function MyLearningPage() {
    const { user } = useAuth()
    const [enrolledCourses, setEnrolledCourses] = useState<(Course & { progress: number })[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadMyLearning = async () => {
            setLoading(true)
            try {
                const response = await enrollmentsApi.getMyLearning()
                setEnrolledCourses(response.data)
            } catch (error) {
                console.error("Failed to load my learning:", error)
            } finally {
                setLoading(false)
            }
        }
        loadMyLearning()
    }, [])

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Learning</h1>
                <p className="text-muted-foreground">Track your progress and continue learning</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Fetching your learning progress...</p>
                </div>
            ) : enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                        <Card key={course.id} className="flex flex-col overflow-hidden group">
                            <div className="aspect-video relative overflow-hidden bg-muted">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <CardContent className="flex-1 p-5 flex flex-col gap-4">
                                <div className="space-y-2 flex-1">
                                    <h3 className="font-bold line-clamp-2">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>{course.progress}% Complete</span>
                                        <span className="text-muted-foreground">{course.lessonsCount} Lessons</span>
                                    </div>
                                    <Progress value={course.progress} className="h-2" />
                                </div>

                                <Button className="w-full" asChild>
                                    <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20 border-dashed">
                    <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold">No courses enrolled</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">You haven't enrolled in any courses yet. Explore our library to find something new.</p>
                    <Button asChild>
                        <Link href="/courses">Browse Courses</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
