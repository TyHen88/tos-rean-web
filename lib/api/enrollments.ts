import { apiClient } from "../api-client";
import { Course, Lesson } from "../types";

export interface MyLearningResponse {
  success: boolean;
  data: (Course & { progress: number })[];
}

export interface CourseContentResponse {
  success: boolean;
  data: {
    lessons: Lesson[];
    completedLessons: string[];
  };
}

export interface ProgressResponse {
  success: boolean;
  data: {
    progress: number;
  };
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    paymentUrl: string;
    payload: {
      hash: string;
      tran_id: string;
      amount: string;
      [key: string]: any;
    };
  };
}

export const enrollmentsApi = {
  getMyLearning: () =>
    apiClient<MyLearningResponse>("/enrollments/my-learning", {
      method: "GET",
    }),

  getCourseContent: (courseId: string) =>
    apiClient<CourseContentResponse>(`/enrollments/${courseId}/learn`, {
      method: "GET",
    }),

  updateProgress: (courseId: string, lessonId: string, completed: boolean) =>
    apiClient<ProgressResponse>(`/enrollments/${courseId}/progress`, {
      method: "POST",
      body: JSON.stringify({ lessonId, completed }),
    }),

  initiateCheckout: (courseId: string) =>
    apiClient<CheckoutResponse>("/enrollments/checkout", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    }),

  getCertificate: (courseId: string) =>
    apiClient<{ success: boolean; data: { url: string; issuedAt: string } }>(`/enrollments/${courseId}/certificate`, {
      method: "GET",
    }),
};
