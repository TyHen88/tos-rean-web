import { apiClient } from "../api-client";
import { Review } from "../types";

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

export const reviewsApi = {
  listReviews: (courseId: string) =>
    apiClient<ReviewsResponse>(`/courses/${courseId}/reviews`, {
      method: "GET",
    }),

  submitReview: (courseId: string, rating: number, comment: string) =>
    apiClient<{ success: boolean; data: Review }>(`/courses/${courseId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    }),
};
