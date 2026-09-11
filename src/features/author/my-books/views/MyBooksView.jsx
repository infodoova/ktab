import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { AuthorBookGrid } from "../components/AuthorBookGrid";
import { BookDetailsDrawer } from "../components/BookDetailsDrawer";
import { DeleteBookModal } from "../components/DeleteBookModal";
import { useAuthorBooks } from "../hooks/useAuthorBooks";
import { Plus } from "lucide-react";

/**
 * Pure presentation view for Author's books library.
 */
export function MyBooksView({ pageName = "كتبي" }) {
  const navigate = useNavigate();
  const {
    books,
    loading,
    loadingMore,
    page,
    totalPages,
    status,
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

  const headerActions = (
    <button
      onClick={() => navigate("/author/new-book")}
      className="btn-premium px-5 py-2.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
    >
      <Plus size={16} />
      <span>رفع كتاب جديد</span>
    </button>
  );

  return (
    <AppLayout pageName={pageName} showSearch={false} headerActions={headerActions}>
      <div className="space-y-8" dir="rtl">
        {/* Status Tabs */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-black/5">
            <button
              onClick={() => handleStatusChange("PUBLISHED")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                status === "PUBLISHED"
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              الكتب المنشورة
            </button>
            <button
              onClick={() => handleStatusChange("DRAFT")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                status === "DRAFT"
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              المسودات
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <AuthorBookGrid
          books={books}
          loading={loading}
          loadingMore={loadingMore}
          page={page}
          totalPages={totalPages}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onBookClick={setSelectedBookForDetails}
          onDeleteClick={setBookToDelete}
          onLoadMore={loadMore}
        />

        {/* Book Details Drawer */}
        <BookDetailsDrawer
          isOpen={Boolean(selectedBookForDetails)}
          onClose={() => setSelectedBookForDetails(null)}
          book={selectedBookForDetails}
        />

        {/* Delete Confirmation Modal */}
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
