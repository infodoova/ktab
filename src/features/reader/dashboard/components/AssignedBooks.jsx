import React from "react";
import { BookPlus, X } from "lucide-react";
import { MinimalBookCard } from "../../library/components/BooksCard";

/**
 * Pure presentation component for Reader assigned/favorite books.
 */
export function AssignedBooks({
  books = [],
  loading = false,
  openMenuId,
  setOpenMenuId,
  onRemoveBook,
}) {
  return (
    <section dir="rtl" className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-4 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
          <BookPlus size={20} className="text-[var(--primary-button)]" />
        </div>
        <h2 className="text-xl font-black text-[var(--primary-text)] tracking-tight">
          المفضلة
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-[var(--primary-text)]/40 font-black uppercase tracking-widest text-sm py-10">
          جاري التحميل...
        </p>
      ) : books.length === 0 ? (
        <p className="text-center text-[var(--primary-text)]/40 font-black uppercase tracking-widest text-sm py-10">
          لا توجد كتب في مكتبتك حالياً.
        </p>
      ) : (
        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden px-4 pb-4 no-scrollbar">
            <div className="flex gap-4" style={{ width: "max-content" }}>
              {books.map((book, index) => (
                <div key={book.id} className="w-44">
                  <MinimalBookCard
                    book={book}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    index={index}
                    extraMenuItems={
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemoveBook(book.id);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors font-black uppercase tracking-tight"
                      >
                        <span>حذف</span> <X size={14} />
                      </button>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AssignedBooks;
