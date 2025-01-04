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
    });
    return response;
  } catch (error) {
    throw error;
  }
};
