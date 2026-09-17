import React, { useEffect, useState } from "react";
import "./TopLoadingBar.css";

/**
 * Ultra-slim top progress bar for page and route transitions.
 */
export function TopLoadingBar() {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(45), 100);
    const t2 = setTimeout(() => setProgress(75), 300);
    const t3 = setTimeout(() => setProgress(90), 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="ktab-top-loader" role="progressbar" aria-label="جاري تحميل الصفحة...">
      <div
        className="ktab-top-loader__bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default TopLoadingBar;
