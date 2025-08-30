export const getErrorMessage = (error: unknown): string => {
  console.log("Error details:", error);

  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as {
      response?: {
        status?: number;
        data?: {
          error?: string;
          message?: string;
        };
        statusText?: string;
      };
      message?: string;
      code?: string;
    };

    // Handle network errors (no response from server)
    if (!apiError.response) {
      console.log("Network error detected - no response");
      if (apiError.code === "ECONNABORTED") {
        return "Koneksi timeout. Server tidak merespons dalam waktu yang ditentukan.";
      }
      if (apiError.message?.includes("Network Error")) {
        return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }
      return "Koneksi ke server gagal. Silakan coba lagi.";
    }

    // If it's a successful response (200-299), don't treat as error
    if (
      apiError.response?.status &&
      apiError.response.status >= 200 &&
      apiError.response.status < 300
    ) {
      return "Operasi berhasil";
    }

    // Return specific error message if available
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }

    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }

    // Return status-based error messages
    if (apiError.response?.status) {
      switch (apiError.response.status) {
        case 400:
          return "Data yang dikirim tidak valid";
        case 401:
          return "Tidak terotorisasi. Silakan login kembali";
        case 403:
          return "Akses ditolak";
        case 404:
          return "Data tidak ditemukan";
        case 500:
          return "Error server internal";
        default:
          return `Error ${apiError.response.status}: ${
            apiError.response.statusText || "Terjadi kesalahan"
          }`;
      }
    }

    // Return generic error message if available
    if (apiError.message) {
      return apiError.message;
    }
  }

  // Handle network errors
  if (error && typeof error === "object" && "message" in error) {
    const networkError = error as { message: string };
    if (networkError.message.includes("Network Error")) {
      return "Koneksi ke server gagal";
    }
    return networkError.message;
  }

  return "Terjadi kesalahan yang tidak diketahui";
};
