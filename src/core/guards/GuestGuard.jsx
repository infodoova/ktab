import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * Route guard that redirects logged-in users away from guest-only pages (e.g. /login, /signup).
 */
export function GuestGuard({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "AUTHOR") {
        navigate("/author/control", { replace: true });
      } else if (user.role === "READER") {
        navigate("/reader/home", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated) return null;

  return children || <Outlet />;
}

export default GuestGuard;
