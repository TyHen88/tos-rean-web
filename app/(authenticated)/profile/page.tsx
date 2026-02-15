"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { profileService, type DeviceSession } from "@/lib/api/profile"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL } from "@/lib/api-client"
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Chrome,
  Clock,
  Edit2,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Save,
  Shield,
  Smartphone,
  Sparkles,
  AlignLeft,
  User,
  X,
  Zap
} from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [showAddPassword, setShowAddPassword] = useState(false)
  const [devices, setDevices] = useState<DeviceSession[]>([])
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [securityScore, setSecurityScore] = useState(0)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [hasPassword, setHasPassword] = useState(true)
  const [isGoogleUser, setIsGoogleUser] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load profile, sessions and security score
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingProfile(true)
        setIsLoadingSessions(true)

        // Load profile
        const profileRes = await profileService.getProfile()
        const profile = profileRes.data
        setProfile(profile)
        setName(profile.name ?? "")
        setEmail(profile.email ?? "")
        setBio(profile.bio ?? "")
        setAvatar(profile.avatar ?? null)
        setHasPassword(profile.hasPassword)
        setIsGoogleUser(!!profile.firebaseUid)
        setIsLoadingProfile(false)

        // Load sessions
        const sessionsRes = await profileService.getSessions()
        setDevices(sessionsRes.data?.sessions || [])

        // Load security score
        const scoreRes = await profileService.getSecurityScore()
        setSecurityScore(scoreRes.data.score)
      } catch (error) {
        console.error('Failed to load profile data:', error)
        setMessageType("error")
        setMessage("Failed to load some profile data")
        setTimeout(() => setMessage(""), 3000)
      } finally {
        setIsLoadingProfile(false)
        setIsLoadingSessions(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0)
      return
    }
    let strength = 0
    if (newPassword.length >= 8) strength += 25
    if (newPassword.length >= 12) strength += 25
    if (/[A-Z]/.test(newPassword)) strength += 15
    if (/[a-z]/.test(newPassword)) strength += 15
    if (/[0-9]/.test(newPassword)) strength += 10
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 10
    setPasswordStrength(Math.min(strength, 100))
  }, [newPassword])

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile": return <Smartphone className="w-5 h-5" />
      case "tablet": return <Smartphone className="w-5 h-5" />
      default: return <Monitor className="w-5 h-5" />
    }
  }

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Active now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "oklch(0.577 0.245 27.325)"
    if (passwordStrength < 70) return "oklch(0.828 0.189 84.429)"
    return "oklch(0.6 0.118 184.704)"
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 70) return "Good"
    return "Strong"
  }

  const getSecurityScoreColor = () => {
    if (securityScore < 50) return "oklch(0.577 0.245 27.325)"
    if (securityScore < 80) return "oklch(0.828 0.189 84.429)"
    return "oklch(0.6 0.118 184.704)"
  }

  const getSecurityScoreLabel = () => {
    if (securityScore < 50) return "Needs Attention"
    if (securityScore < 80) return "Good"
    return "Excellent"
  }

  const getAvatarUrl = (path: string | null) => {
    if (!path) return null
    if (path.startsWith("http")) return path
    // Remove /api from the end of the base URL to get the server root
    const serverUrl = API_BASE_URL.replace(/\/api\/?$/, "")
    return `${serverUrl}${path.startsWith("/") ? "" : "/"}${path}`
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await profileService.updateProfile({ name, email, bio })
      setProfile(response.data)
      setIsEditingProfile(false)
      setMessageType("success")
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessageType("error")
      setMessage(error instanceof Error ? error.message : "Failed to update profile")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (hasPassword) {
        // Change existing password
        await profileService.changePassword({
          currentPassword,
          newPassword,
          confirmPassword
        })
      } else {
        // Add password for Google users
        await profileService.addPassword({
          newPassword,
          confirmPassword
        })
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowAddPassword(false)
      setShowChangePassword(false)
      setShowPassword(false)
      setMessageType("success")
      setMessage(hasPassword ? "Password changed successfully!" : "Password added successfully!")
      setHasPassword(true)

      // Update security score after password change
      const scoreRes = await profileService.getSecurityScore()
      setSecurityScore(scoreRes.data.score)

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessageType("error")
      setMessage(error instanceof Error ? error.message : "Failed to update password")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevokeDevice = async (deviceId: string) => {
    try {
      await profileService.revokeSession(deviceId)
      setDevices(devices.filter(d => d.id !== deviceId))
      setMessageType("success")
      setMessage("Device session revoked")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessageType("error")
      setMessage(error instanceof Error ? error.message : "Failed to revoke session")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Upload
    const formData = new FormData()
    formData.append("avatar", file)

    setIsUploadingAvatar(true)
    try {
      const response = await profileService.updateAvatar(formData)
      setAvatar(response.data.avatar)
      setMessageType("success")
      setMessage("Avatar updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessageType("error")
      setMessage(error instanceof Error ? error.message : "Failed to upload avatar")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Hero Header */}
        <div className="mb-8 relative">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Your Profile
              </h1>
              <p className="text-muted-foreground text-lg">Manage your account and preferences</p>
            </div>
            {/* Security Score Badge */}
            <div className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl bg-card/50 min-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Security Score</p>
                  <p className="text-2xl font-bold" style={{ color: getSecurityScoreColor() }}>
                    {securityScore}%
                  </p>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full transition-all duration-1000 ease-out rounded-full"
                  style={{
                    width: `${securityScore}%`,
                    backgroundColor: getSecurityScoreColor()
                  }}
                />
              </div>
              <p className="text-xs font-medium" style={{ color: getSecurityScoreColor() }}>
                {getSecurityScoreLabel()}
              </p>
            </div>
          </div>
        </div>

        {/* Global Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-200 backdrop-blur-xl ${messageType === "success"
              ? "bg-[oklch(0.6_0.118_184.704)]/10 border-[oklch(0.6_0.118_184.704)]/30 text-[oklch(0.4_0.118_184.704)]"
              : "bg-[oklch(0.577_0.245_27.325)]/10 border-[oklch(0.577_0.245_27.325)]/30 text-[oklch(0.577_0.245_27.325)]"
              }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Spans 1 column */}
          <div className="glass-card p-8 rounded-2xl border border-border/50 backdrop-blur-xl bg-card/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                <div
                  className="relative w-32 h-32 rounded-full ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  {isUploadingAvatar ? (
                    <div className="w-full h-full bg-background/50 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : avatar ? (
                    <img
                      src={getAvatarUrl(avatar) || ""}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center text-primary-foreground text-4xl font-bold">
                      {getInitials(name)}
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <h2 className="text-2xl font-bold mb-1">{profile?.name || user?.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{profile?.email || user?.email}</p>

              {profile?.createdAt && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-4 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
              {profile?.bio && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-muted-foreground text-sm mb-4 cursor-help line-clamp-2 max-w-[250px] mx-auto leading-relaxed">
                      {profile.bio}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[300px] text-center p-3 bg-card/90 backdrop-blur-xl border border-border/50 text-foreground shadow-2xl">
                    <p className="text-sm leading-relaxed">{profile.bio}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <Badge variant="secondary" className="capitalize font-medium px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {(profile?.role || user?.role || "STUDENT").toLowerCase()}
                </Badge>
                {isGoogleUser && (
                  <Badge variant="outline" className="gap-1.5 px-3 py-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Badge>
                )}
              </div>
              <form onSubmit={handleUpdateProfile} className="w-full space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name ?? ""}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={!isEditingProfile}
                      className="h-11 pl-10 bg-background/50 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email ?? ""}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={!isEditingProfile}
                      className="h-11 pl-10 bg-background/50 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="bio"
                      value={bio ?? ""}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditingProfile}
                      className="min-h-[100px] pl-10 pt-2.5 bg-background/50 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
                {!isEditingProfile ? (
                  <Button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="flex-1 h-12 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="h-12"
                      onClick={() => {
                        setIsEditingProfile(false)
                        setName(user?.name || "")
                        setEmail(user?.email || "")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Security Section - Spans 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auth Method */}
            <div className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl bg-card/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Authentication Method</h3>
                  <p className="text-sm text-muted-foreground">How you sign in</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-3">
                  {isGoogleUser ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">Google Sign-In</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Key className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Email & Password</p>
                        <p className="text-sm text-muted-foreground">Standard authentication</p>
                      </div>
                    </>
                  )}
                </div>
                <Badge className="gap-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </Badge>
              </div>
            </div>

            {/* Password Management */}
            <div className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl bg-card/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isGoogleUser && !hasPassword ? "Add Password" : "Change Password"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isGoogleUser && !hasPassword
                        ? "Enable backup authentication"
                        : "Keep your account secure"
                      }
                    </p>
                  </div>
                </div>
                {!showChangePassword && !showAddPassword && (
                  <Button
                    onClick={() => {
                      if (isGoogleUser && !hasPassword) {
                        setShowAddPassword(true)
                      } else {
                        setShowChangePassword(true)
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                  >
                    <Key className="w-4 h-4" />
                    {isGoogleUser && !hasPassword ? "Add" : "Change"}
                  </Button>
                )}
              </div>

              {(showChangePassword || showAddPassword) && (
                <form onSubmit={handleChangePassword} className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {hasPassword && (
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password" className="text-xs font-medium">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={currentPassword ?? ""}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="h-10 pl-9 pr-10 bg-background/50 backdrop-blur-sm text-sm"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-xs font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword ?? ""}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="h-10 pl-9 bg-background/50 backdrop-blur-sm text-sm"
                        placeholder="Create a strong password"
                      />
                    </div>
                    {newPassword && (
                      <div className="space-y-1.5 pt-1 p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Password strength</span>
                          <span
                            className="font-bold flex items-center gap-1"
                            style={{ color: getPasswordStrengthColor() }}
                          >
                            <Zap className="w-3 h-3" />
                            {getPasswordStrengthLabel()}
                          </span>
                        </div>
                        <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300 ease-out rounded-full relative overflow-hidden"
                            style={{
                              width: `${passwordStrength}%`,
                              backgroundColor: getPasswordStrengthColor()
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword ?? ""}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-10 pl-9 bg-background/50 backdrop-blur-sm text-sm"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          {hasPassword ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        <>
                          <Key className="w-3.5 h-3.5 mr-1.5" />
                          {hasPassword ? "Update" : "Add"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowChangePassword(false)
                        setShowAddPassword(false)
                        setCurrentPassword("")
                        setNewPassword("")
                        setConfirmPassword("")
                        setShowPassword(false)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Active Sessions */}
            <div className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl bg-card/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">{(devices || []).length} device{(devices || []).length !== 1 ? 's' : ''} signed in</p>
                </div>
              </div>
              <div className="space-y-3">
                {(devices || []).map((device, index) => (
                  <div
                    key={device.id}
                    className="group flex items-start justify-between p-4 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all duration-300"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-base">{device.deviceName}</p>
                          {device.isCurrent && (
                            <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Chrome className="w-4 h-4" />
                            <span>{device.browser}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{device.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{formatLastActive(device.lastActive)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!device.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeDevice(device.id)}
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .glass-card {
          position: relative;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, transparent, oklch(var(--primary) / 0.1), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
