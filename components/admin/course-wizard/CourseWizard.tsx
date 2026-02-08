"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StepBasicInfo } from "./StepBasicInfo"
import { StepCurriculum } from "./StepCurriculum"
import { StepMedia } from "./StepMedia"
import { StepReview } from "./StepReview"
import type { Course, Lesson } from "@/lib/types"
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react"

interface CourseWizardProps {
    initialData?: Course | null
    initialLessons?: Lesson[]
    onClose: () => void
    onSave: (course: Course, lessons: Lesson[]) => void
}

const STEPS = [
    { id: "basic", title: "Basic Information" },
    { id: "media", title: "Media & Preview" },
    { id: "curriculum", title: "Curriculum" },
    { id: "review", title: "Review & Publish" },
]

export function CourseWizard({ initialData, initialLessons, onClose, onSave }: CourseWizardProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [courseData, setCourseData] = useState<Partial<Course>>(
        initialData || {
            title: "",
            description: "",
            category: "",
            level: "BEGINNER",
            price: 0,
            duration: "",
            tags: [],
            status: "draft",
        }
    )
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons || [])

    const updateCourseData = useCallback((newData: Partial<Course>) => {
        setCourseData((prev) => ({ ...prev, ...newData }))
    }, [])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleFinish = () => {
        // Basic validation
        if (!courseData.title || !courseData.description) {
            alert("Please fill in the required fields.")
            return
        }

        // Convert lessons duration to total duration string if needed
        const totalDurationMinutes = lessons.reduce((acc, l) => acc + l.duration, 0)
        const hours = Math.floor(totalDurationMinutes / 60)
        const minutes = totalDurationMinutes % 60
        const durationString = `${hours}h ${minutes}m`

        const finalCourseData = {
            ...courseData,
            duration: durationString,
            lessonsCount: lessons.length
        } as Course

        onSave(finalCourseData, lessons)
    }

    const stepProgress = ((currentStep + 1) / STEPS.length) * 100

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl border-primary/20">
                <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            {initialData ? "Edit Course" : "Create New Course"}
                            <span className="text-muted-foreground font-normal text-sm">
                                - Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
                            </span>
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </CardHeader>

                <div className="w-full bg-muted/50 h-2">
                    <Progress value={stepProgress} className="h-2 rounded-none" />
                </div>

                <CardContent className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-2xl mx-auto">
                        {currentStep === 0 && (
                            <StepBasicInfo data={courseData} updateData={updateCourseData} />
                        )}
                        {currentStep === 1 && (
                            <StepMedia data={courseData} updateData={updateCourseData} />
                        )}
                        {currentStep === 2 && (
                            <StepCurriculum lessons={lessons} setLessons={setLessons} />
                        )}
                        {currentStep === 3 && (
                            <StepReview data={courseData} lessons={lessons} />
                        )}
                    </div>
                </CardContent>

                <CardFooter className="border-t px-6 py-4 flex justify-between bg-muted/20">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>

                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        {currentStep === STEPS.length - 1 ? (
                            <Button onClick={handleFinish} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                                <Save className="w-4 h-4" /> Save Course
                            </Button>
                        ) : (
                            <Button onClick={handleNext} className="gap-2">
                                Next <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
