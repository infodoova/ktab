import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";
import { isJwtExpired } from "../services/jwtDecoder";

/**
 * Route guard protecting pages requiring specific user roles.
 *
 * @param {{ allowedRoles: string[], children?: React.ReactNode }} props
 */
export function RoleGuard({ allowedRoles = [], children }) {
  const navigate = useNavigate();
  // Prevent blank flicker if already authenticated with valid role in memory
  const [checking, setChecking] = useState(() => {
    const token = tokenManager.getToken();
    const user = useAuthStore.getState().user;
    if (!token || isJwtExpired(token)) return true;
    if (!user) return true;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return true;
    return false;
  });

  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      const token = tokenManager.getToken();

      if (!token || isJwtExpired(token)) {
        useAuthStore.getState().clearAuth();
        navigate("/login", { replace: true });
        return;
      }

      try {
        await tokenManager.refreshIfNeeded();

        const user = useAuthStore.getState().user;
        if (!user) {
          navigate("/login", { replace: true });
          return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          navigate("/role-error", { replace: true });
          return;
        }

        if (isMounted) {
          setChecking(false);
        }
      } catch {
        useAuthStore.getState().clearAuth();
        navigate("/login", { replace: true });
      }
    };

    validate();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles, navigate]);

  if (checking) return null;

  return children || <Outlet />;
}

export default RoleGuard;
