import { Course, Lesson } from "@/lib/types"

interface StepReviewProps {
    data: Partial<Course>
    lessons: Lesson[]
}

export function StepReview({ data, lessons }: StepReviewProps) {
    const totalDuration = lessons.reduce((acc, lesson) => acc + lesson.duration, 0)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Basic Information</h3>
                    <div className="space-y-2">
                        <div>
                            <span className="text-sm text-muted-foreground">Title:</span>
                            <p className="font-medium">{data.title}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Category:</span>
                            <p>{data.category}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Level:</span>
                            <p>{data.level}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Price:</span>
                            <p>${data.price}</p>
                        </div>
                    </div>
                </div>

                {data.thumbnail && (
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Preview</h3>
                        <div className="aspect-video relative rounded-lg overflow-hidden border">
                            <img src={data.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Curriculum Summary</h3>
                <div className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium">Total Lessons: {lessons.length}</span>
                        <span className="text-sm font-medium">Total Duration: {Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground max-h-48 overflow-y-auto">
                        {lessons.map((lesson, idx) => (
                            <li key={idx} className="flex justify-between">
                                <span>{idx + 1}. {lesson.title}</span>
                                <span>{lesson.duration}m</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
