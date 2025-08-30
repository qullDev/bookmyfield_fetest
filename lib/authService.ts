import api from "./api";
import { AuthRequest, LoginResponse } from "@/types";

export const authService = {
  async login(credentials: AuthRequest): Promise<LoginResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(userData: AuthRequest): Promise<void> {
    await api.post("/auth/register", userData);
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
