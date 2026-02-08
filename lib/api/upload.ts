import { apiClient } from "../api-client";

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
}

export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient<UploadResponse>("/upload", {
      method: "POST",
      body: formData,
    });
  },
};
