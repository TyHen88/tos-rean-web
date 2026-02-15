"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string, role?: "admin" | "student" | "instructor") => Promise<boolean>
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

import { auth } from "@/lib/firebase"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { authApi } from "./api/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check local storage for immediate UI update
      const storedUser = localStorage.getItem("tosrean_user")
      const token = localStorage.getItem("tosrean_token")

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (e) {
          console.error("Failed to parse stored user", e)
        }
      }

      // 2. Validate token/session with backend
      if (token) {
        try {
          const response = await authApi.getMe()
          setUser(response.data)
          setIsAuthenticated(true)
          localStorage.setItem("tosrean_user", JSON.stringify(response.data))
        } catch (error) {
          console.error("Session expired or invalid:", error)
          localStorage.removeItem("tosrean_token")
          localStorage.removeItem("tosrean_user")
          setIsAuthenticated(false)
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const idToken = await userCredential.user.getIdToken(true)

      const response = await authApi.syncFirebaseUser(idToken)

      const { user: backendUser, token } = response.data
      setUser(backendUser)
      setIsAuthenticated(true)
      localStorage.setItem("tosrean_token", token)
      localStorage.setItem("tosrean_user", JSON.stringify(backendUser))
      return true
    } catch (error) {
      console.error("Google login failed:", error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Manual login - authenticate directly with backend database (NO Firebase)
      const response = await authApi.login(email, password)

      const { user, token } = response.data
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem("tosrean_token", token)
      localStorage.setItem("tosrean_user", JSON.stringify(user))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "admin" | "student" | "instructor" = "student",
  ): Promise<boolean> => {
    try {
      // Manual registration - create user directly in backend database (NO Firebase)
      const response = await authApi.register(email, password, name, role.toUpperCase())

      const { user, token } = response.data
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem("tosrean_token", token)
      localStorage.setItem("tosrean_user", JSON.stringify(user))
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("tosrean_user")
      localStorage.removeItem("tosrean_token")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const isAdmin = user?.role === "ADMIN" || user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated, isAdmin, loginWithGoogle, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
