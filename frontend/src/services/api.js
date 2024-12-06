// api.js
const API_BASE_URL = "http://localhost:5001/api";

// Helper function for handling API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: (credentials) =>
    apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  signup: (userData) =>
    apiCall("/users/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiCall("/users/profile"),

  updateProfile: (userData) =>
    apiCall("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

// Clinics APIs
export const clinicsAPI = {
  getClinics: async (city = "Gainesville") => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clinics?city=${encodeURIComponent(city)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch clinics");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch clinics:", error);
      throw error;
    }
  },

  getClinicDetails: async (clinicId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics/${clinicId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch clinic details");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch clinic details:", error);
      throw error;
    }
  },
};

const api = {
  authAPI,
  clinicsAPI,
};

export default api;
