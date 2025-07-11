// src/services/api.ts - COMPLETE FIXED VERSION
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      msg?: string;
    };
    status?: number;
  };
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    console.log("🌐 API Service initialized with baseURL:", baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log("📤 API Request:", {
      url,
      method: options.method || "GET",
      hasBody: !!options.body,
    });

    // Get token from localStorage
    const token = localStorage.getItem("token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log("📥 API Response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("📦 API Response data:", data);
      } catch {
        data = null;
      }

      if (!response.ok) {
        console.error("❌ API Error:", { status: response.status, data });
        const error: ApiError = {
          response: {
            data,
            status: response.status,
          },
          message: data?.error || data?.msg || response.statusText,
        };
        throw error;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      console.error("🚨 Network Error:", error);

      // Re-throw ApiError as-is, wrap other errors
      if ((error as ApiError).response) {
        throw error;
      }

      throw {
        message: (error as Error).message || "Network error",
        response: {
          status: 0,
          data: { error: "Network error" },
        },
      } as ApiError;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log("📤 POST Request to:", endpoint, "with data:", data);
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
const api = new ApiService(API_BASE_URL);
export default api;
