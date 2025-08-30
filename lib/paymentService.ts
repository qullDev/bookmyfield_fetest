import api from "./api";

export const paymentService = {
  async createCheckoutSession(bookingId: string): Promise<{
    session_id: string;
    session_url: string;
  }> {
    const response = await api.post("/payments/create-checkout-session/", {
      booking_id: bookingId,
    });
    return response.data;
  },
};
