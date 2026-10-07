import { useEffect } from "react";
import tokenManager from "./tokenManager";

export default function TokenRefreshWrapper({ children }) {
  useEffect(() => {
    tokenManager.initSession();
    const restoreOnForeground = () => {
      if (document.visibilityState === "visible") {
        tokenManager.refreshIfNeeded();
      }
    };
    document.addEventListener("visibilitychange", restoreOnForeground);
    window.addEventListener("pageshow", restoreOnForeground);
    return () => {
      document.removeEventListener("visibilitychange", restoreOnForeground);
      window.removeEventListener("pageshow", restoreOnForeground);
    };
  }, []);

  return <>{children}</>;
}
