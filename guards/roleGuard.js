import { useNavigate, useOutlet } from "react-router-dom";
import { useEffect } from "react";
import { getUserData, isTokenExpired } from "../store/authToken";

export default function RoleGuard({ allowedRoles = [] }) {
  const navigate = useNavigate();
  const outlet = useOutlet();

  // 1. Get data synchronously so we can block rendering immediately
  const user = getUserData();
  const tokenExpired = isTokenExpired();
  
  // 2. Determine validity
  const isAuthorized = user && !tokenExpired && allowedRoles.includes(user.role);
  const isLoginNeeded = !user || tokenExpired;

  useEffect(() => {
    if (isLoginNeeded) {
      if (tokenExpired) localStorage.removeItem("token"); // Clean up
      navigate("/Screens/auth/login", { replace: true });
    } else if (!isAuthorized) {
      // User exists but wrong role
      navigate("/Screens/roleError", { replace: true });
    }
  }, [isLoginNeeded, isAuthorized, navigate, tokenExpired]);

  // 3. Block rendering if not authorized (prevents flicker/data fetching)
  if (!isAuthorized) return null;

  return outlet;
}