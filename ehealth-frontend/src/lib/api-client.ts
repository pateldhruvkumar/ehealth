import axios from "axios";
import { API_URL } from "./constants";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  // The token will be injected by the hook that uses this client
  // or by a separate setup. For now, we'll assume the token is passed
  // via headers or we'll set it up in the components/hooks.
  // Actually, standard practice with Clerk is using `useAuth` hook to get token
  // and setting it in the Authorization header for each request.
  // Or we can set a default if we have a way to access the session globally (not easy in server components).
  //
  // For client-side requests, we can use a helper or hook wrapper.
  // Let's keep it simple: we'll attach the token in the service function call
  // or rely on a global state if we decide to store it (which Clerk manages).
  //
  // BETTER APPROACH:
  // We'll export a helper to set the token.
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login if needed)
      if (typeof window !== "undefined") {
        // window.location.href = "/login"; // Optional: Force redirect
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
