import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, logout as logoutApi } from "../api/session";
import { login as loginApi, register as registerApi } from "../api/auth";
import { toast } from "sonner";
import { SUCCESS_MESSAGES, ERROR_MESSAGES, ROUTES } from "../constants";

/**
 * Custom hook for authentication
 * Manages user session, login, logout, and registration
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Load user session on mount
  useEffect(() => {
    const session = getSession();
    if (session && session.user) {
      setUser(session.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        const response = await loginApi(email, password);

        if (response && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
          toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
          navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response?.data?.error || ERROR_MESSAGES.SERVER_ERROR);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Register function
  const register = useCallback(
    async (name, email, password, level, role) => {
      try {
        setLoading(true);
        const response = await registerApi(name, email, password, level, role);

        if (response && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
          toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
          navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error("Register error:", error);
        toast.error(error.response?.data?.error || ERROR_MESSAGES.SERVER_ERROR);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(() => {
    logoutApi();
    setUser(null);
    setIsAuthenticated(false);
    toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    navigate(ROUTES.AUTH);
  }, [navigate]);

  // Update user data
  const updateUser = useCallback((userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };
}
