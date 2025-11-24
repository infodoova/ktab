import React, { useRef, useEffect } from "react";
import { Eye, Star, BookOpen, Edit3, Users, ArrowLeft } from "lucide-react";
import LoaderCircle from "../../LoaderCircle";

function BooksList({ books, page, setPage, totalPages, loadingMore }) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-row-reverse items-center justify-between text-right">
        <SectionTitle title="كتبي" icon={<BookOpen className="w-5 h-5" />} />

        <button className="text-sm font-bold text-[var(--earth-brown)] hover:text-[var(--earth-olive)] px-4 py-2 rounded-full transition flex items-center gap-2">
          عرض الكل
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Books Grid/List */}
      {books && books.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-[var(--earth-brown)]/60">
          لا توجد كتب لعرضها حالياً
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        isLoadingMore={loadingMore}
      />
    </section>
  );
}

/* --- Helper Components --- */

function SectionTitle({ title, icon }) {
  return (
    <div className="flex flex-row-reverse items-center gap-2 text-[var(--earth-brown-dark)]">
      <span className="opacity-70">{icon}</span>
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
    </div>
  );
}

function BookCard({ book }) {
  const isPublished = book.published;

  const statusStyle = isPublished
    ? "bg-[#606C38]/10 text-[#606C38] border-[#606C38]/20"
    : "bg-[#5D4037]/10 text-[#5D4037] border-[#5D4037]/20";

  return (
    <div
      dir="rtl"
      className="group flex w-full bg-[var(--earth-paper)] border border-[var(--earth-sand)]/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[var(--earth-olive)]/30 transition-all duration-300"
    >
      {/* BOOK IMAGE – CLEAN FIT */}
      <div className="w-[100px] sm:w-[130px] shrink-0 flex items-center justify-center">
        <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col py-2 px-3 sm:p-4 min-w-0 justify-between">

        {/* TITLE + STATUS */}
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[var(--earth-brown-dark)] leading-snug line-clamp-2">
              {book.title}
            </h3>

            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium border ${statusStyle}`}
            >
              {isPublished ? "منشور" : "مسودة"}
            </span>
          </div>

          {/* STATS – MOBILE VISIBLE + CENTERED */}
          <div className="flex items-center justify-start gap-x-5 gap-y-2 mt-4 mb-1 text-[13px] sm:text-[15px] text-[var(--earth-brown)]/80">

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{book.rating || 0}</span>
            </div>

            <span className="w-px h-4 bg-[var(--earth-sand)]/60" />

            {/* Views */}
            <div className="flex items-center gap-1.5">
              <Eye className="w-5 h-5 opacity-70" />
              <span>{book.views?.toLocaleString() || 0}</span>
            </div>

            <span className="w-px h-4 bg-[var(--earth-sand)]/60" />

            {/* Reviews – Visible on mobile now */}
            <div className="flex items-center gap-1.5">
              <Users className="w-5 h-5 opacity-70" />
              <span>{book.reviewsCount || 0}</span>
            </div>
          </div>
        </div>

        {/* BUTTONS – PREMIUM STYLE */}
        <div className="flex gap-2 mt-3 pt-2 border-t border-[var(--earth-sand)]/30">

          {/* DETAILS */}
          <button className="
            flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2
            rounded-lg text-white text-[11px] sm:text-xs font-bold
            bg-[var(--earth-olive)] hover:bg-[var(--earth-olive-dark)]
            transition-colors duration-200 shadow-sm
          ">
            <BookOpen className="w-3.5 h-3.5" />
            <span>التفاصيل</span>
          </button>

          {/* EDIT */}
          <button className="
            flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2
            rounded-lg text-white text-[11px] sm:text-xs font-bold
            bg-[var(--earth-brown)] hover:bg-[var(--earth-brown-dark)]
            transition-colors duration-200 shadow-sm
          ">
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تعديل</span>
          </button>

        </div>
      </div>
    </div>
  );
}

function Pagination({ page, setPage, totalPages, isLoadingMore }) {
  const loaderRef = useRef(null);
  const canLoadMore = page < totalPages;

  useEffect(() => {
    if (!canLoadMore || !loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore) {
          setPage((prev) => (prev < totalPages ? prev + 1 : prev));
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [canLoadMore, isLoadingMore, setPage, totalPages]);

  return (
    <div ref={loaderRef} className="flex justify-center py-4">
      {canLoadMore && isLoadingMore && (
        <div className="flex items-center justify-center">
          <LoaderCircle />
        </div>
      )}
    </div>
  );
}

export default BooksList;
