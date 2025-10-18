"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { WorkoutVideo } from "@/lib/types"

export default function AdminVideosPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [videos, setVideos] = useState<WorkoutVideo[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<WorkoutVideo | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [duration, setDuration] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner")

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
    }
  }, [isAdmin, router])

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = () => {
    const data = localStorage.getItem("gymmine_videos")
    if (data) {
      const allVideos: WorkoutVideo[] = JSON.parse(data)
      setVideos(allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const videoData: WorkoutVideo = {
      id: editingVideo?.id || crypto.randomUUID(),
      title,
      description,
      videoUrl,
      thumbnail: thumbnail || `/placeholder.svg?height=200&width=350&query=${encodeURIComponent(title)}`,
      duration,
      category,
      difficulty,
      createdBy: user!.name,
      createdAt: editingVideo?.createdAt || new Date().toISOString(),
    }

    const data = localStorage.getItem("gymmine_videos")
    const allVideos: WorkoutVideo[] = data ? JSON.parse(data) : []

    if (editingVideo) {
      const updatedVideos = allVideos.map((v) => (v.id === editingVideo.id ? videoData : v))
      localStorage.setItem("gymmine_videos", JSON.stringify(updatedVideos))
    } else {
      allVideos.push(videoData)
      localStorage.setItem("gymmine_videos", JSON.stringify(allVideos))
    }

    resetForm()
    loadVideos()
    setIsDialogOpen(false)
  }

  const handleEdit = (video: WorkoutVideo) => {
    setEditingVideo(video)
    setTitle(video.title)
    setDescription(video.description)
    setVideoUrl(video.videoUrl)
    setThumbnail(video.thumbnail)
    setDuration(video.duration)
    setCategory(video.category)
    setDifficulty(video.difficulty)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const data = localStorage.getItem("gymmine_videos")
      if (data) {
        const allVideos: WorkoutVideo[] = JSON.parse(data)
        const updatedVideos = allVideos.filter((v) => v.id !== id)
        localStorage.setItem("gymmine_videos", JSON.stringify(updatedVideos))
        loadVideos()
      }
    }
  }

  const resetForm = () => {
    setEditingVideo(null)
    setTitle("")
    setDescription("")
    setVideoUrl("")
    setThumbnail("")
    setDuration("")
    setCategory("")
    setDifficulty("beginner")
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Videos</h1>
          <p className="text-muted-foreground text-lg">Add and manage workout videos</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
              <DialogDescription>
                {editingVideo ? "Update video information" : "Add a new workout video to the library"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Full Body HIIT Workout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the workout"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL (YouTube embed or direct link)</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://www.youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                <Input
                  id="thumbnail"
                  placeholder="Leave empty for auto-generated thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 30 min"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., HIIT, Strength"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingVideo ? "Update Video" : "Add Video"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos List */}
      {videos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first workout video</p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Video</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 aspect-video bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{video.title}</h3>
                      <p className="text-muted-foreground text-sm">{video.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{video.category}</Badge>
                      <Badge variant="secondary">{video.difficulty}</Badge>
                      <Badge variant="outline">{video.duration}</Badge>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(video.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
