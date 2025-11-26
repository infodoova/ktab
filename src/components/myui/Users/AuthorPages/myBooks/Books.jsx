import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Star,
  Eye,
  ExternalLink,
  Loader2,
  Music,
  Globe,
  Search,
  MoreVertical,
  Trash2,
  Share2,
  Edit3,
} from "lucide-react";

import SkeletonBookLoader from "./SkeletonBookLoader";

// ShadCN
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 8;

export default function BooksGrid({ fetchFunction }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const lastRef = useRef(null);

  const filteredBooks = books.filter((b) =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* -----------------------------------------------------
   * FETCH BOOKS
   ------------------------------------------------------ */
  useEffect(() => {
    const load = async () => {
      page === 0 ? setLoading(true) : setLoadingMore(true);

      const res = await fetchFunction(page);
      const list = res?.content || [];
      const total = res?.totalPages || 1;

      setTotalPages(total);
      setBooks((prev) => (page === 0 ? list : [...prev, ...list]));

      page === 0 ? setLoading(false) : setLoadingMore(false);
    };

    load();
  }, [page, fetchFunction]);

  /* -----------------------------------------------------
   * INFINITE SCROLL
   ------------------------------------------------------ */
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
      { threshold: 0.2 }
    );

    if (lastRef.current) observer.observe(lastRef.current);
    return () => lastRef.current && observer.unobserve(lastRef.current);
  }, [page, totalPages, loadingMore]);

  /* -----------------------------------------------------
   * BOOK CARD
   ------------------------------------------------------ */
  const BookCard = ({ book }) => {
    const shareBook = async () => {
      const url = book.pdfDownloadUrl;

      try {
        if (navigator.share) {
          await navigator.share({
            title: book.title,
            text: "مشاركة رابط الكتاب",
            url,
          });
        } else {
          await navigator.clipboard.writeText(url);
          alert("✔ تم نسخ رابط الكتاب");
        }
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div
        dir="rtl"
        className="group relative overflow-hidden rounded-2xl border border-[var(--earth-sand)]/60 
        bg-white shadow-md hover:shadow-lg hover:border-[var(--earth-olive)]/50 
        transition-all duration-300 flex flex-col"
      >
        {/* COVER */}
        <div className="relative aspect-[2/3] bg-[var(--earth-sand)]/30 overflow-hidden">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--earth-sand)]/60">
              <BookOpen size={60} />
            </div>
          )}

          {/* RATING */}
          <div className="absolute top-3 right-3 rounded-full bg-white shadow-md px-3 py-1.5 flex items-center gap-1 text-xs font-bold text-[var(--earth-brown-dark)]">
            <Star size={12} className="text-yellow-500 fill-yellow-400" />
            {book.averageRating?.toFixed(1) || "0.0"}
          </div>

          {/* DESCRIPTION HOVER */}
          {book.description && (
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
              bg-[var(--earth-brown-dark)]/80 backdrop-blur-sm transition-opacity duration-300 p-5"
            >
              <div className="max-h-[75%] w-full flex flex-col">
                <h4 className="text-[var(--earth-cream)] text-sm font-semibold text-center mb-3">
                  الوصف
                </h4>

                <div className="flex-1 overflow-y-auto text-[var(--earth-cream)] text-xs leading-relaxed custom-scroll pr-1">
                  {book.description}
                </div>
              </div>
            </div>
          )}

          {/* ORIGINAL HOVER BUTTON (UNCHANGED) */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 
          transition-transform duration-300 flex gap-2 p-3 
          bg-gradient-to-t from-[var(--earth-brown-dark)]/95 to-[var(--earth-brown)]/60">
            <a
              href={book.pdfDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 text-white text-xs font-semibold 
              px-3 py-2.5 rounded-lg bg-gradient-to-r from-[var(--earth-olive)] to-[var(--earth-olive)]/80 
              hover:from-[var(--earth-olive-dark)] hover:to-[var(--earth-olive)] transition shadow-lg"
            >
              <ExternalLink size={14} />
              معاينة
            </a>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          <h3 className="font-bold text-sm line-clamp-2 text-[var(--earth-brown-dark)]">
            {book.title}
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 truncate">
              {book.genre || "—"}
            </div>

            <div className="px-2 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
              {book.pageCount || 0} صفحة
            </div>

            <div className="col-span-2 px-2 py-1.5 rounded-lg bg-green-50 text-green-800 border border-green-200/60">
              {book.ageRangeMin ?? 0}-{book.ageRangeMax ?? 0} سنة
            </div>
          </div>

          {/* FOOTER ROW */}
          <div className="flex items-center gap-2 text-xs border-t border-[var(--earth-sand)]/40 pt-2">
            <div className="flex items-center gap-1 text-[var(--earth-brown)]">
              <Globe size={12} />
              {book.language?.slice(0, 2).toUpperCase() || "AR"}
            </div>

            {book.hasAudio && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200/60">
                <Music size={11} />
                صوتي
              </div>
            )}

            <div className="flex items-center gap-1 ml-auto text-[var(--earth-brown)]">
              <Eye size={12} />
              {book.totalReviews || 0}
            </div>

            {/* SHADCN 3-DOT MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 rounded-md hover:bg-[var(--earth-sand)]/40"
                >
                  <MoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                className="w-40 bg-white border border-[var(--earth-sand)]/40 
                rounded-lg shadow-md text-right rtl"
              >
                <DropdownMenuItem
                  onClick={() => console.log("EDIT", book.id)}
                  className="flex items-center justify-between text-[var(--earth-brown)]"
                >
                  تعديل
                  <Edit3 size={14} />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={shareBook}
                  className="flex items-center justify-between text-[var(--earth-brown)]"
                >
                  مشاركة
                  <Share2 size={14} />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => console.log("DELETE", book.id)}
                  className="flex items-center justify-between text-red-600"
                >
                  حذف
                  <Trash2 size={14} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  };

  /* -----------------------------------------------------
   * RENDER
   ------------------------------------------------------ */
  return (
    <div className="w-full">
      {/* SEARCH */}
      <div className="px-4 sm:px-6 pt-4 pb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="ابحث عن الكتب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-[var(--earth-sand)]/40 bg-white 
            text-[var(--earth-brown)] focus:border-[var(--earth-olive)] focus:ring-2 
            focus:ring-[var(--earth-olive)]/30 shadow-sm outline-none"
          />
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--earth-brown)]/40"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="px-4 sm:px-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonBookLoader key={i} />
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center mt-20 text-gray-600">
            <BookOpen size={40} />
            <p className="mt-3 text-lg font-bold">
              {searchQuery ? "لا توجد نتائج" : "لا يوجد كتب"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}

        {/* INFINITE SCROLL LOADER */}
        <div ref={lastRef} className="flex items-center justify-center h-20">
          {loadingMore && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              تحميل المزيد...
            </div>
          )}
        </div>
      </div>

      {/* CUSTOM SCROLLBAR */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: var(--earth-olive);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
