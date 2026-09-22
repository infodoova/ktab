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
  status = "PUBLISHED",
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
  // Guard: prevents IntersectionObserver from firing loadMore immediately on mount
  // before the user has scrolled. The observer fires as soon as it's attached if
  // the sentinel is within the rootMargin, which caused automatic page-1 loading.
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => { hasScrolledRef.current = true; };
    window.addEventListener("scroll", handleScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Automatic infinite scroll trigger on viewport intersection
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasScrolledRef.current &&
          !loading &&
          !loadingMore &&
          page + 1 < totalPages
        ) {
          onLoadMore?.();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, page, totalPages, onLoadMore]);


  if (loading) {
    return <BooksSkeleton count={8} />;
  }

  if (books.length === 0) {
    const isSearchOrFilter = Boolean((searchQuery && searchQuery.trim()) || isFiltered);

    const emptyTitle = isSearchOrFilter
      ? "لا توجد نتائج مطابقة"
      : status === "UNDER_REVIEW" || status === "PENDING_APPROVAL"
      ? "لا توجد كتب قيد المراجعة حالياً"
      : status === "DRAFT"
      ? "لا توجد مسودات محفوظة"
      : "لم تنشئ أي كتاب بعد";

    const emptyDesc = isSearchOrFilter
      ? searchQuery.trim()
        ? `لم نتمكن من العثور على أي كتاب يطابق «${searchQuery.trim()}».`
        : "لا توجد كتب ضمن هذا التصنيف حالياً."
      : status === "UNDER_REVIEW" || status === "PENDING_APPROVAL"
      ? "الكتب التي ترسلها للنشر ستظهر هنا أثناء مراجعتها وتدقيقها من قبل إدارة النشر."
      : status === "DRAFT"
      ? "يمكنك حفظ مسودات أعمالك أثناء الكتابة والعودة إليها في أي وقت."
      : "ابدأ بنشر أول كتاب رقمي وشاركه مع قراء المنصة بكل سهولة.";

    return (
      <div className="ktab-books-empty" dir="rtl">
        <h3 className="ktab-books-empty__title">{emptyTitle}</h3>
        <p className="ktab-books-empty__desc">{emptyDesc}</p>

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
          onCreateNew &&
          status !== "UNDER_REVIEW" &&
          status !== "PENDING_APPROVAL" && (
            <button
              type="button"
              onClick={onCreateNew}
              className="ktab-books-empty__action-btn"
            >
              {status === "DRAFT" ? "إنشاء مسودة جديدة" : "نشر أول كتاب"}
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
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            isMenuOpen={openMenuId === book.id}
            onToggleMenu={(id) => setOpenMenuId?.((prev) => (prev === id ? null : id))}
            onClick={onBookClick}
            onBookClick={onBookClick}
            onCardClick={onBookClick}
            onDelete={onDeleteClick}
            onDeleteClick={onDeleteClick}
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
