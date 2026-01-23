import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  BookMarked,
  Star,
  BookOpen,
  BarChart3,
  TrendingUp,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Check,
} from "lucide-react";
import LoaderCircle from "../../../LoaderCircle";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";
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
  // Internal state fallback
  const [internalSort, setInternalSort] = useState("newest");
  const [internalGenre, setInternalGenre] = useState("الكل");

  const [genres, setGenres] = useState(["الكل"]);
  const [genresLoading, setGenresLoading] = useState(false);

  const currentSort = sortBy ?? internalSort;
  const setCurrentSort = setSortBy ?? setInternalSort;

  const currentGenre = selectedGenre ?? internalGenre;
  const setCurrentGenre = setSelectedGenre ?? setInternalGenre;

  // show published / drafts toggles (both true = show both)
  const [showPublished, setShowPublished] = useState(true);
  const [showDrafts, setShowDrafts] = useState(true);

  // derive displayed books: apply genre filter, status filter, then sort
  const displayedBooks = useMemo(() => {
    if (!books || !Array.isArray(books)) return [];

    let result = [...books];

    // filter by genre if selected
    if (currentGenre && currentGenre !== "الكل") {
      result = result.filter((b) => {
        const candidates = [
          b.mainGenre,
          b.genre,
          b.genreName,
          b.category,
          ...(Array.isArray(b.categories) ? b.categories : []),
        ].filter(Boolean);
        return candidates.some(
          (g) => typeof g === "string" && g === currentGenre
        );
      });
    }

    // filter by published/drafts (handle uppercase statuses like "PUBLISHED"/"DRAFT")
    if (!(showPublished && showDrafts)) {
      result = result.filter((b) => {
        const statusStr = String(b.status ?? "").toLowerCase();
        const isPublished = b.isPublished === true || statusStr === "published";
        if (showPublished && !showDrafts) return isPublished;
        if (!showPublished && showDrafts) return !isPublished;
        return false;
      });
    }

    // sorting helpers
    const getViews = (b) =>
      Number(b.totalReaders ?? b.TotalReaders ?? b.views ?? 0);
    const getRating = (b) => Number(b.averageRating ?? b.AverageRating ?? 0);
    const getDate = (b) => {
      const d = b.publishDate ?? b.createdAt ?? b.created_at ?? null;
      return d ? new Date(d).getTime() : 0;
    };

    if (currentSort === "most_viewed") {
      result.sort((a, b) => getViews(b) - getViews(a));
    } else if (currentSort === "highest_rated") {
      result.sort((a, b) => getRating(b) - getRating(a));
    } else {
      // newest
      result.sort((a, b) => getDate(b) - getDate(a));
    }

    return result;
  }, [books, currentGenre, currentSort, showPublished, showDrafts]);

  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);

      try {
        const data = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/genres/getAllGenres`,
        });

        // API returns main genres as objects with `nameAr` / `nameEn` and includes `subGenres`.
        // We only want the main genre names (prefer Arabic) and must exclude subGenres.
        const apiGenres = (data?.content || [])
          .map((g) => g.nameAr ?? g.nameEn ?? g.name ?? g.title ?? g.genreName)
          .filter(Boolean);

        setGenres(["الكل", ...Array.from(new Set(apiGenres))]);
        if (data?.messageStatus !== "SUCCESS") {
          AlertToast(data?.message, data?.messageStatus);
          return;
        }
      } catch (err) {
        console.error("Genres Error:", err);
      } finally {
        setGenresLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="space-y-6 w-full font-sans">
      {/* --- HEADER SECTION --- */}
      <div
        dir="rtl"
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
        {/* FILTERS - Mobile: Grid 2 cols, Desktop: Flex */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-center gap-2 w-full md:w-auto order-2">
          <GenreSelect
            value={currentGenre}
            onChange={setCurrentGenre}
            options={genres}
            loading={genresLoading}
          />

          <SortSelect value={currentSort} onChange={setCurrentSort} />

          {/* Published / Drafts checkboxes */}
          <div className="flex items-center gap-2 pr-2">
            <label className="inline-flex items-center gap-2 text-sm select-none">
              <input
                type="checkbox"
                checked={showPublished}
                onChange={(e) => setShowPublished(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">منشور</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm select-none">
              <input
                type="checkbox"
                checked={showDrafts}
                onChange={(e) => setShowDrafts(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">مسودات</span>
            </label>
          </div>
        </div>

        {/* TITLE — LAST IN DOM = LEFTMOST IN RTL */}
        <div
          className="
    flex items-center gap-3
    text-black
    w-full md:w-auto
    justify-start
    text-right
  "
        >
          <div className="p-2.5 bg-[#5de3ba]/10 rounded-2xl shrink-0 shadow-sm shadow-[#5de3ba]/5">
            <BarChart3 className="w-5 h-5 text-[#5de3ba]" />
          </div>
          <h2 className="text-xl font-black tracking-tighter">تحليلات كتبي</h2>
        </div>
      </div>

      {/* --- ANALYTICAL TABLE --- */}
      <div
        className="border border-black/5 bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] overflow-hidden w-full"
        dir="rtl"
      >
        {/* Desktop Table (now visible on all screen sizes) */}
        <div>
          <Table>
            <TableHeader className="bg-black/5">
              <TableRow className="border-black/5 hover:bg-transparent">
                <TableHead className="text-center text-xs font-black uppercase tracking-widest text-black/40 py-4">المعرف</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-widest text-black/40">الكتاب</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-widest text-black/40">التقييم</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-widest text-black/40">التفضيلات</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-widest text-black/40">الحالة</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-widest text-black/40">التصنيف</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-widest text-black/40">وقت النشر</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {displayedBooks && displayedBooks.length > 0 ? (
                displayedBooks.map((book, idx) => (
                  <TableRow
                    key={`${book.bookId ?? book.id}-${idx}`}
                    className="align-middle"
                  >
                    <TableCell className="text-center text-sm font-mono">
                      {book.bookId ?? book.id ?? "-"}
                    </TableCell>
                    <TableCell className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-slate-100 border border-slate-200 overflow-hidden">
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
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-black">
                          {book.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold">
                          {(
                            book.averageRating ??
                            book.AverageRating ??
                            0
                          ).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {book.totalReviews ?? book.TotalReviews ?? 0} مراجعة
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 bg-[#5de3ba]/5 px-2.5 py-1 rounded-full">
                        <BookMarked className="w-4 h-4 text-[#5de3ba]" />
                        <span className="text-sm font-black text-black">
                          {book.totalReaders ?? book.TotalReaders ?? book.views
                            ? (
                                book.totalReaders ??
                                book.TotalReaders ??
                                book.views
                              ).toLocaleString()
                            : 0}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          String(book.status ?? "").toLowerCase() ===
                            "published" || book.isPublished
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {book.status
                          ? String(book.status).toLowerCase() === "published"
                            ? "منشور"
                            : book.status
                          : book.isPublished
                          ? "منشور"
                          : "غير منشور"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center text-sm">
                      {book.mainGenre ? (
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                          {book.mainGenre}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center text-sm">
                      {book.publishDate
                        ? new Date(book.publishDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-slate-400"
                  >
                    <BookOpen className="w-10 h-10 mb-2 opacity-20 inline-block" />
                    <div>لا توجد بيانات لعرضها</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
    { id: "newest", label: "الأحدث" },
    {
      id: "most_viewed",
      label: "الأكثر تفضيلا",
    },
    {
      id: "highest_rated",
      label: "الأعلى تقييماً",
    },
  ];

  const selectedLabel = options.find((o) => o.id === value)?.label;

  return (
    <div className="relative w-full md:w-auto" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-row-reverse items-center justify-between w-full md:w-[160px] px-4 py-2.5 text-sm bg-white border rounded-xl shadow-sm transition-all duration-300
        ${
          isOpen
            ? "border-[#5de3ba] ring-4 ring-[#5de3ba]/10"
            : "border-black/5 hover:bg-black/5"
        }
        `}
      >
        <div className="flex items-center gap-2 text-black font-bold overflow-hidden">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#5de3ba] shrink-0" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-black/20 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
                  relative flex items-center justify-start px-3 py-2 text-sm rounded-lg cursor-pointer select-none outline-none transition-colors text-right w-full
                  ${
                    value === opt.id
                      ? "bg-[#5de3ba]/10 text-black font-bold"
                      : "text-black/60 hover:bg-black/5"
                  }
                `}
              >
                <span className="flex-1">{opt.label}</span>
                {value === opt.id && (
                  <span className="shrink-0 mr-2 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#5de3ba]" />
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
        className={`flex flex-row-reverse items-center justify-between w-full md:w-[140px] px-4 py-2.5 text-sm bg-white border rounded-xl shadow-sm transition-all duration-300
        ${
          isOpen
            ? "border-[#5de3ba] ring-4 ring-[#5de3ba]/10"
            : "border-black/5 hover:bg-black/5"
        }
        `}
      >
        <div className="flex items-center gap-2 text-black font-bold overflow-hidden">
          <Filter className="w-3.5 h-3.5 text-[#5de3ba] shrink-0" />
          <span className="truncate">
            {value === "الكل" ? "التصنيف" : value}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-black/20 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
                  relative flex items-center justify-start px-3 py-2 text-sm rounded-lg cursor-pointer select-none outline-none transition-colors text-right w-full
                  ${
                    value === genre
                      ? "bg-[#5de3ba]/10 text-black font-bold"
                      : "text-black/60 hover:bg-black/5"
                  }
                `}
              >
                <span className="flex-1">{genre}</span>
                {value === genre && (
                  <span className="shrink-0 mr-2 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#5de3ba]" />
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
    <div className="group relative flex md:hidden gap-4 p-3 md:p-4 items-center hover:bg-slate-50/80 transition-colors">
      {/* Column 1: Book Details (Mobile: single-row layout) */}
      <div className="flex-1 md:col-span-6 flex items-center gap-3">
        <div className="relative w-14 md:w-12 h-16 md:h-16 shrink-0 rounded bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
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

        <div className="flex flex-col gap-1 w-full min-w-0">
          <h3 className="text-sm font-black text-black leading-tight group-hover:text-[#5de3ba] transition-colors line-clamp-2">
            {book.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-black/40 mt-1">
            {book.mainGenre && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#5de3ba]/10 text-[#5de3ba]">
                {book.mainGenre}
              </span>
            )}
            <span className="hidden md:inline text-slate-400">
              {book.pageCount ? `${book.pageCount} صفحة` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile compact stats (shown on small screens to keep row single-line) */}
      <div className="flex md:hidden items-center gap-4 ml-2">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold">
            {(book.averageRating || 0).toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-[#5de3ba]" />
          <span className="text-sm font-black text-black">
            {(book.TotalReaders || book.views || 0).toLocaleString()}
          </span>
        </div>
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              book.isPublished || book.status === "published"
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {book.status
              ? book.status
              : book.isPublished
              ? "منشور"
              : "غير منشور"}
          </span>
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

      {/* Column 3: Views / المضلة (Desktop Only) */}
      <div className="hidden md:flex col-span-1 flex-col items-center justify-center text-black">
        <div className="flex items-center gap-2 bg-[#5de3ba]/5 px-3 py-1 rounded-full">
          <Eye className="w-4 h-4 text-[#5de3ba]" />
          <span className="text-sm font-black">
            {book.totalReaders?.toLocaleString() || 0}
          </span>
        </div>
        {book.views > 100 && (
          <div className="flex items-center gap-1 text-[10px] text-green-600 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>نشط</span>
          </div>
        )}
      </div>

      {/* Column 4: Status / الحالة (Desktop Only) */}
      <div className="hidden md:flex col-span-1 flex-col items-center justify-center text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            book.isPublished || book.status === "published"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {book.status ? book.status : book.isPublished ? "منشور" : "غير منشور"}
        </span>
      </div>

      {/* Column 5: Category / التصنيف (Desktop Only) */}
      <div className="hidden md:flex col-span-1 flex-col items-center justify-center text-sm text-slate-500">
        {book.mainGenre ? (
          <span className="bg-slate-100 px-2 py-1 rounded text-xs">
            {book.mainGenre}
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </div>

      {/* Column 6: Published time / وقت النشر (Desktop Only) */}
      <div className="hidden md:flex col-span-1 flex-col items-center justify-center text-sm text-slate-500">
        <span className="text-xs">
          {book.publishDate
            ? new Date(book.publishDate).toLocaleDateString()
            : book.publishDate
            ? new Date(book.publishDate).toLocaleDateString()
            : "-"}
        </span>
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
