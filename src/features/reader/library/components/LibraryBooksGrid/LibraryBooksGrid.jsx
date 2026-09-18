import React from "react";
import { BookOpen, RotateCcw } from "lucide-react";
import { LibraryBookCard } from "../LibraryBookCard";
import { useLibraryBooksGrid } from "./useLibraryBooksGrid";
import "./LibraryBooksGrid.css";

const SKELETON_ITEMS_COUNT = 10;

/**
 * Pure presentation grid rendering library books, skeleton loaders, and load more CTA.
 */
export function LibraryBooksGrid({
  books = [],
  loading = false,
  loadingMore = false,
  page = 0,
  totalPages = 1,
  onLoadMore,
  onResetFilters,
  hasActiveFilters = false,
  onBookClick,
}) {
  const { sentinelRef, canLoadMore } = useLibraryBooksGrid({
    page,
    totalPages,
    loading,
    loadingMore,
    onLoadMore,
  });

  return (
    <div className="ktab-lib-grid-wrap" dir="rtl">
      {loading ? (
        <div className="ktab-lib-grid" aria-label="جاري تحميل الكتب...">
          {Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, i) => (
            <div
              key={i}
              className="ktab-lib-skeleton"
              style={{ "--skel-idx": i }}
              aria-hidden="true"
            >
              <div className="ktab-lib-skeleton__cover" />
              <div className="ktab-lib-skeleton__line ktab-lib-skeleton__line--title" />
              <div className="ktab-lib-skeleton__line ktab-lib-skeleton__line--author" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="ktab-lib-empty">
          <div className="ktab-lib-empty__icon-wrap" aria-hidden="true">
            <BookOpen size={28} strokeWidth={1.8} />
          </div>
          <h3 className="ktab-lib-empty__title">لم يتم العثور على كتب</h3>
          <p className="ktab-lib-empty__desc">
            {hasActiveFilters
              ? "لا توجد كتب تطابق معايير البحث والفرز المحددة."
              : "لا توجد كتب متاحة في المكتبة حالياً."}
          </p>

          {hasActiveFilters && typeof onResetFilters === "function" && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ktab-lib-empty__action-btn"
            >
              <RotateCcw size={15} strokeWidth={2.4} />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          )}
        </div>
      ) : (
        <div className="ktab-lib-grid">
          {books.map((book, index) => (
            <LibraryBookCard
              key={book.id || book.bookId}
              book={book}
              index={index}
              onClick={onBookClick}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel (Monitored by IntersectionObserver) */}
      {canLoadMore && (
        <div
          ref={sentinelRef}
          className="ktab-lib-scroll-sentinel"
          aria-hidden="true"
        />
      )}

      {/* Subtle skeleton cards while loading the next page */}
      {loadingMore && (
        <div
          className="ktab-lib-grid ktab-lib-grid--loading-more"
          aria-label="جاري تحميل المزيد من الكتب..."
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`loading-more-${i}`}
              className="ktab-lib-skeleton"
              style={{ "--skel-idx": i }}
              aria-hidden="true"
            >
              <div className="ktab-lib-skeleton__cover" />
              <div className="ktab-lib-skeleton__line ktab-lib-skeleton__line--title" />
              <div className="ktab-lib-skeleton__line ktab-lib-skeleton__line--author" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LibraryBooksGrid;
