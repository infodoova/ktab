import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { token, isTokenExpired } from "../store/authToken";

export function useRedirectIfAuthenticated(
  redirectTo = "/Userpages/index"
) {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = token();

    if (authToken && !isTokenExpired()) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);
}
