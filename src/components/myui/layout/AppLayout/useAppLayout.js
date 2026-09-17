import { useState, useEffect } from "react";

/**
 * Custom hook encapsulating sidebar collapse and theme state for AppLayout.
 */
export function useAppLayout({ isDark = false }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Sync class on body for theme styling if needed without hardcoding colors
    if (isDark) {
      document.body.classList.add("ktab-dark-theme");
    } else {
      document.body.classList.remove("ktab-dark-theme");
    }
    return () => {
      document.body.classList.remove("ktab-dark-theme");
    };
  }, [isDark]);

  return {
    collapsed,
    setCollapsed,
  };
}

export default useAppLayout;
