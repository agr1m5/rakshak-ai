import axios from "axios";

// Single source of truth for the backend base URL.
// Set VITE_API_URL in client/.env when the backend is running (Step 3+).
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (once auth exists, Step 5) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized response handling: normalize errors so components
// don't each need their own try/catch parsing logic.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear it. Redirect-to-login wiring
      // happens in AuthContext once Step 5 (JWT auth) is built.
      localStorage.removeItem("token");
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
