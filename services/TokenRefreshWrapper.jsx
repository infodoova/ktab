import { useEffect } from "react";
import { decodeJwt, refreshAccessToken } from "./authService";

const CHECK_INTERVAL = 5 * 60 * 1000; // every 5 minutes
const MIN_REMAINING_TIME = 15 * 60 * 1000; // 15 mins before expiry

const TokenRefreshWrapper = ({ children }) => {
  useEffect(() => {
    const checkTokenHealth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = decodeJwt(token);
      if (!payload || !payload.exp) {
        localStorage.removeItem("token");
        window.location.href = "/Screens/auth/login";
        return;
      }

      const now = Date.now();
      const expiresAt = payload.exp * 1000;
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        // token expired, logout
        localStorage.removeItem("token");
        window.location.href = "/Screens/auth/login";
        return;
      }

      if (remaining < MIN_REMAINING_TIME) {
        await refreshAccessToken();
      }
    };

    checkTokenHealth();
    const intervalId = setInterval(checkTokenHealth, CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return <>{children}</>;
};

export default TokenRefreshWrapper;
