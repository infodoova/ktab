import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMobilePageNav } from "../../hooks/useMobilePageNav";
import "./MobilePageNav.css";

/**
 * Mobile Bottom Page Navigation Bar.
 * - Right Button: Next Page (+1) / التالية with right chevron
 * - Left Button: Previous Page (-1) / السابقة with left chevron
 * Active whenever the reader is not in screen lock mode.
 */
export function MobilePageNav(props) {
  const { theme = "pure-white" } = props;
  const {
    isVisible,
    currentPage,
    isAtStart,
    isAtEnd,
    handlePrev,
    handleNext,
    handlePageClick,
  } = useMobilePageNav(props);

  if (!isVisible) return null;

  return (
    <nav
      className={`ktab-mobile-page-nav ktab-mobile-page-nav--${theme}`}
      aria-label="التنقل بين الصفحات على الهاتف"
      dir="rtl"
    >
      <div className="ktab-mobile-page-nav__container">
        {/* 1. Right Button: Next Page (+1) / التالية */}
        <button
          type="button"
          className={`ktab-mobile-nav-btn ktab-mobile-nav-btn--next ${
            isAtEnd ? "ktab-mobile-nav-btn--dimmed" : ""
          }`}
          onClick={handleNext}
          aria-label="الانتقال إلى الصفحة التالية (+1)"
          title="الصفحة التالية"
        >
          <ChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
          <span className="ktab-mobile-nav-btn__label">التالية</span>
        </button>

        {/* Center: Live Page Number Circle Badge */}
        <button
          type="button"
          className="ktab-mobile-nav-page-circle"
          onClick={handlePageClick}
          aria-label={`الصفحة ${currentPage}`}
          title="الانتقال لصفحة محددة"
        >
          <span className="ktab-mobile-nav-page-num">{currentPage}</span>
        </button>

        {/* 2. Left Button: Previous Page (-1) / السابقة */}
        <button
          type="button"
          className={`ktab-mobile-nav-btn ktab-mobile-nav-btn--prev ${
            isAtStart ? "ktab-mobile-nav-btn--dimmed" : ""
          }`}
          onClick={handlePrev}
          aria-label="الانتقال إلى الصفحة السابقة (-1)"
          title="الصفحة السابقة"
        >
          <span className="ktab-mobile-nav-btn__label">السابقة</span>
          <ChevronLeft size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

export default MobilePageNav;
