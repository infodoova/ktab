import React, { useEffect, useRef, useState } from "react";
import { MoreVertical, Share2, Loader2, BookOpen } from "lucide-react";
import SkeletonBookLoader from "./SkeletonBookLoader";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

/* -----------------------------------------------------------
   🔹 MINIMAL BOOK CARD  — with hover + click fix
----------------------------------------------------------- */
const MinimalBookCard = ({ book, openMenuId, setOpenMenuId, onCardClick }) => {
  const isOpen = openMenuId === book.id;

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setOpenMenuId(isOpen ? null : book.id);
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    if (navigator.share) {
      await navigator.share({
        title: book.title,
        text: "اطّلع على هذا الكتاب",
        url: book.pdfDownloadUrl,
      });
    } else {
      navigator.clipboard.writeText(book.pdfDownloadUrl);
      alert("تم نسخ رابط الكتاب");
    }

    setOpenMenuId(null);
  };

  return (
    <div
      className="relative flex flex-col gap-3 cursor-pointer"
      dir="rtl"
      onClick={onCardClick}
    >
      {/* MENU BUTTON */}
      <div
        className="absolute top-2 left-2 z-20 book-menu-area"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={toggleMenu}
          className="p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow text-[var(--earth-brown)] hover:bg-[var(--earth-cream)]"
        >
          <MoreVertical size={16} />
        </button>

        {/* MENU CONTENT */}
        {isOpen && (
          <div
            className="absolute top-8 left-0 w-40 bg-white shadow-lg rounded-xl border border-[var(--earth-sand)]/50 p-2 text-sm z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-between px-2 py-2 hover:bg-[var(--earth-cream)] rounded-lg text-[var(--earth-brown)]"
            >
              <span>مشاركة</span> <Share2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* COVER ONLY has hover effect */}
      <div className="w-full rounded-xl overflow-hidden shadow bg-white">
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="
            w-full h-full object-cover 
            transition-transform duration-300
            hover:scale-105
          "
          style={{ aspectRatio: "1 / 1.5" }}
        />
      </div>

      {/* Title */}
      <p className="text-[var(--earth-brown-dark)] text-sm font-semibold line-clamp-1">
        {book.title}
      </p>
    </div>
  );
};


/* -----------------------------------------------------------
   🔹 MAIN BOOK PAGE 
----------------------------------------------------------- */
export default function Books({ fetchFunction }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);

  const lastRef = useRef(null);

  /* FETCHING */
  useEffect(() => {
    const load = async () => {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      const res = await fetchFunction(page);

      setBooks((prev) =>
        page === 0 ? res.content : [...prev, ...res.content]
      );

      setTotalPages(res.totalPages || 1);

      if (page === 0) setLoading(false);
      else setLoadingMore(false);
    };

    load();
  }, [page, fetchFunction]);

  /* INFINITE SCROLL */
  useEffect(() => {
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

    if (lastRef.current) observer.observe(lastRef.current);
    return () =>
      lastRef.current && observer.unobserve(lastRef.current);
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
      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonBookLoader key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--earth-brown)]/50">
            <BookOpen size={48} strokeWidth={1} />
            <p className="mt-4 text-lg font-medium">لا توجد كتب</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <MinimalBookCard
                key={book.id}
                book={book}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                onCardClick={() => navigate(`/Screens/dashboard/ReaderPages/BookDetails/${book.id}`,{ state: { book } })}
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
