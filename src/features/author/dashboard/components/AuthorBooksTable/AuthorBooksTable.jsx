import React, { useState } from "react";
import {
  Star,
  BookOpen,
  SlidersHorizontal,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
  BottomSheet,
  Pagination,
} from "@/components/myui";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useAuthorBooksTable } from "./useAuthorBooksTable";
import { useBookThumbnail } from "./useBookThumbnail";
import "./AuthorBooksTable.css";

function BookThumbnail({ coverUrl, title }) {
  const { loaded, hasError, handleLoad, handleError } = useBookThumbnail(coverUrl);

  return (
    <div className="ktab-book-cover-wrap">
      {!loaded && !hasError && coverUrl && (
        <div className="ktab-book-cover-shimmer" />
      )}
      {!hasError && coverUrl ? (
        <img
          src={coverUrl}
          alt={title || "كتاب"}
          onLoad={handleLoad}
          onError={handleError}
          className={`ktab-book-cover-img ${
            loaded ? "ktab-book-cover-img--loaded" : "ktab-book-cover-img--loading"
          }`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="ktab-book-cover-empty" aria-hidden="true">
          <img
            src={brandIconImg}
            alt=""
            className="ktab-book-cover-fallback-logo"
          />
        </div>
      )}
    </div>
  );
}

export function AuthorBooksTable({
  books = [],
  genres = ["الكل"],
  searchQuery = "",
  loading = false,
  isPaginating = false,
  page = 0,
  totalPages = 1,
  selectedBookId,
  onPageChange,
  onSelectBookForStats,
}) {
  const {
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    isMobileScreen,
    activeFiltersCount,
    resetFilters,
    displayedBooks,
    handleSelectBook,
    tableContainerRef,
    tableContentRef,
    handleTableScroll,
    canScroll,
    scrollProgress,
    handlePaginationChange,
    genreOptions,
    sortOptions,
  } = useAuthorBooksTable({
    books,
    genres,
    searchQuery,
    selectedBookId,
    onSelectBookForStats,
    onPageChange,
  });

  return (
    <section
      id="author-books-table"
      className="ktab-books-card"
      dir="rtl"
      aria-label="قائمة الكتب والإحصائيات"
    >
      {/* Header Controls */}
      <header className="ktab-books-card__header">
        <div className="ktab-books-card__header-text">
          <div className="ktab-books-card__title-row">
            <div className="ktab-books-card__title-group">
              <h2 className="ktab-books-card__title">قائمة الكتب والإحصائيات</h2>
              <span className="ktab-books-card__count">
                ({displayedBooks.length} عمل)
              </span>
            </div>

            {/* Mobile Icon-Only Filter Button (Strictly Mobile Only) */}
            {isMobileScreen && (
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
                className="ktab-mobile-filter-btn ktab-mobile-only"
                aria-label="تصفية وترتيب الكتب"
                title="تصفية وترتيب الكتب"
              >
                <SlidersHorizontal size={15} />
                {activeFiltersCount > 0 && (
                  <span className="ktab-mobile-filter-badge">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filter Controls (screens >= 768px) */}
        <div className="ktab-books-card__controls ktab-desktop-only">
          {/* Status Segmented Tabs */}
          <div
            className="ktab-segmented-tabs"
            role="tablist"
            aria-label="تصفية حسب الحالة"
          >
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "ALL"}
              onClick={() => setStatusFilter("ALL")}
              className={`ktab-segmented-tab ${
                statusFilter === "ALL" ? "ktab-segmented-tab--active" : ""
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "PUBLISHED"}
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`ktab-segmented-tab ${
                statusFilter === "PUBLISHED" ? "ktab-segmented-tab--active" : ""
              }`}
            >
              المنشورة
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "DRAFT"}
              onClick={() => setStatusFilter("DRAFT")}
              className={`ktab-segmented-tab ${
                statusFilter === "DRAFT" ? "ktab-segmented-tab--active" : ""
              }`}
            >
              المسودات
            </button>
          </div>

          {/* Global UI Select Components */}
          <div className="ktab-books-card__selects-group">
            {genres.length > 1 && (
              <Select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                options={genreOptions}
                placeholder="جميع التصنيفات"
                className="ktab-table-select"
                triggerClassName="ktab-table-select-trigger"
                menuClassName="ktab-table-select-menu"
              />
            )}

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
              placeholder="ترتيب حسب"
              className="ktab-table-select"
              triggerClassName="ktab-table-select-trigger"
              menuClassName="ktab-table-select-menu"
            />
          </div>
        </div>
      </header>

      {/* Table Section with Horizontal Scroll & Indicator */}
      <div className="ktab-table-scroll-section">
        {/* Sleek Mobile Horizontal Scroll Indicator Track */}
        {canScroll && (
          <div className="ktab-table-scroll-indicator" aria-hidden="true">
            <div className="ktab-table-scroll-indicator-bar">
              <div
                className="ktab-table-scroll-indicator-thumb"
                style={{
                  width: "35%",
                  right: `${scrollProgress * 0.65}%`,
                }}
              />
            </div>
            <span className="ktab-table-scroll-indicator-label">
              مرر أفقياً لعرض كافة الأعمدة
            </span>
          </div>
        )}

        {/* Clean Pure White Table Container (Anchor for smooth scroll to loader & first row) */}
        <div
          ref={tableContentRef}
          id="author-books-table-content"
          className="ktab-table-container-outer"
        >
          {/* Top Line Loader on Page Change */}
          <div
            className={`ktab-table-line-loader ${
              isPaginating ? "ktab-table-line-loader--active" : ""
            }`}
            role="progressbar"
            aria-label="جاري تحميل الصفحة..."
            aria-hidden={!isPaginating}
          >
            <div className="ktab-table-line-loader__track">
              <div className="ktab-table-line-loader__bar" />
            </div>
          </div>

          <div
            ref={tableContainerRef}
            onScroll={handleTableScroll}
            className={`ktab-table-wrapper ${
              isPaginating ? "ktab-table-wrapper--paginating" : ""
            }`}
          >
            <Table className="ktab-pure-white-table">
              <TableHeader>
                <TableRow>
                  <TableHead>الكتاب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>متوسط التقييم</TableHead>
                  <TableHead>إجمالي القراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBooks.length === 0 ? (
                  <TableRow key="empty-books-row">
                    <TableCell colSpan={4}>
                      <div className="ktab-books-empty">
                        <p className="ktab-books-empty__text">
                          {loading ? "جاري تحميل الكتب..." : "لم يتم العثور على كتب مطابقة"}
                        </p>
                        {activeFiltersCount > 0 && (
                          <button
                            type="button"
                            onClick={resetFilters}
                            className="ktab-books-empty__reset-btn"
                          >
                            <RotateCcw size={13} />
                            <span>إلغاء تفعيل الفلاتر</span>
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedBooks.map((book, index) => {
                    const bookId = book.id ?? book._id ?? book.bookId;
                    const bookKey = bookId != null ? `book-${bookId}` : `book-index-${index}`;
                    const isSelected = selectedBookId === bookId;
                    const isPublished =
                      book.isDraft === false || book.status === "PUBLISHED";
                    const rating =
                      typeof book.averageRating === "number"
                        ? book.averageRating.toFixed(1)
                        : book.averageRating || "0.0";
                    const reads = book.totalReaders ?? book.readCount ?? book.totalReads ?? 0;
                    const genre =
                      book.genreName ||
                      (typeof book.mainGenre === "string" ? book.mainGenre : book.mainGenre?.name) ||
                      book.genre ||
                      "عام";
                    const coverUrl =
                      book.coverImageUrl || book.coverUrl || book.coverImage || book.cover;

                    return (
                      <TableRow
                        key={bookKey}
                        onClick={() => handleSelectBook(bookId)}
                        className={`ktab-book-row ${
                          isSelected ? "ktab-book-row--selected" : ""
                        }`}
                      >
                        {/* Book Cover + Title + Genre */}
                        <TableCell>
                          <div className="ktab-book-cell-main">
                            <BookThumbnail
                              coverUrl={coverUrl}
                              title={book.title}
                            />
                            <div className="ktab-book-info">
                              <h4 className="ktab-book-title" title={book.title}>
                                {book.title}
                              </h4>
                              <span className="ktab-book-genre">{genre}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Status (Professional Monochrome Clean Text, NO DOT) */}
                        <TableCell>
                          <span
                            className={`ktab-status-text ${
                              isPublished
                                ? "ktab-status-text--published"
                                : "ktab-status-text--draft"
                            }`}
                          >
                            {isPublished ? "منشور" : "مسودة"}
                          </span>
                        </TableCell>

                        {/* Average Rating */}
                        <TableCell>
                          <div className="ktab-rating-display">
                            <Star size={14} fill="#eab308" color="#eab308" />
                            <span>{rating}</span>
                          </div>
                        </TableCell>

                        {/* Total Reads (English Numeral Formatted) */}
                        <TableCell>
                          <span className="ktab-reads-display">
                            {reads.toLocaleString("en-US")}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Global Pagination Component */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePaginationChange}
        disabled={loading || isPaginating}
      />

      {/* Global Bottom Sheet for Mobile Filters (Strictly Mobile Only) */}
      {isMobileScreen && (
        <BottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title="تصفية وترتيب الكتب"
          className="ktab-filter-bottom-sheet"
          scrollable={false}
        >
          <div className="ktab-filter-sheet-body">
            {/* Status Group */}
            <div className="ktab-filter-sheet-field">
              <label className="ktab-filter-sheet-label">حالة الكتاب</label>
              <div className="ktab-filter-sheet-tabs">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`ktab-filter-sheet-tab ${
                    statusFilter === "ALL" ? "ktab-filter-sheet-tab--active" : ""
                  }`}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("PUBLISHED")}
                  className={`ktab-filter-sheet-tab ${
                    statusFilter === "PUBLISHED"
                      ? "ktab-filter-sheet-tab--active"
                      : ""
                  }`}
                >
                  المنشورة
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("DRAFT")}
                  className={`ktab-filter-sheet-tab ${
                    statusFilter === "DRAFT" ? "ktab-filter-sheet-tab--active" : ""
                  }`}
                >
                  المسودات
                </button>
              </div>
            </div>

            {/* Genre Select */}
            {genres.length > 1 && (
              <div className="ktab-filter-sheet-field">
                <label className="ktab-filter-sheet-label">التصنيف</label>
                <Select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  options={genreOptions}
                  placeholder="جميع التصنيفات"
                  className="ktab-filter-sheet-select"
                  triggerClassName="ktab-table-select-trigger"
                  menuClassName="ktab-table-select-menu"
                />
              </div>
            )}

            {/* Sort Select */}
            <div className="ktab-filter-sheet-field">
              <label className="ktab-filter-sheet-label">الترتيب</label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                placeholder="ترتيب حسب"
                className="ktab-filter-sheet-select"
                triggerClassName="ktab-table-select-trigger"
                menuClassName="ktab-table-select-menu"
              />
            </div>

            {/* Sheet Footer Actions */}
            <div className="ktab-filter-sheet-actions">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ktab-filter-sheet-reset-btn"
                >
                  <RotateCcw size={14} />
                  <span>إعادة تعيين</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="ktab-filter-sheet-apply-btn"
              >
                <Check size={16} />
                <span>إظهار النتائج ({displayedBooks.length})</span>
              </button>
            </div>
          </div>
        </BottomSheet>
      )}
    </section>
  );
}

export default AuthorBooksTable;
