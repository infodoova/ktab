import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { token, clearToken, isTokenExpired } from "../store/authToken";

export function useAuthGuard(redirectTo = "/") {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = token();

    if (!authToken || isTokenExpired()) {
      clearToken();         
      navigate(redirectTo);  
    }
  }, [navigate, redirectTo]);
}
