import { useState } from "react";
import { register, login, getProfile } from "../api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate();

  const handleAuth = async (type, data) => {
    setLoading(true); // Show loading spinner
    try {
      let response;
      if (type === "signup") {
        response = await register(data); // Handle signup request
      } else {
        response = await login(data);  // Handle login request
      }
  
      if (response.status === 200 || response.status === 201) {
        // Check if the response contains user info and show success message
        toast.success(`Welcome back ${response.data.user?.name || "User"}!`);
  
        // Add a delay for the toast, then navigate
        setTimeout(() => {
          navigate("/"); // Navigate after 1 second
          // window.location.reload(); // Optional: to reload the page and reflect navbar changes
        }, 1000); // Delay for toast and navigation
      } else {
        toast.success(response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} successful.`);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} failed.`);
      } else {
        toast.error("An error occurred, please try again.");
      }
    } finally {
      setLoading(false); // End loading
    }
};

const fetchUserProfile = async () => {
  try {
    const response = await getProfile();

    setUser(response.data); // Store the user data
    console.log('Fetched user profile:', response.data); // Log the full response
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data || error.message);
  }
};

  
  return { handleAuth, fetchUserProfile, loading, user };
};
