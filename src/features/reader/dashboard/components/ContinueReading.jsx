import React from "react";
import { ArrowLeftCircle } from "lucide-react";

/**
 * Pure presentation component for Continue Reading list.
 * Only renders when active reading progress exists.
 */
export function ContinueReading({ books = [] }) {
  if (!books || books.length === 0) return null;

  return (
    <section dir="rtl">
      <h2 className="text-xl font-black mb-6 text-[var(--primary-text)] tracking-tight">
        متابعة القراءة
      </h2>

      <div className="space-y-3">
        {books.map((book, i) => {
          const percent = Math.round((book.progress / (book.total || 1)) * 100);

          return (
            <div
              key={book.id || i}
              className="bg-white p-4 sm:p-5 shadow-sm border border-[var(--primary-text)]/10 rounded-[1.5rem] flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 transition-all duration-300 hover:shadow-md group"
            >
              <div className="flex items-center gap-4 sm:gap-5 flex-1">
                <div className="relative shrink-0">
                  <img
                    src={book.cover || book.coverImageUrl}
                    alt={book.title}
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl shadow-sm border border-black/10 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col h-full justify-center">
                    <h3 className="text-[var(--primary-text)] font-black tracking-tight text-base sm:text-lg mb-0.5 truncate">
                      {book.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--primary-text)]/40 mb-3">
                      {book.author || book.authorName}
                    </p>

                    <div className="w-full bg-gray-100/50 h-2 sm:h-2.5 rounded-full overflow-hidden border border-black/[0.05] relative">
                      <div
                        className="bg-gradient-to-l from-[#5de3ba] to-[#76debf] h-full rounded-full shadow-[0_0_10px_rgba(93,227,186,0.3)] transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-tighter text-[var(--primary-text)]/40">
                        {book.progress} / {book.total || 0} صفحة
                      </p>
                      {book.lastSeen && (
                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-tighter text-[var(--primary-text)]/30">
                          {book.lastSeen}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn-premium flex items-center justify-center gap-2 px-6 py-4 sm:py-3.5 rounded-2xl sm:rounded-xl text-white text-xs sm:text-sm font-black uppercase tracking-widest active:scale-[0.98] transition-all w-full sm:w-auto shadow-lg shadow-[#5de3ba]/20">
                متابعة
                <ArrowLeftCircle size={18} strokeWidth={3} className="mr-1" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ContinueReading;
