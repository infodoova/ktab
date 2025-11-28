import { useEffect } from "react";
import tokenManager from "./tokenManager";

export default function TokenRefreshWrapper({ children }) {
  useEffect(() => {
    tokenManager.refreshIfNeeded();
  }, []);

  return <>{children}</>;
}
