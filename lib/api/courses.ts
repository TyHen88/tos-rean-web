import { apiClient } from "../api-client";
import { Course, Lesson } from "../types";

export interface CoursesResponse {
  success: boolean;
  data: Course[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface CourseDetailResponse {
  success: boolean;
  data: Course;
}

export interface ListCoursesParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
}

export const coursesApi = {
  listCourses: (params: ListCoursesParams = {}) =>
    apiClient<CoursesResponse>("/courses", {
      method: "GET",
      params,
    }),

  getCourseDetails: (id: string) =>
    apiClient<CourseDetailResponse>(`/courses/${id}`, {
      method: "GET",
    }),

  createCourse: (data: Partial<Course>) =>
    apiClient<CourseDetailResponse>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCourse: (id: string, data: Partial<Course>) =>
    apiClient<CourseDetailResponse>(`/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  bulkSaveLessons: (courseId: string, lessons: Partial<Lesson>[]) =>
    apiClient<{ success: boolean }>(`/courses/${courseId}/lessons/bulk-save`, {
      method: "POST",
      body: JSON.stringify({ lessons }),
    }),

  listCategories: () =>
    apiClient<{ success: boolean; data: string[] }>("/categories", {
      method: "GET",
    }),
};
