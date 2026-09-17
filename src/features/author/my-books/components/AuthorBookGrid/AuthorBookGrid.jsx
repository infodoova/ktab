import React from "react";
import { AuthorBookCard } from "../AuthorBookCard";
import { BooksSkeleton } from "../BooksSkeleton";
import "./AuthorBookGrid.css";

/**
 * Pure presentation AuthorBookGrid component matching Interactive Stories layout.
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
              : "لا توجد كتب ضمن التصنيف المحدد حالياً."
            : "ابدأ بنشر أول كتاب لك وصياغة الفصول والصفحات لجمهورك."}
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
              نشر كتاب جديد
            </button>
          )
        )}
      </div>
    );
  }

  return (
    <div className="ktab-books-container" dir="rtl">
      <div className="ktab-books-grid">
        {books.map((book) => (
          <AuthorBookCard
            key={book.id}
            book={book}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onClick={onBookClick}
            onDelete={onDeleteClick}
          />
        ))}
      </div>

      {page + 1 < totalPages && (
        <div className="ktab-books-load-more">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="ktab-books-load-more__btn"
          >
            {loadingMore ? "جاري التحميل..." : "عرض المزيد من الكتب"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthorBookGrid;
