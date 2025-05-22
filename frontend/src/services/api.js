import axios from "axios";

// Create an axios instance with proper configuration
const api = axios.create({
  baseURL: "http://localhost:3001", // Explicitly set the backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Change to true if you need cookies
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default api;
