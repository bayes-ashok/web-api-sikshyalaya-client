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

export const updateProfile = async (updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/profile-update`,
      updatedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
    return response; // return the response object
  } catch (error) {
    throw error; // throw error if API call fails
  }
};