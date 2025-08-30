"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";
import { fieldService } from "@/lib/fieldService";
import { bookingService } from "@/lib/bookingService";
import { paymentService } from "@/lib/paymentService";
import { Field, Booking, CreateBookingRequest } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"fields" | "bookings">("fields");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [bookingForm, setBookingForm] = useState({
    start_time: "",
    end_time: "",
  });
  const [filters, setFilters] = useState({
    location: "",
    min_price: "",
    max_price: "",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fieldsData, bookingsData] = await Promise.all([
        fieldService.getAllFields(
          filters.location || filters.min_price || filters.max_price
            ? {
                location: filters.location || undefined,
                min_price: filters.min_price
                  ? Number(filters.min_price)
                  : undefined,
                max_price: filters.max_price
                  ? Number(filters.max_price)
                  : undefined,
              }
            : undefined
        ),
        bookingService.getMyBookings(),
      ]);
      setFields(fieldsData);
      setMyBookings(bookingsData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [filters.location, filters.min_price, filters.max_price]);

  useEffect(() => {
    // Check authentication and role
    if (!authService.isAuthenticated() || authService.getRole() !== "user") {
      router.push("/auth");
      return;
    }

    loadData();
  }, [router, loadData]);

  const handleBookField = (field: Field) => {
    setSelectedField(field);
    setShowBookingForm(true);
    setBookingForm({
      start_time: "",
      end_time: "",
    });
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField) return;

    try {
      const bookingData: CreateBookingRequest = {
        field_id: selectedField.id,
        start_time: new Date(bookingForm.start_time).toISOString(),
        end_time: new Date(bookingForm.end_time).toISOString(),
      };

      await bookingService.createBooking(bookingData);
      toast.success("Booking berhasil dibuat!");
      setShowBookingForm(false);
      setSelectedField(null);
      loadData();
    } catch (error: unknown) {
      console.error("Create booking error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handlePayment = async (booking: Booking) => {
    try {
      const { session_url } = await paymentService.createCheckoutSession(
        booking.id
      );
      window.open(session_url, "_blank");
    } catch (error: unknown) {
      console.error("Payment error:", error);
      toast.error("Gagal membuat sesi pembayaran");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Yakin ingin membatalkan booking ini?")) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success("Booking berhasil dibatalkan");
        loadData();
      } catch (error: unknown) {
        console.error("Cancel booking error:", error);
        toast.error("Gagal membatalkan booking");
      }
    }
  };

  const applyFilters = () => {
    loadData();
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      min_price: "",
      max_price: "",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="user" />
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="user" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard User</h1>
          <p className="text-gray-600 mt-2">
            Temukan dan booking lapangan favorit Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏟️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Lapangan Tersedia
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {fields.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Booking Saya
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myBookings.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Booking Aktif
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myBookings.filter((b) => b.status === "confirmed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("fields")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "fields"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Cari Lapangan
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Riwayat Booking
              </button>
            </nav>
          </div>
        </div>

        {/* Fields Tab */}
        {activeTab === "fields" && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filter Lapangan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Cari berdasarkan lokasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Harga Minimum
                  </label>
                  <input
                    type="number"
                    value={filters.min_price}
                    onChange={(e) =>
                      setFilters({ ...filters, min_price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Harga minimum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Harga Maksimum
                  </label>
                  <input
                    type="number"
                    value={filters.max_price}
                    onChange={(e) =>
                      setFilters({ ...filters, max_price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Harga maksimum"
                  />
                </div>

                <div className="flex items-end space-x-2">
                  <button
                    onClick={applyFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={clearFilters}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {field.name}
                      </h3>
                      <span className="text-2xl">🏟️</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        {field.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">💰</span>
                        {formatCurrency(field.price)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookField(field)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Book Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Riwayat Booking Saya
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lapangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Mulai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Selesai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.field?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.field?.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.start_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.end_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handlePayment(booking)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Bayar
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Batal
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Batal
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedField && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Book {selectedField.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedField.location} -{" "}
                  {formatCurrency(selectedField.price)}
                </p>
              </div>

              <form
                onSubmit={handleCreateBooking}
                className="px-6 py-4 space-y-4"
              >
                <div>
                  <label
                    className="block text-sm font-medium text-gray-900 mb-2"
                    htmlFor="start-time"
                  >
                    Waktu Mulai
                  </label>
                  <input
                    id="start-time"
                    type="datetime-local"
                    value={bookingForm.start_time}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        start_time: e.target.value,
                      })
                    }
                    required
                    min={getMinDateTime()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-900 mb-2"
                    htmlFor="end-time"
                  >
                    Waktu Selesai
                  </label>
                  <input
                    id="end-time"
                    type="datetime-local"
                    value={bookingForm.end_time}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        end_time: e.target.value,
                      })
                    }
                    required
                    min={bookingForm.start_time || getMinDateTime()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedField(null);
                    }}
                    className="px-4 py-2 text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Book Sekarang
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
