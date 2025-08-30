"use client";

import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";
import toast from "react-hot-toast";

interface NavbarProps {
  userRole: "admin" | "user";
  userName?: string;
}

export default function Navbar({ userRole, userName }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      authService.clearTokens();
      toast.success("Logout berhasil");
      router.push("/");
    } catch {
      // Even if logout fails, clear tokens locally
      authService.clearTokens();
      router.push("/");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">🏟️ BookMyField</h1>
            <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {userRole === "admin" ? "👑 Admin" : "👤 User"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {userName && (
              <span className="text-sm text-gray-600">Hello, {userName}</span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
