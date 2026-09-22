import { useAuthStore } from "@/core/store/authStore";
import { useNavigate } from "react-router-dom";

/**
 * Hook providing current auth context, user profile, and session management.
 */
export function useAuth() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const storeLogout = useAuthStore((state) => state.logout);

  const logout = async (redirectTo = "/login") => {
    try {
      await storeLogout();
    } finally {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    }
  };

  return {
    token,
    refreshToken,
    user,
    role: user?.role || null,
    isAuthenticated,
    isInitialized,
    isLoading,
    setAuth,
    clearAuth,
    logout,
  };
}

export default useAuth;

