import api from "./api";
import { AuthRequest, LoginResponse } from "@/types";

export const authService = {
  async login(credentials: AuthRequest): Promise<LoginResponse> {
    try {
      console.log("Attempting login with:", credentials);
      const response = await api.post("/auth/login", credentials);
      console.log("Login response received:", response);
      return response.data;
    } catch (error) {
      console.error("Login error with axios:", error);

      // Fallback to fetch API if axios fails
      console.log("Trying fallback with fetch API...");
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:8080/api/v1";
        const fetchResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!fetchResponse.ok) {
          throw new Error(
            `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
          );
        }

        const data = await fetchResponse.json();
        console.log("Fetch login successful:", data);
        return data;
      } catch (fetchError) {
        console.error("Fetch login also failed:", fetchError);
        throw fetchError;
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
