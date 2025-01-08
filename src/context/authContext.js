import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Create the provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state to store user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // To check if the user is logged in
  const [loading, setLoading] = useState(true); // To handle the loading state while checking auth

  // Check if the user is authenticated when the app loads
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sikshyalaya/user/auth', { withCredentials: true });

      if (response.data.loggedIn) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log("Authenticated");
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Session expired or invalid token. Redirecting to login.");
        setIsAuthenticated(false);
        // Redirect to login
        window.location.href = '/login';
      } else {
        console.error("Error checking authentication:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Run checkAuthStatus when the component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Replace JSX with React.createElement calls
  return React.createElement(
    AuthContext.Provider,
    { value: { user, isAuthenticated, loading } },
    children
  );
};

export { AuthContext, AuthProvider };
