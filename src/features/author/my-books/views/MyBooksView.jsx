import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import {
  AuthorBookGrid,
  BookDetailsDrawer,
  DeleteBookModal,
} from "../components";
import { useAuthorBooks } from "../hooks/useAuthorBooks";
import { Plus } from "lucide-react";
import "./MyBooksView.css";

/**
 * Pure presentation view for Author's books library.
 * Styled with Ktab's Eleven Reader + Apple design system.
 */
export function MyBooksView({ pageName = "كتبي" }) {
  const navigate = useNavigate();
  const {
    displayedBooks,
    loading,
    loadingMore,
    page,
    totalPages,
    totalElements,
    status,
    searchQuery,
    setSearchQuery,
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
    handleSubmitDraft,
  } = useAuthorBooks();

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

          {/* Status Segmented Control (Both Desktop & Mobile) */}
          <div className="ktab-mybooks-status-tabs">
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
          onSubmitClick={handleSubmitDraft}
          onLoadMore={loadMore}
          onCreateNew={() => navigate("/author/new-book")}
          searchQuery={searchQuery}
          isFiltered={Boolean(searchQuery.trim())}
          onResetFilters={resetFilters}
        />

        {/* Book Details Modal (Floating PC card, blur-to-load, scroll lock) */}
        <BookDetailsDrawer
          isOpen={Boolean(selectedBookForDetails)}
          onClose={() => setSelectedBookForDetails(null)}
          book={selectedBookForDetails}
          onSubmit={handleSubmitDraft}
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
