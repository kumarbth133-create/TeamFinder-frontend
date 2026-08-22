import axios from "axios";

// Base URL - use deployed backend Vercel URL in production / build, or fallback to VITE_API_URL or proxy
const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://team-finder-backend.vercel.app/api"
    : "/api");

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("teamup_user") || "null");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor - handle 401 safely without reload loops
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("teamup_user");
      const authPaths = ["/login", "/register", "/forgot-password", "/admin/login"];
      if (!authPaths.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
