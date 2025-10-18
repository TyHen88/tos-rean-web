"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WorkoutVideo } from "@/lib/types"
import Link from "next/link"

export default function VideosPage() {
  const { user, isAdmin } = useAuth()
  const [videos, setVideos] = useState<WorkoutVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<WorkoutVideo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  useEffect(() => {
    loadVideos()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [videos, searchQuery, categoryFilter, difficultyFilter])

  const loadVideos = () => {
    const data = localStorage.getItem("gymmine_videos")
    if (data) {
      const allVideos: WorkoutVideo[] = JSON.parse(data)
      setVideos(allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } else {
      // Add some sample videos
      const sampleVideos: WorkoutVideo[] = [
        {
          id: crypto.randomUUID(),
          title: "Full Body HIIT Workout",
          description: "High-intensity interval training for full body conditioning",
          videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI",
          thumbnail: "/hiit-workout.png",
          duration: "30 min",
          category: "HIIT",
          difficulty: "intermediate",
          createdBy: "GymMine",
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          title: "Beginner Strength Training",
          description: "Perfect introduction to strength training with basic exercises",
          videoUrl: "https://www.youtube.com/embed/U9ENCvFf9yQ",
          thumbnail: "/strength-training-diverse-group.png",
          duration: "25 min",
          category: "Strength",
          difficulty: "beginner",
          createdBy: "GymMine",
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          title: "Advanced Cardio Blast",
          description: "Intense cardio workout for experienced athletes",
          videoUrl: "https://www.youtube.com/embed/gC_L9qAHVJ8",
          thumbnail: "/cardio-workout.png",
          duration: "45 min",
          category: "Cardio",
          difficulty: "advanced",
          createdBy: "GymMine",
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem("gymmine_videos", JSON.stringify(sampleVideos))
      setVideos(sampleVideos)
    }
  }

  const filterVideos = () => {
    let filtered = videos

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((v) => v.category.toLowerCase() === categoryFilter.toLowerCase())
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((v) => v.difficulty === difficultyFilter)
    }

    setFilteredVideos(filtered)
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

  const categories = Array.from(new Set(videos.map((v) => v.category)))

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-accent text-accent-foreground"
      case "intermediate":
        return "bg-primary text-primary-foreground"
      case "advanced":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Workout Videos</h1>
          <p className="text-muted-foreground text-lg">Browse and learn from our video library</p>
        </div>
        {isAdmin && (
          <Button asChild size="lg">
            <Link href="/admin/videos">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manage Videos
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
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
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{video.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{video.category}</Badge>
                  <Badge className={getDifficultyColor(video.difficulty)}>{video.difficulty}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/videos/${video.id}`}>Watch Now</Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="icon" onClick={() => handleDelete(video.id)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
