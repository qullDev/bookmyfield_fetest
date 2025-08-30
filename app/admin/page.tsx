"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";
import { fieldService } from "@/lib/fieldService";
import { bookingService } from "@/lib/bookingService";
import { Field, Booking, CreateFieldRequest } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"fields" | "bookings">("fields");
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [fieldForm, setFieldForm] = useState<CreateFieldRequest>({
    name: "",
    location: "",
    price: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fieldsData, bookingsData] = await Promise.all([
        fieldService.getAllFields(),
        bookingService.getAllBookings(),
      ]);
      setFields(fieldsData);
      setBookings(bookingsData);
    } catch (error: unknown) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check authentication and role
    if (!authService.isAuthenticated() || authService.getRole() !== "admin") {
      router.push("/auth");
      return;
    }

    loadData();
  }, [router, loadData]);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingField) {
        await fieldService.updateField(editingField.id, fieldForm);
        toast.success("Lapangan berhasil diupdate");
      } else {
        await fieldService.createField(fieldForm);
        toast.success("Lapangan berhasil dibuat");
      }
      setShowFieldForm(false);
      setEditingField(null);
      setFieldForm({ name: "", location: "", price: 0 });
      loadData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEditField = (field: Field) => {
    setEditingField(field);
    setFieldForm({
      name: field.name,
      location: field.location,
      price: field.price,
    });
    setShowFieldForm(true);
  };

  const handleDeleteField = async (id: string) => {
    if (confirm("Yakin ingin menghapus lapangan ini?")) {
      try {
        await fieldService.deleteField(id);
        toast.success("Lapangan berhasil dihapus");
        loadData();
      } catch (error: unknown) {
        toast.error("Gagal menghapus lapangan");
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="admin" />
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Kelola lapangan dan monitor booking
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
                  Total Lapangan
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
                  Total Booking
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.length}
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
                  {bookings.filter((b) => b.status === "confirmed").length}
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
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Kelola Lapangan
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Monitor Booking
              </button>
            </nav>
          </div>
        </div>

        {/* Fields Tab */}
        {activeTab === "fields" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Lapangan
              </h2>
              <button
                onClick={() => setShowFieldForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                + Tambah Lapangan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Lapangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibuat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((field) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {field.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(field.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(field.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditField(field)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Booking
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
                      Dibuat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.field?.name || "N/A"}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Field Form Modal */}
        {showFieldForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingField ? "Edit Lapangan" : "Tambah Lapangan Baru"}
                </h3>
              </div>

              <form
                onSubmit={handleCreateField}
                className="px-6 py-4 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lapangan
                  </label>
                  <input
                    type="text"
                    value={fieldForm.name}
                    onChange={(e) =>
                      setFieldForm({ ...fieldForm, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Lapangan Futsal A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={fieldForm.location}
                    onChange={(e) =>
                      setFieldForm({ ...fieldForm, location: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Jakarta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga (IDR)
                  </label>
                  <input
                    type="number"
                    value={fieldForm.price}
                    onChange={(e) =>
                      setFieldForm({
                        ...fieldForm,
                        price: Number(e.target.value),
                      })
                    }
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: 200000"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFieldForm(false);
                      setEditingField(null);
                      setFieldForm({ name: "", location: "", price: 0 });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {editingField ? "Update" : "Simpan"}
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
