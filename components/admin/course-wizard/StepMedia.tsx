import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Course } from "@/lib/types"

interface StepMediaProps {
    data: Partial<Course>
    updateData: (data: Partial<Course>) => void
}

export function StepMedia({ data, updateData }: StepMediaProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                    id="thumbnail"
                    value={data.thumbnail || ""}
                    onChange={(e) => updateData({ thumbnail: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                />
                {data.thumbnail && (
                    <div className="mt-4 border rounded-md overflow-hidden bg-muted aspect-video max-w-sm">
                        <img
                            src={data.thumbnail}
                            alt="Course Thumbnail Preview"
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="videoUrl">Promo Video URL (Optional)</Label>
                <Input
                    id="videoUrl"
                    value={data.videoUrl || ""}
                    onChange={(e) => updateData({ videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                />
                {data.videoUrl && (
                    <div className="mt-4 border rounded-md overflow-hidden bg-muted aspect-video max-w-sm">
                        <iframe
                            src={data.videoUrl.replace("watch?v=", "embed/")}
                            className="w-full h-full"
                            title="Video Preview"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
