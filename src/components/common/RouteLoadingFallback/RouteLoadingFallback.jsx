import React, { useState, useEffect } from "react";
import logo from "@/assets/logo/logo.png";
import "./RouteLoadingFallback.css";

/**
 * Minimalist Apple-style route loading fallback.
 * Centered brand logo with a smooth filling progress bar.
 */
export function RouteLoadingFallback() {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(50), 120);
    const t2 = setTimeout(() => setProgress(80), 350);
    const t3 = setTimeout(() => setProgress(98), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="er-route-loading-stage" dir="rtl">
      <div className="er-route-loading-box">
        <img src={logo} alt="كُتّاب" className="er-route-loading-logo" />
        <div className="er-route-progress-track" dir="ltr">
          <div
            className="er-route-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default RouteLoadingFallback;
