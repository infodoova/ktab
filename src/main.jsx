import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import TokenRefreshWrapper from "../services/TokenRefreshWrapper";
import { registerSW } from "virtual:pwa-register";
import { ErrorBoundary } from "./components/common";

// Only register PWA service worker in production to avoid console spam in dev
if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
  });
} else if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  // In development, unregister any leftover service workers so workbox logs stop
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary variant="fullscreen">
      <BrowserRouter>
        <TokenRefreshWrapper>
          <App />
        </TokenRefreshWrapper>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

