import { useState } from "react";
import { register, login } from "../api/auth";
import { toast } from "sonner";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleAuth = async (type, data) => {
    setLoading(true);

    try {
      let response;
      if (type === "signup") {
        response = await register(data);
      } else {
        response = await login(data);
      }

      if (response.status === 200 || response.status === 201) {
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          toast.success(`Welcome back ${response.data.user?.name || "User"}!`);
        } else {
          toast.success(response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} successful.`);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} failed.`);
      } else {
        toast.error("An error occurred, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleAuth, loading };
};
