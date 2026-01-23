import React, { useEffect, useRef, useState } from "react";
import {
  Star,
  UserStar,
  MoreVertical,
  Trash,
  Loader2,
  BookOpen,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SkeletonBookLoader from "./SkeletonBookLoader";
import BookDetailsModal from "./BookDetailsModal";
import DeleteBook from "./DeleteBook";

const ITEMS_PER_PAGE = 8;

const MinimalBookCard = ({
  book,
  onClick,
  onDelete,
  openMenuId,
  setOpenMenuId,
}) => {
  const navigate = useNavigate();
  const isOpen = openMenuId === book.id;
  const isDraft = book.status === "DRAFT";

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isOpen ? null : book.id);
  };


  return (
    <div className="relative group flex flex-col gap-3" dir="rtl">
      {/* MENU WRAPPER */}
      <div className="absolute top-2 left-2 z-20 book-menu-area">
        <button
          onClick={toggleMenu}
          className="p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow text-black/60 hover:bg-black/5"
        >
          <MoreVertical size={16} />
        </button>

        {isOpen && (
          <div
            className="absolute top-8 left-0 w-40 bg-white shadow-lg rounded-xl border border-[var(--earth-sand)]/50 p-2 text-sm z-30 book-menu-area"
            onClick={(e) => e.stopPropagation()}
          >

            {/* DELETE — ALWAYS */}
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
      <div
        onClick={() => {
          if (book.status === "DRAFT") {
            navigate(`/author/books/edit/${book.id}`);
          } else {
            onClick(book);
          }
        }}
        className="cursor-pointer"
      >
        <div
          className="
          relative aspect-[2/3] w-full overflow-hidden rounded-[20px]
          bg-black/5 shadow-sm transition-all duration-500
          group-hover:shadow-xl group-hover:shadow-[#5de3ba]/10
        "
        >
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/10">
              <BookOpen size={48} />
            </div>
          )}

          <div
            className="
            absolute top-3 right-3 flex items-center gap-1 rounded-full
            bg-white/90 px-2.5 py-1 text-[10px] font-bold text-black shadow
            text-[14px]
          "
          >
            <Star size={14} className="fill-yellow-400 text-yellow-500" />
            {book.averageRating?.toFixed(1) ?? "0.0"}
          </div>

          <div
            className="
            absolute bottom-3 right-3 flex items-center gap-1 rounded-full
            bg-black/70 text-white px-2 py-1 text-[10px]
          "
          >
            <UserStar size={10} /> {book.totalReviews ?? 0}
          </div>
        </div>

        <div className="px-1 mt-2">
          <h3
            className="
            line-clamp-1 text-base font-black text-black
            group-hover:text-[#5de3ba] transition-colors
          "
          >
            {book.title}
          </h3>
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

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null); // << FIXED HERE

  const lastRef = useRef(null);
  const [activeTab, setActiveTab] = useState("PUBLISHED");

  const filteredBooks = books.filter((b) =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* FETCHING */
  useEffect(() => {
    const load = async () => {
      page === 0 ? setLoading(true) : setLoadingMore(true);

      const res = await fetchFunction(page, activeTab);

      const content = Array.isArray(res?.content) ? res.content : [];
      const total = typeof res?.totalPages === "number" ? res.totalPages : 1;

      setBooks((prev) => (page === 0 ? content : [...prev, ...content]));

      setTotalPages(total);

      page === 0 ? setLoading(false) : setLoadingMore(false);
    };

    load();
  }, [page, activeTab, fetchFunction]);

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
    <div className="w-full min-h-screen bg-[#fafffe]">
      {/* STICKY HEADER ROW */}
      <div
        className="
    sticky top-0 z-40
    bg-[#fafffe]/90 backdrop-blur-xl
    border-b border-black/5
  "
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
            {/* TABS */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  if (activeTab === "PUBLISHED") return;
                  setActiveTab("PUBLISHED");
                  setBooks([]);
                  setPage(0);
                }}
                className={`
            flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-black tracking-tight transition-all
            ${
              activeTab === "PUBLISHED"
                ? "bg-[#5de3ba] text-black shadow-lg shadow-[#5de3ba]/20"
                : "bg-white text-black/60 border border-black/5 hover:bg-black/5"
            }
          `}
              >
                منشورة
              </button>

              <button
                onClick={() => {
                  if (activeTab === "DRAFT") return;
                  setActiveTab("DRAFT");
                  setBooks([]);
                  setPage(0);
                }}
                className={`
            flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-black tracking-tight transition-all
            ${
              activeTab === "DRAFT"
                ? "bg-[#5de3ba] text-black shadow-lg shadow-[#5de3ba]/20"
                : "bg-white text-black/60 border border-black/5 hover:bg-black/5"
            }
          `}
              >
                مسودات
              </button>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="ابحث عن كتاب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
            w-full pl-4 pr-10 py-2.5
            bg-black/5
            text-black
            border border-transparent
            rounded-xl text-sm outline-none text-right font-bold
            focus:bg-white focus:border-[#5de3ba] focus:ring-4 focus:ring-[#5de3ba]/10 transition-all
          "
                dir="rtl"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30"
              />
            </div>
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
          <div className="flex flex-col items-center justify-center py-20 text-black/20">
            <BookOpen size={48} strokeWidth={1} />
            <p className="mt-4 text-lg font-black tracking-tight">لا توجد نتائج</p>
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
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        <div
          ref={lastRef}
          className="h-20 flex items-center justify-center mt-8"
        >
          {loadingMore && (
            <Loader2
              size={24}
              className="animate-spin text-[#5de3ba]"
            />
          )}
        </div>
      </div>

      <BookDetailsModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

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
    </div>
  );
}
