import api from "./api";
import { Booking, CreateBookingRequest } from "@/types";

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    const response = await api.get("/bookings");
    return response.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get("/bookings/me");
    return response.data;
  },

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  async cancelBooking(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },
};
