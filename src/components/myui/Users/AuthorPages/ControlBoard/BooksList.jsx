import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Star,
  ArrowLeft,
  BookOpen,
  BarChart3,
  TrendingUp,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoaderCircle from "../../../LoaderCircle";

// --- Mock Data ---
const GENRES = ["الكل", "رواية", "تطوير ذات", "شعر", "سياسة", "تاريخ"];

function BooksList({
  books,
  page,
  setPage,
  totalPages,
  loadingMore,
  sortBy,
  setSortBy,
  selectedGenre,
  setSelectedGenre,
}) {
  const navigate = useNavigate();

  // Internal state fallback
  const [internalSort, setInternalSort] = useState("newest");
  const [internalGenre, setInternalGenre] = useState("الكل");

  const currentSort = sortBy || internalSort;
  const setCurrentSort = setSortBy || setInternalSort;
  const currentGenre = selectedGenre || internalGenre;
  const setCurrentGenre = setSelectedGenre || setInternalGenre;

  return (
    <div className="space-y-6 w-full font-sans">
      {/* --- HEADER SECTION --- */}
      <div
        className="
          flex 
          flex-col 
          md:flex-row 
          items-start md:items-center 
          justify-between 
          gap-4 
          border-b border-slate-100 
          pb-4 md:pb-0 
          w-full
        "
      >
        {/* BUTTON — FIRST IN DOM = RIGHTMOST IN RTL */}
        <button
          onClick={() => navigate("/Screens/dashboard/AuthorPages/myBooks")}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 
               text-sm font-medium text-slate-600 bg-slate-50 
               hover:bg-[var(--earth-sand)]/20 hover:text-[var(--earth-brown)] 
               rounded-md transition-colors whitespace-nowrap order-3 md:order-1"
        >
          <span>عرض الكل</span>
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* FILTERS - Mobile: Grid 2 cols, Desktop: Flex */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-center gap-2 w-full md:w-auto order-2">
          <GenreSelect
            value={currentGenre}
            onChange={setCurrentGenre}
            options={GENRES}
          />
          <SortSelect value={currentSort} onChange={setCurrentSort} />
        </div>

        {/* TITLE — LAST IN DOM = LEFTMOST IN RTL */}
        <div className="flex items-center gap-3 text-slate-800 w-full md:w-auto order-1 md:order-3">
          <div className="p-2 bg-[var(--earth-sand)]/20 rounded-lg shrink-0">
            <BarChart3 className="w-5 h-5 text-[var(--earth-brown)]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">تحليلات كتبي</h2>
        </div>
      </div>

      {/* --- ANALYTICAL TABLE --- */}
      <div
        className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden w-full"
        dir="rtl"
      >
        {/* Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-6 pr-2">الكتاب</div>
          <div className="col-span-2 text-center">التقييم</div>
          <div className="col-span-2 text-center">المشاهدات</div>
          <div className="col-span-2 text-center">الصفحات</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {books && books.length > 0 ? (
            books.map((book) => <BookRow key={book.id} book={book} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <BookOpen className="w-10 h-10 mb-2 opacity-20" />
              <p>لا توجد بيانات لعرضها</p>
            </div>
          )}
        </div>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        isLoadingMore={loadingMore}
      />
    </div>
  );
}

/* --- CUSTOM DROPDOWNS --- */

function SortSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const options = [
    { id: "newest", label: "الأحدث", icon: null },
    {
      id: "most_viewed",
      label: "الأكثر مشاهدة",
      icon: <Eye className="w-3 h-3 ml-2" />,
    },
    {
      id: "highest_rated",
      label: "الأعلى تقييماً",
      icon: <Star className="w-3 h-3 ml-2" />,
    },
  ];

  const selectedLabel = options.find((o) => o.id === value)?.label;

  return (
    <div className="relative w-full md:w-auto" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-row-reverse items-center justify-between w-full md:w-[160px] px-3 py-2 text-sm bg-white border rounded-md shadow-sm transition-all
        ${
          isOpen
            ? "border-[var(--earth-brown)] ring-1 ring-[var(--earth-brown)]"
            : "border-slate-200 hover:bg-slate-50"
        }
        `}
      >
        <div className="flex items-center gap-2 text-slate-700 overflow-hidden">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 opacity-50 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full md:w-[180px] z-50 overflow-hidden bg-white border border-slate-200 rounded-md shadow-lg animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1">
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`
                  relative flex items-center justify-end px-2 py-1.5 text-sm rounded-sm cursor-pointer select-none outline-none
                  ${
                    value === opt.id
                      ? "bg-slate-100 text-[var(--earth-brown-dark)] font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                <span className="flex items-center">
                  {opt.icon}
                  {opt.label}
                </span>
                {value === opt.id && (
                  <span className="absolute left-2 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[var(--earth-brown)]" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GenreSelect({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div className="relative w-full md:w-auto" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-row-reverse items-center justify-between w-full md:w-[140px] px-3 py-2 text-sm bg-white border rounded-md shadow-sm transition-all
        ${
          isOpen
            ? "border-[var(--earth-brown)] ring-1 ring-[var(--earth-brown)]"
            : "border-slate-200 hover:bg-slate-50"
        }
        `}
      >
        <div className="flex items-center gap-2 text-slate-700 overflow-hidden">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {value === "الكل" ? "التصنيف" : value}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 opacity-50 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full md:w-[140px] z-50 overflow-hidden bg-white border border-slate-200 rounded-md shadow-lg animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1 max-h-[200px] overflow-y-auto">
            {options.map((genre) => (
              <div
                key={genre}
                onClick={() => {
                  onChange(genre);
                  setIsOpen(false);
                }}
                className={`
                  relative flex items-center justify-end px-2 py-1.5 text-sm rounded-sm cursor-pointer select-none outline-none
                  ${
                    value === genre
                      ? "bg-slate-100 text-[var(--earth-brown-dark)] font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                <span>{genre}</span>
                {value === genre && (
                  <span className="absolute left-2 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[var(--earth-brown)]" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- TABLE COMPONENTS --- */

function BookRow({ book }) {
  return (
    <div className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/80 transition-colors">
      {/* Column 1: Book Details (Mobile: Takes full width & displays stats) */}
      <div className="col-span-1 md:col-span-6 flex items-start md:items-center gap-4">
        <div className="relative w-16 md:w-12 h-20 md:h-16 shrink-0 rounded bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-5 h-5 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
        
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-[var(--earth-brown)] transition-colors line-clamp-2">
              {book.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {book.genre && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {book.genre}
              </span>
            )}
          </div>

          {/* --- MOBILE STATS ROW (Hidden on Desktop) --- */}
          {/* This allows mobile users to see the stats that usually hide in the other columns */}
          <div className="flex md:hidden items-center gap-3 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span>{(book.averageRating || 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>{book.views?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>{book.pageCount || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Rating (Desktop Only) */}
      <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-slate-700">
            {(book.averageRating || 0).toFixed(1)}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          {book.totalReviews || 0} مراجعة
        </span>
      </div>

      {/* Column 3: Views (Desktop Only) */}
      <div className="hidden md:flex col-span-2 flex-col items-center justify-center text-slate-600">
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold font-mono">
            {book.views?.toLocaleString() || 0}
          </span>
        </div>
        {book.views > 100 && (
          <div className="flex items-center gap-1 text-[10px] text-green-600 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>نشط</span>
          </div>
        )}
      </div>

      {/* Column 4: Pages (Desktop Only) */}
      <div className="hidden md:flex col-span-2 items-center justify-center text-sm text-slate-500">
        {book.pageCount ? (
          <span className="bg-slate-100 px-2 py-1 rounded text-xs">
            {book.pageCount} صفحة
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        )}
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
    <div ref={loaderRef} className="flex justify-center py-2 min-h-[40px]">
      {canLoadMore && isLoadingMore && <LoaderCircle />}
    </div>
  );
}

export default BooksList;