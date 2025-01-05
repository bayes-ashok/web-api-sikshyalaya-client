import { useState } from "react";
import { register, login } from "../api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type, data) => {
    setLoading(true); // Show loading spinner
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

          // Show toast before navigation
          toast.success(`Welcome back ${response.data.user?.name || "User"}!`);
          console.log("check for toast");

          // Add a delay for the toast, then reload the page and navigate
          setTimeout(() => {
            // Trigger a re-render with state change or reloading
            navigate("/"); // Navigate after 1 second

            // Reload the page to reflect navbar changes, will change later
            window.location.reload();
          }, 1000); // Delay for toast and navigation

          setLoading(false); // End loading after showing toast
        } else {
          toast.success(response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} successful.`);
          setLoading(false);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} failed.`);
      } else {
        toast.error("An error occurred, please try again.");
      }
      setLoading(false);
    }
  };

  return { handleAuth, loading };
};
