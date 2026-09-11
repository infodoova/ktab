import React from "react";
import { AuthorBookCard } from "./AuthorBookCard";
import { BooksSkeleton } from "./BooksSkeleton";

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
}) {
  if (loading) {
    return <BooksSkeleton count={8} />;
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-16 border border-black/5 text-center space-y-3">
        <p className="text-slate-400 font-bold text-sm">
          لا توجد كتب مسجلة في هذا القسم حالياً.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <AuthorBookCard
            key={book.id}
            book={book}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onClick={() => onBookClick(book)}
            onDelete={() => onDeleteClick(book)}
          />
        ))}
      </div>

      {page + 1 < totalPages && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="btn-premium px-10 py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {loadingMore ? "جاري التحميل..." : "عرض المزيد من الكتب"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthorBookGrid;
