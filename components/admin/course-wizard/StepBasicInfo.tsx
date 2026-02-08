import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Course } from "@/lib/types"

interface StepBasicInfoProps {
    data: Partial<Course>
    updateData: (data: Partial<Course>) => void
}

export function StepBasicInfo({ data, updateData }: StepBasicInfoProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                    id="title"
                    value={data.title || ""}
                    onChange={(e) => updateData({ title: e.target.value })}
                    placeholder="e.g. Advanced React Patterns"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description || ""}
                    onChange={(e) => updateData({ description: e.target.value })}
                    placeholder="What will students learn in this course?"
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={data.category || ""}
                        onChange={(e) => updateData({ category: e.target.value })}
                        placeholder="e.g. Development"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                        value={data.level}
                        onValueChange={(value: any) => updateData({ level: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                            <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price || 0}
                        onChange={(e) => updateData({ price: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Total Duration</Label>
                    <Input
                        id="duration"
                        value={data.duration || ""}
                        onChange={(e) => updateData({ duration: e.target.value })}
                        placeholder="e.g. 10h 30m"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                    id="tags"
                    value={data.tags?.join(", ") || ""}
                    onChange={(e) => updateData({ tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    placeholder="React, Frontend, JavaScript"
                />
            </div>
        </div>
    )
}
