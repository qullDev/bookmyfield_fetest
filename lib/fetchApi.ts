// Fallback API service using fetch for better CORS handling
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("access_token");

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  console.log("Fetch request:", endpoint, config);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log("Fetch response:", response.status, response.statusText);
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchApi = {
  async get(endpoint: string): Promise<any> {
    const response = await fetchWithAuth(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async put(endpoint: string, data: any): Promise<any> {
    const response = await fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint: string): Promise<void> {
    const response = await fetchWithAuth(endpoint, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  },
};
