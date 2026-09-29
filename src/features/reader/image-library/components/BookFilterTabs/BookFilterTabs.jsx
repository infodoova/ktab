import React, { useRef } from "react";
import { ChevronRight, ChevronLeft, Library } from "lucide-react";
import "./BookFilterTabs.css";

/**
 * Horizontal scrollable filter chips bar for switching between all books
 * or isolating generated images for a specific book.
 */
export function BookFilterTabs({
  booksList = [],
  selectedBookId = null,
  onSelectBook,
  totalCount = 0,
}) {
  const scrollRef = useRef(null);

  const handleScroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Strictly omit books that have 0 valid illustrations
  const validBooks = booksList.filter(
    (b) => (b.validCount ?? b.imageCount ?? 0) > 0
  );

  if (validBooks.length === 0) {
    return null;
  }

  const effectiveTotalCount =
    totalCount > 0
      ? totalCount
      : validBooks.reduce((acc, b) => acc + (b.validCount ?? b.imageCount ?? 0), 0);

  return (
    <div className="ktab-book-filter-tabs-wrapper" dir="rtl">
      <button
        type="button"
        className="ktab-book-filter-scroll-btn"
        onClick={() => handleScroll(180)}
        aria-label="تمرير إلى اليمين"
      >
        <ChevronRight size={16} />
      </button>

      <div className="ktab-book-filter-tabs-scroll" ref={scrollRef}>
        {/* All Books Chip */}
        <button
          type="button"
          className={`ktab-book-filter-chip ${
            selectedBookId === null ? "ktab-book-filter-chip--active" : ""
          }`}
          onClick={() => onSelectBook(null)}
        >
          <Library size={14} className="ktab-book-filter-chip__icon" />
          <span className="ktab-book-filter-chip__label">كل الكتب</span>
          {effectiveTotalCount > 0 && (
            <span className="ktab-book-filter-chip__count">{effectiveTotalCount}</span>
          )}
        </button>

        {/* Dynamic Book Chips - only books with validCount > 0 */}
        {validBooks.map((book) => {
          const count = book.validCount ?? book.imageCount ?? 0;
          const isSelected = selectedBookId === book.bookId;
          return (
            <button
              key={book.bookId}
              type="button"
              className={`ktab-book-filter-chip ${
                isSelected ? "ktab-book-filter-chip--active" : ""
              }`}
              onClick={() => onSelectBook(book.bookId)}
              title={book.bookTitle}
            >
              <span className="ktab-book-filter-chip__label">{book.bookTitle}</span>
              {count > 0 && (
                <span className="ktab-book-filter-chip__count">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="ktab-book-filter-scroll-btn"
        onClick={() => handleScroll(-180)}
        aria-label="تمرير إلى اليسار"
      >
        <ChevronLeft size={16} />
      </button>
    </div>
  );
}

export default BookFilterTabs;
