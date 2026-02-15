export type UserRole = "ADMIN" | "STUDENT" | "INSTRUCTOR" | "admin" | "student" | "instructor"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  bio?: string
  firebaseUid?: string | null
  hasPassword?: boolean
  createdAt: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  instructorId: string
  instructorName: string
  price: number | string // Can be "0" or number
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS" | "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  category: string
  tags: string[]
  duration: string
  lessonsCount?: number // Optional, can be computed from lessons array
  studentsCount?: number // Optional, mapped from enrollmentCount
  enrollmentCount?: number // From API
  rating?: number // Optional, mapped from averageRating
  averageRating?: string | number // From API
  totalRatings?: number // From API
  videoUrl?: string // Promo video
  content?: string // Markdown description
  status: "draft" | "published" | "archived" | "DRAFT" | "PUBLISHED" | "ARCHIVED"
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  slug: string
  description: string
  videoUrl?: string
  videoProvider?: string // e.g., "youtube", "vimeo"
  content?: string // Markdown content or transcript
  duration: number // in minutes (can also be in seconds from API)
  order: number
  isFree: boolean
  isPublished?: boolean
  attachments?: { name: string; url: string }[] | null
  createdAt: string
  updatedAt: string
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
