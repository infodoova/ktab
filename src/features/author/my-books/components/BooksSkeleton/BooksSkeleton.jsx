import React from "react";
import "../AuthorBookGrid/AuthorBookGrid.css";

/**
 * Editorial skeleton loader with staggered wave shimmer.
 */
export function BooksSkeleton({ count = 8 }) {
  return (
    <div className="ktab-books-grid" dir="rtl">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`book-skel-${i}`}
          className="ktab-book-skeleton"
          style={{ "--skel-idx": i }}
        >
          <div className="ktab-book-skeleton__cover">
            <div className="ktab-book-skeleton__badge-placeholder" />
            <div className="ktab-book-skeleton__footer-placeholder" />
          </div>
          <div className="ktab-book-skeleton__line ktab-book-skeleton__line--title" />
          <div className="ktab-book-skeleton__line ktab-book-skeleton__line--subtitle" />
        </div>
      ))}
    </div>
  );
}

export default BooksSkeleton;
