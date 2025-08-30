"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";
import { getErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        // Determine role based on email (demo purposes)
        const role = formData.email.includes("admin") ? "admin" : "user";
        authService.saveTokens(response, role);

        toast.success("Login berhasil!");

        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      } else {
        await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        toast.success("Registrasi berhasil! Silakan login.");
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (error: unknown) {
      console.error("Auth error caught:", error);
      console.error("Error type:", typeof error);
      console.error("Error stringify:", JSON.stringify(error, null, 2));

      // Check if it's actually an axios error
      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as {
          isAxiosError: boolean;
          response?: {
            status?: number;
            statusText?: string;
            data?: unknown;
            headers?: unknown;
          };
        };
        console.error("Axios error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers,
        });

        // If status is 2xx, don't show error
        if (
          axiosError.response?.status &&
          axiosError.response.status >= 200 &&
          axiosError.response.status < 300
        ) {
          console.log("Success response but caught in error handler");
          return; // Don't show error toast for successful responses
        }
      }

      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fillDemoData = (role: "admin" | "user") => {
    if (role === "admin") {
      setFormData({
        name: "",
        email: "admin@admin.com",
        password: "password123",
      });
    } else {
      setFormData({
        name: "",
        email: "user@user.com",
        password: "password123",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏟️ BookMyField
          </h1>
          <p className="text-black">
            {isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Masukkan email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Loading..." : isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>

        {isLogin && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-black text-center">Demo Accounts:</p>
            <div className="flex gap-2">
              <button
                onClick={() => fillDemoData("admin")}
                className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded text-xs hover:bg-purple-200 transition-colors"
              >
                👑 Login Admin
              </button>
              <button
                onClick={() => fillDemoData("user")}
                className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-xs hover:bg-green-200 transition-colors"
              >
                👤 Login User
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-black">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin ? "Daftar" : "Masuk"}
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-black hover:text-gray-900 text-sm"
          >
            ← Kembali ke beranda
          </button>
        </div>
      </div>
    </div>
  );
}
