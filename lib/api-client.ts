export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";

type ApiRequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export async function apiClient<T>(
  endpoint: string,
  { params, ...options }: ApiRequestOptions = {}
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("tosrean_token") : null;

  const headers = new Headers(options.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "An error occurred while fetching the data.");
    (error as any).status = response.status;
    throw error;
  }

  return data;
}
