import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures the browser viewport instantly resets to the top (0, 0)
 * on every route transition (e.g. clicking a book from library/home into details/preview).
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

export default ScrollToTop;
