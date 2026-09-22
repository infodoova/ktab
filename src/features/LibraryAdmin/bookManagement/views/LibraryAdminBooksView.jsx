import React from "react";
import { BookCopy, Search, X } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { useLibraryAdminBooks } from "../hooks/useLibraryAdminBooks";
import { LibraryAdminBookCard } from "../components/LibraryAdminBookCard";
import { BookDeleteModal } from "../components/BookDeleteModal";
import { BookDetailsDrawer } from "../components/BookDetailsDrawer";
import "./LibraryAdminBooksView.css";

/**
 * Library Admin Book Management View.
 * Displays all organization books with titlebar search,
 * left-side slide-over book inspection, and exclusive deletion capabilities.
 */
export default function LibraryAdminBooksView() {
  const {
    books,
    loading,
    searchQuery,
    setSearchQuery,
    bookToDelete,
    setBookToDelete,
    selectedBook,
    setSelectedBook,
    refreshBooks,
  } = useLibraryAdminBooks();

  return (
    <AppLayout
      pageName="إدارة الكتب"
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في كتب المكتبة بالعنوان، المؤلف، أو التصنيف..."
    >
      <div className="ktab-admin-books-view" dir="rtl">
        {/* Content States: Loading / Empty / Grid */}
        {loading ? (
          <div className="ktab-admin-books-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ktab-admin-books-skeleton-item">
                <div className="ktab-admin-books-skeleton-cover" />
                <div className="ktab-admin-books-skeleton-line ktab-admin-books-skeleton-line--long" />
                <div className="ktab-admin-books-skeleton-line ktab-admin-books-skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="ktab-admin-books-empty">
            <div className="ktab-admin-books-empty-icon">
              {searchQuery ? <Search size={28} /> : <BookCopy size={28} />}
            </div>
            <h3 className="ktab-admin-books-empty-title">
              {searchQuery
                ? `لم يتم العثور على نتائج مطابقة لـ «${searchQuery}»`
                : "لا توجد كتب في مكتبة المؤسسة حتى الآن"}
            </h3>
            <p className="ktab-admin-books-empty-desc">
              {searchQuery
                ? "تأكد من كتابة عنوان الكتاب أو اسم المؤلف بشكل صحيح أو جرب كلمات بحث أخرى."
                : "ستظهر هنا جميع الكتب المفهرسة والتابعة لمؤسستك بمجرد إضافتها من قبل أمناء المكتبة."}
            </p>
            {searchQuery && (
              <Button
                variant="secondary"
                icon={<X size={15} />}
                onClick={() => setSearchQuery("")}
              >
                مسح البحث
              </Button>
            )}
          </div>
        ) : (
          <div className="ktab-admin-books-grid">
            {books.map((book) => (
              <LibraryAdminBookCard
                key={book.id}
                book={book}
                onDetails={(b) => setSelectedBook(b)}
                onDelete={(b) => setBookToDelete(b)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {bookToDelete && (
          <BookDeleteModal
            isOpen={Boolean(bookToDelete)}
            book={bookToDelete}
            onClose={() => setBookToDelete(null)}
            onSuccess={refreshBooks}
          />
        )}

        {/* Book Details Slide-Over Drawer (Left Side) */}
        {selectedBook && (
          <BookDetailsDrawer
            isOpen={Boolean(selectedBook)}
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onDelete={(b) => setBookToDelete(b)}
          />
        )}
      </div>
    </AppLayout>
  );
}
