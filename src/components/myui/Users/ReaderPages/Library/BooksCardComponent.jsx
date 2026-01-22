import React, { useEffect, useRef, useState, useMemo } from "react";
import { MoreVertical, Share2, Loader2, BookOpen, Star } from "lucide-react";
import SkeletonBookLoader from "./SkeletonBookLoader";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

/* -----------------------------------------------------------
   🔹 MINIMAL BOOK CARD 
----------------------------------------------------------- */
const MinimalBookCard = React.memo(
  ({ book, openMenuId, setOpenMenuId, index }) => {
    const isOpen = openMenuId === book.id;
    const isAboveFold = index < 8;

    const toggleMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenMenuId(isOpen ? null : book.id);
    };

    const handleShare = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (navigator.share) {
        try {
          await navigator.share({
            title: book.title,
            text: "اطّلع على هذا الكتاب",
            url: book.pdfDownloadUrl,
          });
        } catch (err) {
          console.log("Share dismissed", err);
        }
      } else {
        navigator.clipboard.writeText(book.pdfDownloadUrl);
        alert("تم نسخ رابط الكتاب");
      }
      setOpenMenuId(null);
    };

    return (
      <div className="relative flex flex-col gap-3 group" dir="rtl">
        <div className="absolute top-2 left-2 z-20 book-menu-area">
          <button
            onClick={toggleMenu}
            aria-label="خيارات إضافية"
            aria-expanded={isOpen}
            className="p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-[var(--primary-text)] border border-black/10 hover:bg-black/5 transition-colors focus:outline-none"
          >
            <MoreVertical size={16} />
          </button>
          {isOpen && (
            <div
              className="absolute top-9 left-0 w-36 bg-white/95 backdrop-blur-xl shadow-xl rounded-xl border border-black/10 p-1.5 text-sm z-30 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-black/5 rounded-lg text-[var(--primary-text)] transition-colors font-black uppercase tracking-tight"
              >
                <span>مشاركة</span> <Share2 size={14} />
              </button>
            </div>
          )}
        </div>

        <Link
          to={`/reader/BookDetails/${book.id}`}
          state={{ book }}
          className="flex flex-col gap-3 w-full"
          aria-label={`عرض تفاصيل كتاب ${book.title}`}
        >
          <div className="w-full relative rounded-xl overflow-hidden shadow-sm bg-gray-100 pb-[160%]">
            {/* Rating badge */}
            {book.averageRating !== undefined &&
              book.averageRating !== null && (
                <div
                  className="
                    absolute top-2 right-2 z-10
                    flex items-center gap-1
                    px-2.5 py-1
                    rounded-full
                    bg-white/90 backdrop-blur-md
                    border border-black/10
                    shadow-sm
                    text-[10px] font-black
                    text-[var(--primary-text)]
                  "
                  aria-label={`تقييم ${book.averageRating} من 5`}
                >
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span>{Number(book.averageRating).toFixed(1)}</span>
                </div>
              )}

            <img
              src={book.coverImageUrl}
              alt={`غلاف كتاب ${book.title}`}
              loading={isAboveFold ? "eager" : "lazy"}
              fetchPriority={isAboveFold ? "high" : "auto"}
              decoding="async"
              className="
              absolute inset-0 w-full h-full object-cover 
              transition-transform duration-500 ease-out
              group-hover:scale-105 will-change-transform
            "
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
          <h3
            className="text-[var(--primary-text)] text-[13px] font-black tracking-tight line-clamp-1 group-hover:opacity-70 transition-opacity"
            title={book.title}
          >
            {book.title}
          </h3>
        </Link>
      </div>
    );
  }
);

/* -----------------------------------------------------------
   🔹 MAIN BOOK GRID 
----------------------------------------------------------- */
export default function BooksGrid({
  fetchFunction,
  activeFilters,
  sortOptions,
}) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const lastRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      const res = await fetchFunction(page, activeFilters);

      const incoming = Array.isArray(res.content) ? res.content : [];

      // Helper to extract comparable field values
      const getFieldValue = (item, field) => {
        if (!item) return "";
        switch (field) {
          case "rating":
            return item.averageRating ?? item.rating ?? 0;
          case "date":
            return item.publishedYear ?? item.publishedDate ?? item.year ?? 0;
          case "title":
          default:
            return item.title ?? "";
        }
      };

      const compareItems = (a, b) => {
        const aVal = getFieldValue(a, sortOptions?.field ?? "title");
        const bVal = getFieldValue(b, sortOptions?.field ?? "title");
        const asc = sortOptions?.ascending ?? true;

        const bothNumbers =
          typeof aVal === "number" && typeof bVal === "number";
        if (bothNumbers) {
          return asc ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal);
        const bStr = String(bVal);
        const cmp = aStr.localeCompare(bStr, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return asc ? cmp : -cmp;
      };

      if (page === 0) {
        setBooks(() => [...incoming].sort(compareItems));
      } else {
        setBooks((prev) => [...prev, ...incoming].sort(compareItems));
      }

      setTotalPages(res.totalPages || 1);

      if (page === 0) setLoading(false);
      else setLoadingMore(false);
    };

    load();
  }, [page, fetchFunction, activeFilters, sortOptions]);

  useEffect(() => {
    const id = setTimeout(() => setPage(0), 0);
    return () => clearTimeout(id);
  }, [activeFilters, sortOptions]);

  // derive a sorted list for rendering to avoid calling setState inside effects
  const displayedBooks = useMemo(() => {
    if (!books || books.length === 0) return [];

    const getFieldValue = (item, field) => {
      if (!item) return "";
      switch (field) {
        case "rating":
          return item.averageRating ?? item.rating ?? 0;
        case "date":
          return item.publishedYear ?? item.publishedDate ?? item.year ?? 0;
        case "title":
        default:
          return item.title ?? "";
      }
    };

    const compareItems = (a, b) => {
      const aVal = getFieldValue(a, sortOptions?.field ?? "title");
      const bVal = getFieldValue(b, sortOptions?.field ?? "title");
      const asc = sortOptions?.ascending ?? true;

      const bothNumbers = typeof aVal === "number" && typeof bVal === "number";
      if (bothNumbers) {
        return asc ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      const cmp = aStr.localeCompare(bStr, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return asc ? cmp : -cmp;
    };

    return [...books].sort(compareItems);
  }, [books, sortOptions]);

  /* INFINITE SCROLL */
  useEffect(() => {
    const currentLastRef = lastRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          page + 1 < totalPages &&
          !loadingMore
        ) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.15 }
    );
    if (currentLastRef) observer.observe(currentLastRef);
    return () => {
      if (currentLastRef) observer.unobserve(currentLastRef);
    };
  }, [page, totalPages, loadingMore]);

  /* CLICK OUTSIDE MENU */
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
        {/* Note: Search Bar removed from here */}

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonBookLoader key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--primary-text)]/20">
            <BookOpen size={64} strokeWidth={1} />
            <p className="mt-6 text-xl font-black tracking-tight text-[var(--primary-text)]/40 uppercase">
              {activeFilters?.query
                ? `لا توجد نتائج لـ "${activeFilters.query}"`
                : "لا توجد كتب"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedBooks.map((book) => (
              <MinimalBookCard
                key={book.id}
                book={book}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                index={displayedBooks.indexOf(book)}
              />
            ))}
          </div>
        )}

        {/* SCROLL LOAD */}
        <div
          ref={lastRef}
          className="h-20 flex items-center justify-center mt-8"
        >
          {loadingMore && (
            <Loader2
              size={24}
              className="animate-spin text-[var(--primary-button)]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
