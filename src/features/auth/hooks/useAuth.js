import { useAuthStore } from "@/core/store/authStore";
import { useNavigate } from "react-router-dom";

/**
 * Hook providing current auth context, user profile, and session management.
 */
export function useAuth() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = (redirectTo = "/login") => {
    clearAuth();
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  return {
    token,
    user,
    role: user?.role || null,
    isAuthenticated,
    isLoading,
    setAuth,
    clearAuth,
    logout,
  };
}
