import { decodeJwt } from "./authService";

let isRefreshing = false;
let refreshPromise = null;

const REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes
const CHECK_INTERVAL = 60 * 1000;        // every 1 minute

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

    // If not expiring soon → skip
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
    const newToken = data.data.token;

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
