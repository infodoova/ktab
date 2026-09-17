import React, { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AuthorBookCard } from "../AuthorBookCard";
import { BooksSkeleton } from "../BooksSkeleton";
import "./AuthorBookGrid.css";

/**
 * Presentation grid for author books with IntersectionObserver infinite scroll.
 */
export function AuthorBookGrid({
  books = [],
  loading = false,
  loadingMore = false,
  page = 0,
  totalPages = 1,
  openMenuId,
  setOpenMenuId,
  onBookClick,
  onDeleteClick,
  onLoadMore,
  onCreateNew,
  searchQuery = "",
  onResetFilters,
  isFiltered = false,
}) {
  const sentinelRef = useRef(null);

  // Automatic infinite scroll trigger on viewport intersection
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && page + 1 < totalPages) {
          onLoadMore?.();
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, page, totalPages, onLoadMore]);

  if (loading) {
    return <BooksSkeleton count={8} />;
  }

  if (books.length === 0) {
    const isSearchOrFilter = Boolean((searchQuery && searchQuery.trim()) || isFiltered);

    return (
      <div className="ktab-books-empty" dir="rtl">
        <h3 className="ktab-books-empty__title">
          {isSearchOrFilter ? "لا توجد نتائج مطابقة" : "لم تنشئ أي كتاب بعد"}
        </h3>
        <p className="ktab-books-empty__desc">
          {isSearchOrFilter
            ? searchQuery.trim()
              ? `لم نتمكن من العثور على أي كتاب يطابق «${searchQuery.trim()}».`
              : "لا توجد كتب ضمن هذا التصنيف حالياً."
            : "ابدأ بنشر أول كتاب رقمي وشاركه مع قراء المنصة بكل سهولة."}
        </p>

        {isSearchOrFilter ? (
          onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ktab-books-empty__reset-btn"
            >
              إعادة ضبط التصفية
            </button>
          )
        ) : (
          onCreateNew && (
            <button
              type="button"
              onClick={onCreateNew}
              className="ktab-books-empty__action-btn"
            >
              نشر أول كتاب
            </button>
          )
        )}
      </div>
    );
  }

  return (
    <div className="ktab-books-container">
      <div className="ktab-books-grid">
        {books.map((book, index) => (
          <AuthorBookCard
            key={book.id || index}
            book={book}
            isMenuOpen={openMenuId === book.id}
            onToggleMenu={(id) => setOpenMenuId((prev) => (prev === id ? null : id))}
            onCardClick={onBookClick}
            onDelete={onDeleteClick}
          />
        ))}
      </div>

      {/* Infinite Scroll Sentinel & Subtle Spinner */}
      {page + 1 < totalPages && (
        <div ref={sentinelRef} className="ktab-books-infinite-sentinel">
          {loadingMore && (
            <div className="ktab-books-infinite-spinner">
              <Loader2 size={24} className="ktab-spinner" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthorBookGrid;
