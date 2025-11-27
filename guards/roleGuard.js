import { useNavigate, useOutlet } from "react-router-dom";
import { useEffect } from "react";
import { getUserData, isTokenExpired } from "../store/authToken";

export default function RoleGuard({ allowedRoles = [] }) {
  const navigate = useNavigate();
  const outlet = useOutlet();

  const user = getUserData();
  const tokenExpired = isTokenExpired();
  
  const isAuthorized = user && !tokenExpired && allowedRoles.includes(user.role);
  const isLoginNeeded = !user || tokenExpired;

  useEffect(() => {
    if (isLoginNeeded) {
      if (tokenExpired) localStorage.removeItem("token"); 
      navigate("/Screens/auth/login", { replace: true });
    } else if (!isAuthorized) {
      navigate("/Screens/roleError", { replace: true });
    }
  }, [isLoginNeeded, isAuthorized, navigate, tokenExpired]);

  if (!isAuthorized) return null;

  return outlet;
}