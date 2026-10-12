import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/core/store/authStore";
import { tokenManager } from "@/core/services/tokenManager";
import { getRoleDefaultRoute } from "@/core/constants/roles";

/** Shared session restoration and destination selection for login and signup. */
export function useAuthSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const establishSession = useCallback(async (data) => {
    if (data) useAuthStore.getState().setAuth(data);
    // HttpOnly cookies cannot be read by JavaScript; refresh confirms the session.
    if (!useAuthStore.getState().token) await tokenManager.safeRefresh();
    const state = useAuthStore.getState();
    return Boolean(state.isAuthenticated && state.user);
  }, []);

  const navigateAfterAuth = useCallback((user) => {
    let savedRedirect = null;
    try {
      savedRedirect = sessionStorage.getItem("ktab_post_login_redirect");
      sessionStorage.removeItem("ktab_post_login_redirect");
    } catch {
      // Storage can be unavailable in private browsing.
    }

    const params = new URLSearchParams(location.search || window.location.search);
    const target = params.get("redirect") || savedRedirect || location?.state?.from;
    if (
      typeof target === "string" &&
      target.startsWith("/") &&
      !target.startsWith("//") &&
      !target.startsWith("/login") &&
      !target.startsWith("/signup")
    ) {
      navigate(target, { replace: true });
      return;
    }
    navigate(getRoleDefaultRoute(user?.role), { replace: true });
  }, [location.search, location.state, navigate]);

  return { establishSession, navigateAfterAuth };
}
