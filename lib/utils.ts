export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as {
      response?: {
        data?: {
          error?: string;
        };
      };
    };
    return apiError.response?.data?.error || "Terjadi kesalahan";
  }
  return "Terjadi kesalahan";
};
