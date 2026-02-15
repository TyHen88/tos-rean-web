/**
 * Profile Settings API Service
 * 
 * This service implements all profile-related API calls as defined in
 * docs/PROFILE_SETTINGS_API_SPEC.md
 * 
 * Status: PRODUCTION (using real API)
 */

import { apiClient } from '../api-client'
import { ApiResponse } from './types'

// ============================================================================
// Types
// ============================================================================

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  avatar?: string | null
  bio?: string | null
  firebaseUid?: string | null
  hasPassword: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  name: string
  email: string
  bio?: string
}

export interface AddPasswordRequest {
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface DeviceSession {
  id: string
  deviceName: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  location: string
  ipAddress: string
  lastActive: string
  isCurrent: boolean
  createdAt: string
}

export interface SessionsResponse {
  sessions: DeviceSession[]
}

export interface SecurityScore {
  score: number
  level: 'Excellent' | 'Good' | 'Needs Attention'
  factors: {
    hasPassword: boolean
    hasGoogleAuth: boolean
    sessionCount: number
    emailVerified: boolean
  }
}

// ============================================================================
// API Service
// ============================================================================

export const profileService = {
  /**
   * Get current user profile
   * Endpoint: GET /api/user/profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient<ApiResponse<UserProfile>>('/user/profile', {
      method: 'GET'
    })
  },

  /**
   * Update user profile
   * Endpoint: PUT /api/user/profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient<ApiResponse<UserProfile>>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /**
   * Add password for Google users
   * Endpoint: POST /api/user/password/add
   */
  async addPassword(data: AddPasswordRequest): Promise<ApiResponse<{ message: string; hasPassword: boolean }>> {
    return apiClient<ApiResponse<{ message: string; hasPassword: boolean }>>('/user/password/add', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /**
   * Change password
   * Endpoint: PUT /api/user/password/change
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient<ApiResponse<{ message: string }>>('/user/password/change', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /**
   * Get active sessions
   * Endpoint: GET /api/user/sessions
   */
  async getSessions(): Promise<ApiResponse<SessionsResponse>> {
    return apiClient<ApiResponse<SessionsResponse>>('/user/sessions', {
      method: 'GET'
    })
  },

  /**
   * Revoke a session
   * Endpoint: DELETE /api/user/sessions/:sessionId
   */
  async revokeSession(sessionId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient<ApiResponse<{ message: string }>>(`/user/sessions/${sessionId}`, {
      method: 'DELETE'
    })
  },

  /**
   * Get security score
   * Endpoint: GET /api/user/security-score
   */
  async getSecurityScore(): Promise<ApiResponse<SecurityScore>> {
    return apiClient<ApiResponse<SecurityScore>>('/user/security-score', {
      method: 'GET'
    })
  },

  /**
   * Update avatar image
   * Endpoint: POST /api/user/profile/avatar
   */
  async updateAvatar(formData: FormData): Promise<ApiResponse<{ avatar: string }>> {
    return apiClient<ApiResponse<{ avatar: string }>>('/user/avatar', {
      method: 'POST',
      body: formData
    })
  }
}
