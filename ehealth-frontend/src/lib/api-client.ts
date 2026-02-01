import axios from "axios";
import { API_URL, AUTH_TOKEN_KEY } from "./constants";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Only redirect if we are not already on the login page
        if (!window.location.pathname.startsWith("/auth/login") && !window.location.pathname.startsWith("/auth/register")) {
             // Optional: Redirect to login or just clear token
             localStorage.removeItem(AUTH_TOKEN_KEY);
             // window.location.href = "/auth/login"; 
        }
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);
