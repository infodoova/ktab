import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";

/**
 * Route guard protecting pages requiring specific user roles.
 * Waits for HttpOnly cookie session initialization before evaluating permissions.
 *
 * @param {{ allowedRoles: string[], children?: React.ReactNode }} props
 */
import { isRoleAuthorized } from "../constants/roles";

export function RoleGuard({ allowedRoles = [], children }) {
  const navigate = useNavigate();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const validate = async () => {
      // If store is not initialized yet, verify session via HttpOnly cookies
      if (!useAuthStore.getState().isInitialized) {
        await tokenManager.initSession({ force: true });
      }

      const currentUser = useAuthStore.getState().user;
      const isAuth = useAuthStore.getState().isAuthenticated;

      if (!isAuth || !currentUser) {
        navigate("/login", { replace: true });
        return;
      }

      if (!isRoleAuthorized(currentUser.role, allowedRoles)) {
        navigate("/role-error", { replace: true });
        return;
      }
    };

    validate();
  }, [allowedRoles, navigate, isInitialized, isAuthenticated]);

  if (!isInitialized) return null;
  if (!isAuthenticated || !user) return null;
  if (!isRoleAuthorized(user.role, allowedRoles)) return null;

  return children || <Outlet />;
}

export default RoleGuard;

