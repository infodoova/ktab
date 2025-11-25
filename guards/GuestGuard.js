import { useEffect } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import { getUserData, isTokenExpired } from "../store/authToken";

export default function GuestGuard() {
  const navigate = useNavigate();
  const outlet = useOutlet();
  
  const user = getUserData();
  const tokenExpired = isTokenExpired();
  const isAuthenticated = user && !tokenExpired;

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on role
      if (user.role === "AUTHOR") {
        navigate("/Screens/dashboard/AuthorPages/controlBoard", { replace: true });
      } else if (user.role === "READER") {
        navigate("/Screens/dashboard/ReaderPages/MainPage", { replace: true });
      } else {
        // Fallback for unknown roles
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // If authenticated, render nothing (wait for redirect)
  if (isAuthenticated) return null;

  // Otherwise, let them see the Login/Signup page
  return outlet;
}