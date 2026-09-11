import React, { useState, useMemo } from "react";
import { Star, Sparkles, BookOpen, ArrowUpDown, Filter } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Select,
  Badge,
} from "@/components/myui";

/**
 * Robust Book Cover with Empty/Broken Image Fallback - Liquid Glass
 */
function BookCoverThumbnail({ coverUrl, title, isSelected }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-11 h-14 md:w-12 md:h-16 rounded-xl overflow-hidden shadow-lg border border-white/20 shrink-0 bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-xl flex items-center justify-center">
      {!imgError && coverUrl ? (
        <img
          src={coverUrl}
          alt={title || "كتاب"}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-white/[0.03]">
          <BookOpen size={18} className="text-[#5de3ba]/80" />
        </div>
      )}

      {isSelected && (
        <div className="absolute inset-0 bg-[#5de3ba]/25 ring-2 ring-[#5de3ba] rounded-xl pointer-events-none shadow-[0_0_15px_rgba(93,227,186,0.4)]" />
      )}
    </div>
  );
}

/**
 * Pure presentation AuthorBooksTable component - Fully Responsive Mobile & Desktop
 */
export function AuthorBooksTable({
  books = [],
  genres = ["الكل"],
  searchQuery = "",
  loading = false,
  loadingMore = false,
  page = 0,
  totalPages = 1,
  selectedBookId,
  onLoadMore,
  onSelectBookForStats,
}) {
  const [selectedGenre, setSelectedGenre] = useState("الكل");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL" | "PUBLISHED" | "DRAFT"

  const displayedBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];

    let result = [...books];

    // 0. Search query filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((b) => {
        const title = (b.title || "").toLowerCase();
        const genre = (b.genreName || b.mainGenre?.name || b.genre || "").toLowerCase();
        return title.includes(q) || genre.includes(q);
      });
    }

    // 1. Genre filter
    if (selectedGenre && selectedGenre !== "الكل") {
      result = result.filter((b) => {
        const gName = b.genreName || b.mainGenre?.name || b.genre;
        return gName === selectedGenre;
      });
    }

    // 2. Status single-choice toggle filter
    if (statusFilter === "PUBLISHED") {
      result = result.filter((b) => b.isDraft === false || b.status === "PUBLISHED");
    } else if (statusFilter === "DRAFT") {
      result = result.filter((b) => b.isDraft === true || b.status === "DRAFT");
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "highest_rated") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      if (sortBy === "most_read") {
        return (b.readCount || b.totalReads || 0) - (a.readCount || a.totalReads || 0);
      }
      return (b.id || 0) - (a.id || 0);
    });

    return result;
  }, [books, searchQuery, selectedGenre, statusFilter, sortBy]);

  return (
    <div
      id="author-books-table"
      className="relative rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_15px_35px_rgba(0,0,0,0.4)] space-y-4 md:space-y-6 overflow-hidden scroll-mt-24 md:scroll-mt-28"
      dir="rtl"
    >
      {/* Specular White Top Reflection Line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* ============================================================ */}
      {/* 💻 CONTROLS HEADER (DESKTOP & TABLET: >= md)                 */}
      {/* ============================================================ */}
      <div className="hidden md:flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              قائمة الكتب والإحصائيات
            </h2>
            <Badge variant="mint" size="sm">
              {displayedBooks.length} كتب
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-200 mt-1">
            اضغط على أي كتاب لعرض إحصائياته في الرسوم البيانية أعلاه
          </p>
        </div>

        {/* Desktop Filter Controls */}
        <div className="flex items-center gap-2.5">
          {/* Status Single-Choice Toggle */}
          <div className="flex items-center bg-white/[0.06] p-1 rounded-2xl border border-white/15 backdrop-blur-xl shadow-inner text-xs font-bold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                statusFilter === "ALL"
                  ? "bg-white/20 text-white font-black shadow-sm"
                  : "text-slate-200 hover:text-white font-bold"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                statusFilter === "PUBLISHED"
                  ? "bg-gradient-to-r from-[#5de3ba] to-[#2dd4bf] text-black font-black shadow-[0_0_12px_rgba(93,227,186,0.3)]"
                  : "text-slate-200 hover:text-white font-bold"
              }`}
            >
              المنشورة
            </button>
            <button
              onClick={() => setStatusFilter("DRAFT")}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                statusFilter === "DRAFT"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                  : "text-slate-200 hover:text-white font-bold"
              }`}
            >
              المسودات
            </button>
          </div>

          {/* Genre Filter */}
          {genres.length > 1 && (
            <div className="w-36">
              <Select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                options={genres.map((g) => ({ value: g, label: g }))}
                icon={<Filter size={13} />}
              />
            </div>
          )}

          {/* Sort Selector */}
          <div className="w-36">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "newest", label: "الأحدث" },
                { value: "highest_rated", label: "الأعلى تقييماً" },
                { value: "most_read", label: "الأكثر قراءة" },
              ]}
              icon={<ArrowUpDown size={13} />}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 📱 CONTROLS HEADER (MOBILE: < md) - APP-STYLE HORIZONTAL BAR */}
      {/* ============================================================ */}
      <div className="flex md:hidden flex-col gap-3 pb-3 border-b border-white/10">
        {/* Top Mobile Row: Title & Sort Dropdown */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white tracking-tight">
              كتبك
            </h3>
            <Badge variant="mint" size="sm">
              {displayedBooks.length}
            </Badge>
          </div>

          {/* Compact Sort Selector on Mobile */}
          <div className="w-36 shrink-0">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "newest", label: "الأحدث" },
                { value: "highest_rated", label: "الأعلى تقييماً" },
                { value: "most_read", label: "الأكثر قراءة" },
              ]}
              icon={<ArrowUpDown size={12} />}
            />
          </div>
        </div>

        {/* Bottom Mobile Row: Horizontal Scrollable Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {/* Status Pills */}
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
              statusFilter === "ALL"
                ? "bg-white/20 text-white font-black shadow-inner border border-white/20"
                : "bg-white/[0.05] text-slate-300 border border-white/10"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setStatusFilter("PUBLISHED")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
              statusFilter === "PUBLISHED"
                ? "bg-gradient-to-r from-[#5de3ba] to-[#2dd4bf] text-black font-black shadow-[0_0_12px_rgba(93,227,186,0.3)]"
                : "bg-white/[0.05] text-slate-300 border border-white/10"
            }`}
          >
            المنشورة
          </button>
          <button
            onClick={() => setStatusFilter("DRAFT")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
              statusFilter === "DRAFT"
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                : "bg-white/[0.05] text-slate-300 border border-white/10"
            }`}
          >
            المسودات
          </button>

          {/* Genre Chips (if multiple genres exist) */}
          {genres.length > 1 &&
            genres
              .filter((g) => g !== "الكل")
              .map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre((prev) => (prev === g ? "الكل" : g))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                    selectedGenre === g
                      ? "bg-[#5de3ba]/25 text-[#5de3ba] border border-[#5de3ba]/50 shadow-sm"
                      : "bg-white/[0.04] text-slate-300 border border-white/10"
                  }`}
                >
                  {g}
                </button>
              ))}
        </div>
      </div>

      {/* Main Content: Books List */}
      {loading ? (
        <div className="text-center py-16 text-slate-200 font-bold text-sm">
          <div className="w-8 h-8 border-2 border-[#5de3ba]/20 border-t-[#5de3ba] rounded-full animate-spin mx-auto mb-3" />
          <p>جاري تحميل الكتب...</p>
        </div>
      ) : displayedBooks.length === 0 ? (
        <div className="text-center py-16 text-slate-200 font-bold text-sm space-y-2">
          <p>
            {searchQuery
              ? `لا توجد نتائج تطابق بحثك عن "${searchQuery}"`
              : "لا توجد كتب مسجلة تطابق الشروط المحددة."}
          </p>
          {searchQuery && (
            <p className="text-xs text-slate-400 font-medium">
              جرب البحث باسم كتاب آخر أو تغيير خيارات التصنيف.
            </p>
          )}
        </div>
      ) : (

        <>
          {/* 📱 MOBILE VIEW: Sleek Glass Book Cards */}
          <div className="block md:hidden space-y-2.5">
            {displayedBooks.map((book) => {
              const isSelected = Boolean(
                selectedBookId !== null &&
                selectedBookId !== undefined &&
                book?.id !== null &&
                book?.id !== undefined &&
                String(selectedBookId) === String(book?.id)
              );

              return (
                <div
                  key={book.id || book.title}
                  onClick={() => book.id && onSelectBookForStats?.(book.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.08] border-[#5de3ba]/60 shadow-[0_0_15px_rgba(93,227,186,0.15)]"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                  }`}
                >
                  {/* Right: Cover + Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <BookCoverThumbnail
                      coverUrl={book.coverImageUrl || book.cover}
                      title={book.title}
                      isSelected={isSelected}
                    />
                    <div className="min-w-0">
                      <h4 className="font-black text-sm text-white truncate">{book.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-slate-300">
                          {book.genreName || book.mainGenre?.name || "عام"}
                        </span>
                        <Badge
                          size="sm"
                          variant={book.isDraft || book.status === "DRAFT" ? "amber" : "mint"}
                        >
                          {book.isDraft || book.status === "DRAFT" ? "مسودة" : "منشور"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Left: Rating + Read Count */}
                  <div className="text-left shrink-0 pl-1 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs font-black text-yellow-400">
                      <Star size={13} className="fill-yellow-400" />
                      <span>{Number(book.averageRating || 0).toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-300">
                      {book.readCount || book.totalReads || 0} قراءة
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 💻 DESKTOP VIEW: Full Liquid Glass Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الكتاب</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>القراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBooks.map((book) => {
                  const isSelected = Boolean(
                    selectedBookId !== null &&
                    selectedBookId !== undefined &&
                    book?.id !== null &&
                    book?.id !== undefined &&
                    String(selectedBookId) === String(book?.id)
                  );

                  return (
                    <TableRow
                      key={book.id || book.title}
                      onClick={() => book.id && onSelectBookForStats?.(book.id)}
                      className={`cursor-pointer ${
                        isSelected
                          ? "bg-white/[0.08] border-r-2 border-r-[#5de3ba] shadow-inner"
                          : ""
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3.5">
                          <BookCoverThumbnail
                            coverUrl={book.coverImageUrl || book.cover}
                            title={book.title}
                            isSelected={isSelected}
                          />
                          <div>
                            <span className="font-black text-sm text-white block tracking-tight">{book.title}</span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-[#5de3ba] flex items-center gap-1 mt-0.5">
                                <Sparkles size={10} />
                                المحدد حالياً
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-200">
                        {book.genreName || book.mainGenre?.name || "عام"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={book.isDraft || book.status === "DRAFT" ? "amber" : "mint"}
                        >
                          {book.isDraft || book.status === "DRAFT" ? "مسودة" : "منشور"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-black text-yellow-400">
                          <Star size={14} className="fill-yellow-400" />
                          <span>{Number(book.averageRating || 0).toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-black text-slate-100 font-mono">
                        {book.readCount || book.totalReads || 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Load More Button */}
      {page + 1 < totalPages && (
        <div className="flex justify-center pt-4 md:pt-6">
          <Button
            variant="glass"
            size="md"
            onClick={onLoadMore}
            loading={loadingMore}
            className="w-full sm:w-auto px-10"
          >
            تحميل المزيد من الكتب
          </Button>
        </div>
      )}
    </div>
  );
}

export default AuthorBooksTable;
