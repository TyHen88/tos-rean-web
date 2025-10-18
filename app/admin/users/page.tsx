"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<(User & { password: string })[]>([])

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
    }
  }, [isAdmin, router])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const data = localStorage.getItem("gymmine_users")
    if (data) {
      const allUsers = JSON.parse(data)
      setUsers(allUsers)
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) {
      alert("You cannot delete your own account")
      return
    }

    if (confirm("Are you sure you want to delete this user?")) {
      const data = localStorage.getItem("gymmine_users")
      if (data) {
        const allUsers = JSON.parse(data)
        const updatedUsers = allUsers.filter((u: User) => u.id !== userId)
        localStorage.setItem("gymmine_users", JSON.stringify(updatedUsers))
        loadUsers()
      }
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground text-lg">View and manage all registered users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total users: {users.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{u.name}</h3>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={u.role === "admin" ? "default" : "secondary"} className="capitalize">
                    {u.role}
                  </Badge>
                  {u.id !== user?.id && (
                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(u.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
