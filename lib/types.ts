export type UserRole = "ADMIN" | "STUDENT" | "INSTRUCTOR" | "admin" | "student" | "instructor"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  bio?: string
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructorId: string
  instructorName: string
  price: number
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS" | "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  category: string
  tags: string[]
  duration: string
  lessonsCount: number
  studentsCount: number
  rating: number
  videoUrl?: string // Promo video
  content?: string // Markdown description
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl?: string
  content?: string // Markdown content or transcript
  duration: number // in minutes
  order: number
  isFree: boolean
  attachments?: { name: string; url: string }[]
  createdAt: string
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  progress: number // percentage 0-100
  completedLessons: string[] // IDs of completed lessons
  enrolledAt: string
  lastAccessedAt: string
}

export interface Review {
  id: string
  courseId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}
