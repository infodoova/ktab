import React, { useEffect, useRef, useState } from "react";
import { MoreVertical, Share2, Loader2, BookOpen } from "lucide-react";
import SkeletonBookLoader from "./SkeletonBookLoader";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

/* -----------------------------------------------------------
   🔹 MINIMAL BOOK CARD 
----------------------------------------------------------- */
const MinimalBookCard = React.memo(({ book, openMenuId, setOpenMenuId, index }) => {
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
        console.log("Share dismissed",err);
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
          className="p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-[var(--earth-brown)] hover:bg-[var(--earth-cream)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--earth-brown)]"
        >
          <MoreVertical size={16} />
        </button>
        {isOpen && (
          <div
            className="absolute top-9 left-0 w-36 bg-white shadow-xl rounded-xl border border-[var(--earth-sand)]/50 p-1.5 text-sm z-30 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-[var(--earth-cream)] rounded-lg text-[var(--earth-brown)] transition-colors"
            >
              <span>مشاركة</span> <Share2 size={14} />
            </button>
          </div>
        )}
      </div>

      <Link
        to={`/Screens/dashboard/ReaderPages/BookDetails/${book.id}`}
        state={{ book }}
        className="flex flex-col gap-3 w-full"
        aria-label={`عرض تفاصيل كتاب ${book.title}`}
      >
        <div className="w-full relative rounded-xl overflow-hidden shadow-sm bg-gray-100 pb-[160%]">
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
          className="text-[var(--earth-brown-dark)] text-xs font-bold line-clamp-1 group-hover:text-[var(--earth-brown)] transition-colors"
          title={book.title}
        >
          {book.title}
        </h3>
      </Link>
    </div>
  );
});


/* -----------------------------------------------------------
   🔹 MAIN BOOK GRID 
----------------------------------------------------------- */
// Now receives 'activeFilters' from props instead of internal state
export default function BooksGrid({ fetchFunction, activeFilters }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const lastRef = useRef(null);

  /* FETCHING TRIGGERED BY FILTERS OR PAGE */
  useEffect(() => {
    const load = async () => {
      // Reset logic: if activeFilters changed, the parent should have reset 'page' 
      // but here we just react to the page/filter combo.
      
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      // Pass activeFilters to fetchFunction
      const res = await fetchFunction(page, activeFilters);

      setBooks((prev) =>
        page === 0 ? res.content : [...prev, ...res.content]
      );

      setTotalPages(res.totalPages || 1);

      if (page === 0) setLoading(false);
      else setLoadingMore(false);
    };

    load();
  }, [page, fetchFunction, activeFilters]);

  // When filters change externally, we must reset the list and page locally? 
  // Actually, standard practice is to let the Effect handle the fetch, 
  // but we need to ensure page is 0 when filters change.
  // We can do this with a separate useEffect just for filters:
  useEffect(() => {
    // Avoid synchronous setState in effect — schedule reset on next tick
    const id = setTimeout(() => setPage(0), 0);
    return () => clearTimeout(id);
  }, [activeFilters]);


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
    <div className="w-full min-h-screen bg-[var(--earth-cream)]">
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
          <div className="flex flex-col items-center justify-center py-20 text-[var(--earth-brown)]/50">
            <BookOpen size={48} strokeWidth={1} />
            <p className="mt-4 text-lg font-medium">
                {activeFilters?.query 
                 ? `لا توجد نتائج لـ "${activeFilters.query}"`
                 : "لا توجد كتب"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <MinimalBookCard
                key={book.id}
                book={book}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                index={books.indexOf(book)}
              />
            ))}
          </div>
        )}

        {/* SCROLL LOAD */}
        <div ref={lastRef} className="h-20 flex items-center justify-center mt-8">
          {loadingMore && (
            <Loader2
              size={24}
              className="animate-spin text-[var(--earth-brown)]/50"
            />
          )}
        </div>
      </div>
    </div>
  );
}