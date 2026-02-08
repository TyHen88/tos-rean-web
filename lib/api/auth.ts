import { apiClient } from "../api-client";
import { User } from "../types";

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export const authApi = {
  syncFirebaseUser: (idToken: string) =>
    apiClient<AuthResponse>("/auth/sync", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  login: (email: string, idToken: string) =>
    apiClient<AuthResponse>("/auth/sync", {
      method: "POST",
      body: JSON.stringify({ email, idToken }),
    }),

  register: (email: string, name: string, idToken: string, role: string = "STUDENT") =>
    apiClient<AuthResponse>("/auth/sync", {
      method: "POST",
      body: JSON.stringify({ email, name, idToken, role }),
    }),

  getMe: () =>
    apiClient<ProfileResponse>("/auth/me", {
      method: "GET",
    }),
};
