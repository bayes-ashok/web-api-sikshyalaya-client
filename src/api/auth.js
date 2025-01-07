import axios from "axios";

const API_URL = "http://localhost:8000/api/sikshyalaya/user";

export const register = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure the cookie is included in the request and stored in the browser
    });
    return response;
  } catch (error) {
    throw error;
  }
};


export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};