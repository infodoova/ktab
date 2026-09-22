import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getRoleDefaultRoute } from "../constants/roles";

/**
 * Route guard that redirects logged-in users away from guest-only pages (e.g. /login, /signup).
 * Waits for session initialization to ensure HttpOnly cookie state is known.
 * Allows access if switching accounts (?switch=true) or if user has no valid dedicated dashboard route.
 */
export function GuestGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isSwitchingAccount = new URLSearchParams(location.search).get("switch") === "true";

  useEffect(() => {
    if (isInitialized && isAuthenticated && user && !isSwitchingAccount) {
      const destination = getRoleDefaultRoute(user.role);
      // Only bounce away from guest routes if user actually has a valid dedicated dashboard
      if (destination && destination !== "/") {
        navigate(destination, { replace: true });
      }
    }
  }, [isInitialized, isAuthenticated, user, navigate, isSwitchingAccount]);

  if (!isInitialized) return null;

  // Block guest view rendering only if authenticated with a valid dashboard destination and not actively switching
  if (isAuthenticated && user && !isSwitchingAccount && getRoleDefaultRoute(user.role) !== "/") {
    return null;
  }

  return children || <Outlet />;
}

export default GuestGuard;
