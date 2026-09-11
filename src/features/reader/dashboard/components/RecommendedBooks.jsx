import React from "react";
import { Sparkles } from "lucide-react";
import { MinimalBookCard } from "../../library/components/BooksCard";

/**
 * Pure presentation component for Recommended Books section.
 * Renders only real books passed via props; returns null if empty.
 */
export function RecommendedBooks({
  books = [],
  openMenuId,
  setOpenMenuId,
  loading = false,
}) {
  if (!loading && (!books || books.length === 0)) {
    return null;
  }

  return (
    <section dir="rtl" className="w-full max-w-full py-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-6">
        <h2 className="text-xl font-black flex items-center gap-3 text-[var(--primary-text)] tracking-tight">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
            <Sparkles size={20} className="text-[var(--primary-button)]" />
          </div>
          موصى به لك
        </h2>
      </div>

      {/* Horizontal Scroll */}
      <div className="relative w-full">
        <div className="overflow-x-scroll overflow-y-hidden px-4 pb-4 no-scrollbar">
          <div className="flex gap-4 w-max">
            {books.map((book, i) => (
              <div key={book.id} className="w-44">
                <MinimalBookCard
                  book={book}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  index={i}
                  clickable={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecommendedBooks;
