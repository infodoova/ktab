import { decodeJwt } from "./authService";
import { isTokenExpired } from "../store/authToken";
let isRefreshing = false;
let refreshPromise = null;

const REFRESH_THRESHOLD = 15 * 60 * 1000; // 15 minutes or less to refresh
const CHECK_INTERVAL = 60 * 1000; // 1 min to check token if it will exp

class TokenManager {
  constructor() {
    this.startBackgroundChecker();
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isTokenExpiringSoon(token) {
    if (!token) return true;

    const payload = decodeJwt(token);
    if (!payload?.exp) return true;

    const expiresAt = payload.exp * 1000;
    const remaining = expiresAt - Date.now();

    return remaining < REFRESH_THRESHOLD; // < 10 minutes
  }

  async refreshIfNeeded() {
    const token = this.getToken();
    if (!token) return null;
    if (isTokenExpired(token)) {
      return console.log("token is expired");
    }
    if (!this.isTokenExpiringSoon(token)) return token;

    return await this.safeRefresh();
  }

  async safeRefresh() {
    if (isRefreshing) return refreshPromise;

    isRefreshing = true;

    refreshPromise = this.callRefreshAPI()
      .then((newToken) => {
        isRefreshing = false;
        return newToken;
      })
      .catch((err) => {
        isRefreshing = false;
        throw err;
      });

    return refreshPromise;
  }

  async callRefreshAPI() {
    const token = this.getToken();
    if (!token) throw new Error("No token found");

    // Attempt refresh even if the access token is expired.
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/Screens/auth/login";
      throw new Error("Refresh failed");
    }

    const data = await res.json();

    // Support multiple response shapes:
    // 1) plain string token: "ey..."
    // 2) { data: "ey..." }
    // 3) { data: { token: "ey..." } }
    // 4) { token: "ey..." }
    let newToken = null;
    if (typeof data === "string") {
      newToken = data;
    } else if (data && typeof data === "object") {
      if (typeof data.data === "string") newToken = data.data;
      else if (data.data && typeof data.data === "object" && data.data.token)
        newToken = data.data.token;
      else if (data.token) newToken = data.token;
      else if (data.data && data.data.accessToken)
        newToken = data.data.accessToken;
    }

    if (!newToken) {
      // Response didn't include a usable token — clear state and force login.
      localStorage.removeItem("token");
      window.location.href = "/Screens/auth/login";
      throw new Error("Refresh failed: no token in response");
    }

    localStorage.setItem("token", newToken);
    return newToken;
  }

  startBackgroundChecker() {
    setInterval(() => {
      this.refreshIfNeeded().catch(() => {});
    }, CHECK_INTERVAL);
  }
}

const tokenManager = new TokenManager();
export default tokenManager;
