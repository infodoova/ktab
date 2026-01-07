import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import TokenRefreshWrapper from "../services/TokenRefreshWrapper";

import { registerSW } from "virtual:pwa-register";

// Register PWA service worker
// main.jsx
registerSW({
  immediate: true,
  onOfflineReady() {
    console.log("DEBUG: PWA is ready to work offline");
  },
  onNeedRefresh() {
    console.log("DEBUG: New version available");
  },
  onRegisteredSW(swUrl, registration) {
    console.log("DEBUG: Service Worker registered at:", swUrl);
    console.log("DEBUG: Scope:", registration.scope);
  },
  onRegisterError(error) {
    console.error("DEBUG: Service Worker registration failed:", error);
  },
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <TokenRefreshWrapper>
      <App />
    </TokenRefreshWrapper>
  </BrowserRouter>
  //  </StrictMode>
);
