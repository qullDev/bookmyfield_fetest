import api from "./api";
import { AuthRequest, LoginResponse } from "@/types";

export const authService = {
  async login(credentials: AuthRequest): Promise<LoginResponse> {
    console.log("Attempting login with:", credentials);

    // Try fetch API first (better CORS handling)
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

      console.log("Using fetch API with URL:", `${API_BASE_URL}/auth/login`);

      const fetchResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("Fetch response status:", fetchResponse.status);
      console.log("Fetch response ok:", fetchResponse.ok);

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        console.error("Fetch error response:", errorText);
        throw new Error(
          `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
        );
      }

      const data = await fetchResponse.json();
      console.log("Fetch login successful:", data);
      return data;
    } catch (fetchError) {
      console.error("Fetch login failed:", fetchError);

      // Fallback to axios
      console.log("Trying fallback with axios...");
      try {
        const response = await api.post("/auth/login", credentials);
        console.log("Axios login successful:", response);
        return response.data;
      } catch (axiosError) {
        console.error("Axios login also failed:", axiosError);
        throw fetchError; // Throw the original fetch error
      }
    }
  },

  async register(userData: AuthRequest): Promise<void> {
    try {
      console.log("Attempting register with:", userData);
      await api.post("/auth/register", userData);
      console.log("Register successful");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refresh_token: refreshToken });
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  saveTokens(loginResponse: LoginResponse, role: string) {
    localStorage.setItem("access_token", loginResponse.access_token);
    localStorage.setItem("refresh_token", loginResponse.refresh_token);
    localStorage.setItem("user_role", role);
  },

  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
  },

  getRole(): string | null {
    return localStorage.getItem("user_role");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },
};
