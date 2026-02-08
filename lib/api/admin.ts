import { apiClient } from "../api-client";
import { User } from "../types";

export interface AdminStatsResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    mau: number;
    topCourses: { title: string; enrollments: number }[];
  };
}

export interface UserListResponse {
  success: boolean;
  data: User[];
}

export const adminApi = {
  getStats: () =>
    apiClient<AdminStatsResponse>("/admin/stats", {
      method: "GET",
    }),

  listUsers: () =>
    apiClient<UserListResponse>("/admin/users", {
      method: "GET",
    }),
};
