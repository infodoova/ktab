import React from "react";
import { BookCopy, Search, X, Plus } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { useLibrarianBooks } from "../hooks/useLibrarianBooks";
import { LibrarianBookCard } from "../components/LibrarianBookCard";
import { BookDetailsDrawer } from "../components/BookDetailsDrawer";
import "./LibrarianBooksView.css";

/**
 * Librarian Book Management View (Role 30: LIBRARIAN).
 * Features titlebar search, top action to add books, responsive card grid,
 * and left-anchored book inspection drawer.
 */
export default function LibrarianBooksView() {
  const {
    books,
    loading,
    searchQuery,
    setSearchQuery,
    selectedBook,
    setSelectedBook,
    handleOpenCreate,
    handleOpenEdit,
    refreshBooks,
  } = useLibrarianBooks();


  const headerActions = (
    <button
      type="button"
      onClick={handleOpenCreate}
      className="ktab-topbar__btn-action"
      title="إضافة كتاب جديد"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">إضافة كتاب جديد</span>
    </button>
  );

  return (
    <AppLayout
      pageName="إدارة الكتب"
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في كتب المكتبة بالعنوان، المؤلف، أو التصنيف..."
      headerActions={headerActions}
    >
      <div className="ktab-librarian-books-view" dir="rtl">
        {/* Content States: Loading / Empty / Grid */}
        {loading ? (
          <div className="ktab-librarian-books-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ktab-librarian-books-skeleton-item">
                <div className="ktab-librarian-books-skeleton-cover" />
                <div className="ktab-librarian-books-skeleton-line ktab-librarian-books-skeleton-line--long" />
                <div className="ktab-librarian-books-skeleton-line ktab-librarian-books-skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="ktab-librarian-books-empty">
            <div className="ktab-librarian-books-empty-icon">
              {searchQuery ? <Search size={28} /> : <BookCopy size={28} />}
            </div>
            <h3 className="ktab-librarian-books-empty-title">
              {searchQuery
                ? `لم يتم العثور على نتائج مطابقة لـ «${searchQuery}»`
                : "لا توجد كتب مرفوعة في مكتبتك حتى الآن"}
            </h3>
            <p className="ktab-librarian-books-empty-desc">
              {searchQuery
                ? "تأكد من كتابة عنوان الكتاب أو اسم المؤلف بشكل صحيح أو جرب كلمات بحث أخرى."
                : "يمكنك البدء برفع وإدارة كتب مؤسستك بالضغط على زر «إضافة كتاب جديد» بالأعلى."}
            </p>
            {searchQuery ? (
              <Button
                variant="secondary"
                icon={<X size={15} />}
                onClick={() => setSearchQuery("")}
              >
                مسح البحث
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={<Plus size={15} />}
                onClick={handleOpenCreate}
              >
                إضافة أول كتاب
              </Button>
            )}
          </div>
        ) : (
          <div className="ktab-librarian-books-grid">
            {books.map((book) => (
              <LibrarianBookCard
                key={book.id}
                book={book}
                onDetails={(b) => setSelectedBook(b)}
                onEdit={(b) => handleOpenEdit(b)}
              />
            ))}
          </div>
        )}

        {/* Book Details Slide-Over Drawer (Left Side) */}
        {selectedBook && (
          <BookDetailsDrawer
            isOpen={Boolean(selectedBook)}
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onEdit={(b) => handleOpenEdit(b)}
          />
        )}
      </div>
    </AppLayout>
  );
}
