import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import TokenRefreshWrapper from "../services/TokenRefreshWrapper";
// import { start as reactScanStart } from "react-scan";

// if (import.meta.env.DEV) {
//   reactScanStart({
//     log: true,
//     includeRenders: true,
//   });
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <TokenRefreshWrapper>
        <App />
      </TokenRefreshWrapper>
    </BrowserRouter>
  </StrictMode>
);
