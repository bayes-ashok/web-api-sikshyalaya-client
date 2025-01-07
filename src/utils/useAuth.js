import { useState } from "react";
import { register, login, getProfile, updateProfile } from "../api/auth"; // Ensure updateProfile is imported
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
        toast.success(`Welcome back ${response.data.user?.name || "User"}!`);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.success(response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} successful.`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `${type.charAt(0).toUpperCase() + type.slice(1)} failed.`);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data); // Store the user data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile.");
    }
  };

  // Handle profile updates
  const handleProfileUpdate = async (updatedData) => {
    setLoading(true);
    try {
      const response = await updateProfile(updatedData);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setUser(response.data);
    //     const navigate = useNavigate();
    // navigate('/profile');
      } else {
        toast.error(response.data.message || "Profile update failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return { handleAuth, fetchUserProfile, handleProfileUpdate, loading, user };
};
