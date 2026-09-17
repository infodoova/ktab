import React, { useState, useEffect } from "react";
import {
  MoreVertical,
  BookOpen,
  Headphones,
  CheckCircle,
  Clock,
  Trash2,
  Share2,
  Star,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { Link } from "react-router-dom";
import SkeletonBookLoader from "./SkeletonBookLoader";

const ITEMS_PER_PAGE = 8;

/* -----------------------------------------------------------
   🔹 BOOK COVER WITH PROGRESSIVE BLUR & EMPTY STATE
----------------------------------------------------------- */
function BookCoverImage({ src, title, isAboveFold }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <>
      {!loaded && !hasError && src && (
        <div className="absolute inset-0 bg-slate-100 overflow-hidden z-[1]">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{
              animation: "ktabCardShimmer 1.5s infinite cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </div>
      )}
      {!hasError && src ? (
        <img
          src={src}
          alt={`غلاف كتاب ${title || ""}`}
          loading={isAboveFold ? "eager" : "lazy"}
          fetchPriority={isAboveFold ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setHasError(true);
            setLoaded(false);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 will-change-transform ${
            loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 border border-black/5" aria-hidden="true">
          <img
            src={brandIconImg}
            alt=""
            className="w-14 h-14 object-contain grayscale opacity-65 select-none pointer-events-none"
          />
        </div>
      )}
    </>
  );
}

/* -----------------------------------------------------------
   🔹 MINIMAL BOOK CARD 
----------------------------------------------------------- */
export const MinimalBookCard = React.memo(
  ({ book, openMenuId, setOpenMenuId, index = 0, extraMenuItems, clickable = true }) => {
    const isOpen = openMenuId === book.id;
    const isAboveFold = index < 8;

    const toggleMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenMenuId?.(isOpen ? null : book.id);
    };

    const CardContent = (
      <>
        <div className="w-full relative rounded-xl overflow-hidden shadow-sm bg-gray-100 pb-[160%]">
          {/* Rating badge */}
          {book.averageRating !== undefined && book.averageRating !== null && (
            <div
              className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 shadow-sm text-sm font-black text-slate-900"
              aria-label={`تقييم ${book.averageRating} من 5`}
            >
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span>{Number(book.averageRating).toFixed(1)}</span>
            </div>
          )}

          <BookCoverImage
            src={book.coverImageUrl || book.cover}
            title={book.title}
            isAboveFold={isAboveFold}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none z-[2]" />
        </div>
        <h3
          className="text-slate-900 text-[15px] font-black tracking-tight line-clamp-1 group-hover:opacity-70 transition-opacity"
          title={book.title}
        >
          {book.title}
        </h3>
      </>
    );

    if (!extraMenuItems) {
      return (
        <div className="relative flex flex-col gap-3 group" dir="rtl">
          {clickable ? (
            <Link
              to={`/reader/BookDetails/${book.id}`}
              state={{ book }}
              className="flex flex-col gap-3 w-full"
              aria-label={`عرض تفاصيل كتاب ${book.title}`}
            >
              {CardContent}
            </Link>
          ) : (
            <div className="flex flex-col gap-3 w-full cursor-default">
              {CardContent}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative flex flex-col gap-3 group" dir="rtl">
        <div className="absolute top-2 left-2 z-20 book-menu-area">
          <button
            onClick={toggleMenu}
            aria-label="خيارات إضافية"
            aria-expanded={isOpen}
            className="p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-slate-800 border border-black/10 hover:bg-black/5 transition-colors focus:outline-none"
          >
            <MoreVertical size={16} />
          </button>
          {isOpen && (
            <div
              className="absolute top-9 left-0 w-36 bg-white/95 backdrop-blur-xl shadow-xl rounded-xl border border-black/10 p-1.5 text-sm z-30 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {extraMenuItems}
            </div>
          )}
        </div>

        {clickable ? (
          <Link
            to={`/reader/BookDetails/${book.id}`}
            state={{ book }}
            className="flex flex-col gap-3 w-full"
            aria-label={`عرض تفاصيل كتاب ${book.title}`}
          >
            {CardContent}
          </Link>
        ) : (
          <div className="flex flex-col gap-3 w-full cursor-default">
            {CardContent}
          </div>
        )}
      </div>
    );
  }
);

/* -----------------------------------------------------------
   🔹 MAIN BOOK GRID (Pure Presentation)
----------------------------------------------------------- */
export function BooksGrid({
  books = [],
  loading = false,
  loadingMore = false,
  page = 0,
  totalPages = 1,
  onLoadMore,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  // Click outside menu listener
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".book-menu-area")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonBookLoader key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <BookOpen size={64} strokeWidth={1} />
            <p className="mt-6 text-xl font-black tracking-tight text-slate-400 uppercase">
              لا توجد كتب مطابقة
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book, idx) => (
              <MinimalBookCard
                key={book.id}
                book={book}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                index={idx}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {page + 1 < totalPages && (
          <div className="flex justify-center pt-10">
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="btn-premium px-10 py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {loadingMore && <Loader2 size={16} className="animate-spin" />}
              <span>{loadingMore ? "جاري التحميل..." : "عرض المزيد من الكتب"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksGrid;
