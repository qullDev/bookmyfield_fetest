export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export interface Field {
  id: string;
  name: string;
  location: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  field_id: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  updated_at: string;
  field?: Field;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  stripe_ref_id: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateFieldRequest {
  name: string;
  location: string;
  price: number;
}

export interface CreateBookingRequest {
  field_id: string;
  start_time: string;
  end_time: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}
