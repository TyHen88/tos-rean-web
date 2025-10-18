export type UserRole = "admin" | "user"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface GymSchedule {
  id: string
  userId: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  exercises: string[]
  completed: boolean
  createdAt: string
}

export interface WorkoutVideo {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnail: string
  duration: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  createdBy: string
  createdAt: string
}

export interface FoodEntry {
  id: string
  userId: string
  name: string
  type: "food" | "drink"
  calories: number
  protein: number
  carbs: number
  fats: number
  date: string
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  createdAt: string
}

export interface TodoItem {
  id: string
  userId: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: string
  category: "workout" | "nutrition" | "general"
  createdAt: string
}

export interface ProgressEntry {
  id: string
  userId: string
  date: string
  weight?: number
  bodyFat?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    legs?: number
  }
  notes: string
  photos?: string[]
  createdAt: string
}
