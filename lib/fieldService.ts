import api from "./api";
import { Field, CreateFieldRequest } from "@/types";

export const fieldService = {
  async getAllFields(filters?: {
    location?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<Field[]> {
    const params = new URLSearchParams();
    if (filters?.location) params.append("location", filters.location);
    if (filters?.min_price)
      params.append("min_price", filters.min_price.toString());
    if (filters?.max_price)
      params.append("max_price", filters.max_price.toString());

    const response = await api.get(`/fields?${params.toString()}`);
    return response.data;
  },

  async getFieldById(id: string): Promise<Field> {
    const response = await api.get(`/fields/${id}`);
    return response.data;
  },

  async createField(fieldData: CreateFieldRequest): Promise<Field> {
    const response = await api.post("/fields/admin", fieldData);
    return response.data;
  },

  async updateField(id: string, fieldData: CreateFieldRequest): Promise<Field> {
    const response = await api.put(`/fields/admin/${id}`, fieldData);
    return response.data;
  },

  async deleteField(id: string): Promise<void> {
    await api.delete(`/fields/admin/${id}`);
  },
};
