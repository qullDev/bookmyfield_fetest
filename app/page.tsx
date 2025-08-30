"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && authService.isAuthenticated()) {
      const role = authService.getRole();
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }
  }, [mounted, router]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🏟️ <span className="text-blue-600">BookMyField</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Platform booking lapangan olahraga yang mudah dan andal. Kelola
            booking lapangan dengan sistem yang terintegrasi penuh.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-3">Untuk Pengguna</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Lihat dan filter lapangan tersedia</li>
                <li>• Booking lapangan dengan mudah</li>
                <li>• Pembayaran terintegrasi Stripe</li>
                <li>• Kelola riwayat booking</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-semibold mb-3">Untuk Admin</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Kelola data lapangan (CRUD)</li>
                <li>• Monitor semua booking</li>
                <li>• Dashboard manajemen</li>
                <li>• Laporan pembayaran</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 w-full max-w-sm mx-auto block"
            >
              Mulai Sekarang
            </button>

            <div className="text-gray-500">
              <p className="text-sm">Demo Accounts:</p>
              <p className="text-xs">Admin: admin@admin.com / password123</p>
              <p className="text-xs">User: user@user.com / password123</p>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">🔐</div>
              <h4 className="font-semibold">Keamanan</h4>
              <p className="text-sm text-gray-600">
                JWT Authentication & Role-based Access
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💳</div>
              <h4 className="font-semibold">Pembayaran</h4>
              <p className="text-sm text-gray-600">
                Integrasi Stripe Payment Gateway
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold">Real-time</h4>
              <p className="text-sm text-gray-600">
                Booking dan pembayaran real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
