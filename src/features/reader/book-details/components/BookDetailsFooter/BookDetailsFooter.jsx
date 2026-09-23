import React from "react";
import { ArrowUp } from "lucide-react";
import "./BookDetailsFooter.css";

/**
 * Editorial minimalist one-line footer for the book details page.
 * Keeps reader view clean, focused, and free of multi-column landing clutter.
 */
export function BookDetailsFooter({ onScrollToTop, currentYear }) {
  return (
    <footer className="ktab-book-details-footer" dir="rtl">
      <div className="ktab-book-details-footer__inner">
        <p className="ktab-book-details-footer__copy">
          © {currentYear || new Date().getFullYear()} كُتّاب — جميع الحقوق محفوظة.
        </p>

        {onScrollToTop && (
          <button
            type="button"
            className="ktab-book-details-footer__top-btn"
            onClick={onScrollToTop}
            aria-label="العودة إلى أعلى الصفحة"
          >
            <span>العودة للأعلى</span>
            <ArrowUp size={14} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </footer>
  );
}
