import { apiClient } from "../api-client";
import { User } from "../types";
import { ApiResponse } from "./types";

export type AuthResponse = ApiResponse<{
  user: User;
  token: string;
}>;

export type ProfileResponse = ApiResponse<User>;

export const authApi = {
  // Firebase Google Sign-In: Sync Firebase user with backend
  syncFirebaseUser: (idToken: string) =>
    apiClient<AuthResponse>("/auth/sync", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  // Manual Login: Authenticate with email/password (NO Firebase)
  login: (email: string, password: string) =>
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Manual Registration: Create new user with email/password (NO Firebase)
  register: (email: string, password: string, name: string, role: string = "STUDENT") =>
    apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, role }),
    }),

  getMe: () =>
    apiClient<ProfileResponse>("/auth/me", {
      method: "GET",
    }),
};
