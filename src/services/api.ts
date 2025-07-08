import axios from "axios";

// Environment-based API URL configuration
const getApiBaseUrl = () => {
  // Check if we have a custom API URL from environment variables
  if (import.meta.env.VITE_API_URL) {
    console.log("Using VITE_API_URL:", import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }

  // Production fallback - YOUR NEW RENDER URL
  if (import.meta.env.PROD) {
    console.log("Using production fallback: Render URL");
    return "https://nextcut-backend-v2.onrender.com";
  }

  // Development fallback
  console.log("Using development fallback: localhost");
  return "http://localhost:3000";
};

const API_BASE_URL = getApiBaseUrl();

console.log("🚀 API Base URL:", API_BASE_URL); // For debugging

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout for production
  withCredentials: false, // Set to true if you need cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request logging in development
    if (import.meta.env.DEV) {
      console.log(
        `Making ${config.method?.toUpperCase()} request to:`,
        `${API_BASE_URL}${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ Response from ${response.config.url}:`, response.status);
    }
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    console.error("❌ Request URL was:", error.config?.url);
    console.error("❌ Full URL was:", `${API_BASE_URL}${error.config?.url}`);

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("barber");
      localStorage.removeItem("role");

      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
