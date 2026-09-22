import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import {
  AuthorBookGrid,
  BookDetailsDrawer,
  DeleteBookModal,
} from "../components";
import { useAuthorBooks } from "../hooks/useAuthorBooks";
import { MY_BOOKS_SORT_OPTIONS } from "../constants/myBooksConstants";
import { Select, BottomSheet } from "@/components/myui";
import { Plus, SlidersHorizontal, RotateCcw } from "lucide-react";
import "./MyBooksView.css";

/**
 * Pure presentation view for Author's books library.
 * Styled with Ktab's Eleven Reader + Apple design system.
 */
export function MyBooksView({ pageName = "كتبي" }) {
  const navigate = useNavigate();
  const {
    books,
    displayedBooks,
    loading,
    loadingMore,
    page,
    totalPages,
    totalElements,
    status,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    availableGenres,
    sortBy,
    setSortBy,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    activeFiltersCount,
    resetFilters,
    openMenuId,
    setOpenMenuId,
    selectedBookForDetails,
    setSelectedBookForDetails,
    bookToDelete,
    setBookToDelete,
    handleStatusChange,
    loadMore,
    handleConfirmDelete,
  } = useAuthorBooks();

  const genreOptions = [
    { value: "ALL", label: "جميع التصنيفات" },
    ...availableGenres.map((g) => ({ value: g, label: g })),
  ];

  const headerActions = (
    <button
      type="button"
      onClick={() =>
        navigate("/author/new-book", {
          state: {
            from: {
              parentLabel: pageName || "المكتبة",
              parentPath: "/author/my-books",
            },
          },
        })
      }
      className="ktab-topbar__btn-action"
      title="نشر كتاب جديد"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">نشر كتاب جديد</span>
    </button>
  );

  return (
    <AppLayout
      pageName={pageName}
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في كتبك..."
      headerActions={headerActions}
    >
      <div className="ktab-mybooks-page">
        {/* Sticky Section Header */}
        <div className="ktab-mybooks-section-header">
          <div className="ktab-mybooks-section-meta">
            <h2 className="ktab-mybooks-section-title">
              {status === "DRAFT"
                ? "المسودات"
                : status === "UNDER_REVIEW"
                ? "قيد المراجعة"
                : "الكتب المنشورة"}
            </h2>
            <span className="ktab-mybooks-section-count">
              {totalElements}{" "}
              {totalElements === 1
                ? "كتاب"
                : totalElements === 2
                ? "كتابان"
                : totalElements > 10
                ? "كتاب"
                : "كتب"}
            </span>
          </div>

          {/* Status Segmented Control (Desktop) */}
          <div className="ktab-mybooks-status-tabs ktab-desktop-only">
            <button
              type="button"
              onClick={() => handleStatusChange("PUBLISHED")}
              className={`ktab-mybooks-status-tab ${
                status === "PUBLISHED" ? "ktab-mybooks-status-tab--active" : ""
              }`}
            >
              الكتب المنشورة
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("UNDER_REVIEW")}
              className={`ktab-mybooks-status-tab ${
                status === "UNDER_REVIEW" ? "ktab-mybooks-status-tab--active" : ""
              }`}
            >
              قيد المراجعة
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("DRAFT")}
              className={`ktab-mybooks-status-tab ${
                status === "DRAFT" ? "ktab-mybooks-status-tab--active" : ""
              }`}
            >
              المسودات
            </button>
          </div>

          {/* Desktop Filter Dropdowns */}
          <div className="ktab-mybooks-filters-group ktab-desktop-only">
            {genreOptions.length > 2 && (
              <Select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                options={genreOptions}
                placeholder="التصنيف"
                className="ktab-mybooks-filter-select"
                triggerClassName="ktab-mybooks-filter-select-trigger"
                menuClassName="ktab-mybooks-filter-select-menu"
              />
            )}

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={MY_BOOKS_SORT_OPTIONS}
              placeholder="الترتيب"
              className="ktab-mybooks-filter-select"
              triggerClassName="ktab-mybooks-filter-select-trigger"
              menuClassName="ktab-mybooks-filter-select-menu"
            />
          </div>

          {/* Mobile Filter Button (opens BottomSheet) */}
          <button
            type="button"
            className="ktab-mobile-filter-btn ktab-mobile-only"
            onClick={() => setIsFilterSheetOpen(true)}
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
        </div>

        {/* Books Grid */}
        <AuthorBookGrid
          books={displayedBooks}
          loading={loading}
          loadingMore={loadingMore}
          page={page}
          totalPages={totalPages}
          status={status}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onBookClick={setSelectedBookForDetails}
          onDeleteClick={setBookToDelete}
          onLoadMore={loadMore}
          onCreateNew={() => navigate("/author/new-book")}
          searchQuery={searchQuery}
          isFiltered={selectedGenre !== "ALL" || sortBy !== "newest"}
          onResetFilters={resetFilters}
        />

        {/* Mobile Filter BottomSheet */}
        <BottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title="تصفية الكتب"
        >
          <div className="ktab-mybooks-sheet-content">
            {/* Status Tab Toggle on Mobile */}
            <div className="ktab-mybooks-sheet-field">
              <span className="ktab-mybooks-sheet-label">حالة الكتب</span>
              <div className="ktab-mybooks-status-tabs" style={{ width: "100%" }}>
                <button
                  type="button"
                  onClick={() => {
                    handleStatusChange("PUBLISHED");
                  }}
                  className={`ktab-mybooks-status-tab ${
                    status === "PUBLISHED" ? "ktab-mybooks-status-tab--active" : ""
                  }`}
                  style={{ flex: 1, textAlign: "center" }}
                >
                  المنشورة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStatusChange("UNDER_REVIEW");
                  }}
                  className={`ktab-mybooks-status-tab ${
                    status === "UNDER_REVIEW" ? "ktab-mybooks-status-tab--active" : ""
                  }`}
                  style={{ flex: 1, textAlign: "center" }}
                >
                  قيد المراجعة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStatusChange("DRAFT");
                  }}
                  className={`ktab-mybooks-status-tab ${
                    status === "DRAFT" ? "ktab-mybooks-status-tab--active" : ""
                  }`}
                  style={{ flex: 1, textAlign: "center" }}
                >
                  المسودات
                </button>
              </div>
            </div>

            {/* Sort Selector */}
            <div className="ktab-mybooks-sheet-field">
              <span className="ktab-mybooks-sheet-label">الترتيب</span>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={MY_BOOKS_SORT_OPTIONS}
                placeholder="الترتيب"
              />
            </div>

            {/* Genre Selector */}
            {genreOptions.length > 2 && (
              <div className="ktab-mybooks-sheet-field">
                <span className="ktab-mybooks-sheet-label">التصنيف</span>
                <Select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  options={genreOptions}
                  placeholder="التصنيف"
                />
              </div>
            )}

            {activeFiltersCount > 0 && (
              <button
                type="button"
                className="ktab-mybooks-sheet-reset-btn"
                onClick={resetFilters}
              >
                <RotateCcw size={14} />
                <span>إعادة ضبط الفلاتر</span>
              </button>
            )}
          </div>
        </BottomSheet>

        {/* Book Details Modal (Floating PC card, blur-to-load, scroll lock) */}
        <BookDetailsDrawer
          isOpen={Boolean(selectedBookForDetails)}
          onClose={() => setSelectedBookForDetails(null)}
          book={selectedBookForDetails}
        />

        {/* Delete Confirmation Modal (Spring motion, scroll lock) */}
        <DeleteBookModal
          isOpen={Boolean(bookToDelete)}
          onClose={() => setBookToDelete(null)}
          onConfirm={handleConfirmDelete}
          bookTitle={bookToDelete?.title || ""}
        />
      </div>
    </AppLayout>
  );
}

export default MyBooksView;
