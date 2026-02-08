import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Lesson } from "@/lib/types"
import { Plus, Trash2, Edit, GripVertical, Clock } from "lucide-react"

interface StepCurriculumProps {
    lessons: Lesson[]
    setLessons: (lessons: Lesson[]) => void
}

export function StepCurriculum({ lessons, setLessons }: StepCurriculumProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [duration, setDuration] = useState(15)
    const [isFree, setIsFree] = useState(false)
    const [videoUrl, setVideoUrl] = useState("")

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setDuration(15)
        setIsFree(false)
        setVideoUrl("")
        setIsAdding(false)
        setEditingId(null)
    }

    const handleSave = () => {
        if (!title) return

        if (editingId) {
            setLessons(lessons.map(l => l.id === editingId ? {
                ...l,
                title,
                description,
                duration,
                isFree,
                videoUrl,
            } : l))
        } else {
            const newLesson: Lesson = {
                id: crypto.randomUUID(),
                courseId: "", // Will be set when course is saved
                title,
                description,
                duration,
                isFree,
                videoUrl,
                order: lessons.length,
                createdAt: new Date().toISOString()
            }
            setLessons([...lessons, newLesson])
        }
        resetForm()
    }

    const handleEdit = (lesson: Lesson) => {
        setEditingId(lesson.id)
        setTitle(lesson.title)
        setDescription(lesson.description)
        setDuration(lesson.duration)
        setIsFree(lesson.isFree)
        setVideoUrl(lesson.videoUrl || "")
        setIsAdding(true)
    }

    const handleDelete = (id: string) => {
        setLessons(lessons.filter(l => l.id !== id))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Course Modules ({lessons.length})</h3>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Add Lesson
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-primary">
                    <CardHeader>
                        <CardTitle className="text-sm">{editingId ? "Edit Lesson" : "New Lesson"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Introduction to..." focus-visible="true" autoFocus />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief summary..." rows={2} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Duration (min)</Label>
                                <Input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Video URL</Label>
                                <Input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="free-preview" checked={isFree} onCheckedChange={(c) => setIsFree(!!c)} />
                            <Label htmlFor="free-preview" className="font-normal cursor-pointer">Allow as Free Preview</Label>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={resetForm} size="sm">Cancel</Button>
                            <Button onClick={handleSave} size="sm">{editingId ? "Update" : "Add"}</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-2">
                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="group flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <div className="cursor-move text-muted-foreground">
                            <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium truncate">{index + 1}. {lesson.title}</span>
                                {lesson.isFree && <Badge variant="secondary" className="text-[10px] h-5">Free</Badge>}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground gap-3">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration} min</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(lesson)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(lesson.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {!isAdding && lessons.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        No lessons added yet.
                    </div>
                )}
            </div>
        </div>
    )
}
