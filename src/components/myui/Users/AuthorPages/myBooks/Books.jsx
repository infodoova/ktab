import React, { useEffect, useRef, useState } from "react";
import {
  Star,
  Eye,
  MoreVertical,
  Share2,
  Edit,
  Trash,
  Loader2,
  BookOpen,
  Search,
} from "lucide-react";

import SkeletonBookLoader from "./SkeletonBookLoader";
import BookDetailsModal from "./BookDetailsModal";
import DeleteBook from "./DeleteBook";
import UpdateBookModal from "./UpdateBook";

const ITEMS_PER_PAGE = 8;

const MinimalBookCard = ({ book, onClick, onDelete, onEdit, openMenuId, setOpenMenuId }) => {
  const isOpen = openMenuId === book.id;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isOpen ? null : book.id);
  };

  const handleShare = async () => {
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
    <div className="relative group flex flex-col gap-3" dir="rtl">
      {/* MENU WRAPPER */}
      <div className="absolute top-2 left-2 z-20 book-menu-area">
        <button
          onClick={toggleMenu}
          className="p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow text-[var(--earth-brown)] hover:bg-[var(--earth-cream)]"
        >
          <MoreVertical size={16} />
        </button>

        {isOpen && (
          <div
            className="absolute top-8 left-0 w-40 bg-white shadow-lg rounded-xl border border-[var(--earth-sand)]/50 p-2 text-sm z-30 book-menu-area"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-between px-2 py-2 hover:bg-[var(--earth-cream)] rounded-lg text-[var(--earth-brown)]"
            >
              <span>مشاركة</span> <Share2 size={14} />
            </button>

            <button
              onClick={() => {
                onEdit(book);
                setOpenMenuId(null);
              }}
              className="w-full flex items-center justify-between px-2 py-2 hover:bg-[var(--earth-cream)] rounded-lg text-[var(--earth-brown)]"
            >
              <span>تعديل</span> <Edit size={14} />
            </button>

            <button
              onClick={() => {
                onDelete(book);
                setOpenMenuId(null);
              }}
              className="w-full flex items-center justify-between px-2 py-2 hover:bg-[var(--earth-cream)] rounded-lg text-red-600"
            >
              <span>حذف</span> <Trash size={14} />
            </button>
          </div>
        )}
      </div>

      {/* MAIN CARD CLICK */}
      <div onClick={() => onClick(book)} className="cursor-pointer">
        <div
          className="
          relative aspect-[2/3] w-full overflow-hidden rounded-[20px]
          bg-[var(--earth-sand)]/20 shadow-sm transition-all duration-500
          group-hover:shadow-xl group-hover:shadow-[var(--earth-sand)]/50
        "
        >
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--earth-sand)]">
              <BookOpen size={48} />
            </div>
          )}

          <div
            className="
            absolute top-3 right-3 flex items-center gap-1 rounded-full
            bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[var(--earth-brown)] shadow
            text-[14px]
          "
          >
            <Star size={14} className="fill-yellow-400" />
            {book.averageRating?.toFixed(1) ?? "0.0"}
          </div>

          <div
            className="
            absolute bottom-3 right-3 flex items-center gap-1 rounded-full
            bg-[var(--earth-brown)]/70 text-white px-2 py-1 text-[10px]
          "
          >
            <Eye size={10} /> {book.viewCount ?? 0}
          </div>
        </div>

        <div className="px-1 mt-2">
          <h3
            className="
            line-clamp-1 text-base font-semibold text-[var(--earth-brown)]
            group-hover:text-[var(--earth-olive)] transition
          "
          >
            {book.title}
          </h3>
          <p className="text-sm text-[var(--earth-brown)]/60 line-clamp-1">
            {book.genre || "عام"}
          </p>
        </div>
      </div>
    </div>
  );
};

/* MAIN BOOK PAGE*/

export default function Books({ fetchFunction }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [bookToDelete, setBookToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [bookToUpdate, setBookToUpdate] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null); // << FIXED HERE

  const lastRef = useRef(null);

  const filteredBooks = books.filter((b) =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* FETCHING */
  useEffect(() => {
    const load = async () => {
      page === 0 ? setLoading(true) : setLoadingMore(true);

      const res = await fetchFunction(page);

      setBooks((prev) =>
        page === 0 ? res.content : [...prev, ...res.content]
      );

      setTotalPages(res.totalPages || 1);
      page === 0 ? setLoading(false) : setLoadingMore(false);
    };

    load();
  }, [page, fetchFunction]);

  /* SCROLL LOAD */
 useEffect(() => {
  // Store the current ref value in a variable
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

  // Cleanup function
  return () => {
    if (currentLastRef) observer.unobserve(currentLastRef);
  };
}, [page, totalPages, loadingMore]);  

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
      <div
        className="
        sticky top-0 z-40 
        bg-[var(--earth-cream)]/80 backdrop-blur-xl 
        border-b border-[var(--earth-sand)]/40
      "
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-row items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="ابحث عن كتاب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-4 pr-10 py-2.5 
                bg-[var(--earth-sand)]/20 
                text-[var(--earth-brown)]
                border border-[var(--earth-sand)]/40
                rounded-xl text-sm outline-none text-right
                focus:bg-white focus:ring-2 focus:ring-[var(--earth-olive)]/30
              "
              dir="rtl"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--earth-brown)]/60"
            />
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonBookLoader key={i} />
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--earth-brown)]/50">
            <BookOpen size={48} strokeWidth={1} />
            <p className="mt-4 text-lg font-medium">لا توجد نتائج</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <MinimalBookCard
                key={book.id}
                book={book}
                onClick={setSelectedBook}
                onDelete={(b) => {
                  setBookToDelete(b);
                  setShowDeleteDialog(true);
                }}
                onEdit={(b) => {
                  setBookToUpdate(b);
                  setShowUpdateModal(true);
                }}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        <div ref={lastRef} className="h-20 flex items-center justify-center mt-8">
          {loadingMore && (
            <Loader2 size={24} className="animate-spin text-[var(--earth-brown)]/50" />
          )}
        </div>
      </div>

      <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />

      {showDeleteDialog && (
        <DeleteBook
          book={bookToDelete}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onDeleted={(id) => {
            setBooks((prev) => prev.filter((b) => b.id !== id));
            setShowDeleteDialog(false);
          }}
        />
      )}

      <UpdateBookModal
        open={showUpdateModal}
        book={bookToUpdate}
        onClose={() => setShowUpdateModal(false)}
        onUpdated={(updated) => {
          setBooks((prev) =>
            prev.map((b) => (b.id === updated.id ? updated : b))
          );
        }}
      />
    </div>
  );
}
