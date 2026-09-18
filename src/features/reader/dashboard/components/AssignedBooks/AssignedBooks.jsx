import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  BookOpen,
  BookMarked,
  Trash2,
  Eye,
  Compass,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useAssignedBooks } from "./useAssignedBooks";
import "./AssignedBooks.css";

/**
 * Individual Assigned Book Card with independent cover loading & error handling.
 */
function AssignedBookCard({
  book,
  isMenuOpen,
  onToggleMenu,
  onSelectBook,
  onReadBook,
  onRemoveBook,
}) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  const coverSrc = book.coverImageUrl || book.cover;
  const bookTitle = book.title || "بدون عنوان";
  const authorName = book.author || book.authorName || "مؤلف غير محدد";

  return (
    <article className="ktab-assigned-card">
      {/* 3D Cover */}
      <div
        className="ktab-assigned-card__cover-wrap"
        onClick={() => onSelectBook(book)}
      >
        {!coverSrc || hasCoverError ? (
          <div
            className="ktab-assigned-card__fallback-cover"
            role="img"
            aria-label={bookTitle}
          >
            <img
              src={brandIconImg}
              alt=""
              className="ktab-assigned-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-assigned-card__image-container">
            {!coverLoaded && <div className="ktab-assigned-card__cover-shimmer" />}
            <img
              src={coverSrc}
              alt={bookTitle}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setHasCoverError(true)}
              className={`ktab-assigned-card__img ${
                coverLoaded
                  ? "ktab-assigned-card__img--loaded"
                  : "ktab-assigned-card__img--loading"
              }`}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>

      {/* More Options Button & Dropdown */}
      <div className="ktab-assigned-card__menu-area">
        <button
          type="button"
          onClick={(e) => onToggleMenu(book.id, e)}
          className="ktab-assigned-card__menu-btn"
          aria-label="خيارات إضافية"
          title="خيارات إضافية"
        >
          <MoreVertical size={14} strokeWidth={2.4} />
        </button>

        {isMenuOpen && (
          <div className="ktab-assigned-card__menu-popover" role="menu">
            <button
              type="button"
              onClick={() => onReadBook(book)}
              className="ktab-assigned-card__menu-item"
              role="menuitem"
            >
              <BookOpen size={14} strokeWidth={2.2} />
              <span>قراءة الكتاب</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectBook(book)}
              className="ktab-assigned-card__menu-item"
              role="menuitem"
            >
              <Eye size={14} strokeWidth={2.2} />
              <span>عرض التفاصيل</span>
            </button>
            <button
              type="button"
              onClick={(e) => onRemoveBook(book.id, e)}
              className="ktab-assigned-card__menu-item ktab-assigned-card__menu-item--danger"
              role="menuitem"
            >
              <Trash2 size={14} strokeWidth={2.2} />
              <span>إزالة من المفضلة</span>
            </button>
          </div>
        )}
      </div>

      {/* Info Text */}
      <div
        className="ktab-assigned-card__body"
        onClick={() => onSelectBook(book)}
      >
        <h3 className="ktab-assigned-card__title" title={bookTitle}>
          {bookTitle}
        </h3>
        <p className="ktab-assigned-card__author" title={authorName}>
          {authorName}
        </p>
      </div>
    </article>
  );
}

/**
 * Reader's Saved / Favorites shelf with carousel navigation and action menu.
 */
export function AssignedBooks({
  books = [],
  loading = false,
  onRemoveBook,
}) {
  const {
    trackRef,
    openMenuId,
    toggleMenu,
    handleScrollNext,
    handleScrollPrev,
    handleSelectBook,
    handleReadBook,
    handleRemove,
    handleBrowseLibrary,
  } = useAssignedBooks({ books, onRemoveBook });

  return (
    <section className="ktab-assigned-shelf" dir="rtl" aria-label="مكتبتي والمفضلة">
      <div className="ktab-assigned-shelf__header">
        <div className="ktab-assigned-shelf__title-wrap">
          <h2 className="ktab-assigned-shelf__heading">مكتبتي والمفضلة</h2>
          {books.length > 0 && (
            <span className="ktab-assigned-shelf__count">({books.length})</span>
          )}
        </div>

        {books.length > 3 && (
          <div className="ktab-assigned-shelf__controls" aria-label="أزرار التمرير">
            <button
              type="button"
              onClick={handleScrollPrev}
              className="ktab-assigned-shelf__arrow-btn"
              aria-label="السابق"
              title="السابق"
            >
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={handleScrollNext}
              className="ktab-assigned-shelf__arrow-btn"
              aria-label="التالي"
              title="التالي"
            >
              <ChevronLeft size={16} strokeWidth={2.4} />
            </button>
          </div>
        )}
      </div>

      {books.length === 0 && !loading ? (
        <div className="ktab-assigned-empty">
          <div className="ktab-assigned-empty__icon-wrap" aria-hidden="true">
            <BookMarked size={22} strokeWidth={2} />
          </div>
          <p className="ktab-assigned-empty__text">
            لم تقم بحفظ أي كتب في مكتبتك المفضلة بعد.
          </p>
          <button
            type="button"
            onClick={handleBrowseLibrary}
            className="ktab-assigned-empty__btn"
          >
            <Compass size={15} strokeWidth={2.2} />
            <span>تصفح المكتبة واكتشف الكتب</span>
          </button>
        </div>
      ) : (
        <div ref={trackRef} className="ktab-assigned-shelf__track">
          {books.map((book) => (
            <AssignedBookCard
              key={book.id || book.bookId}
              book={book}
              isMenuOpen={openMenuId === book.id}
              onToggleMenu={toggleMenu}
              onSelectBook={handleSelectBook}
              onReadBook={handleReadBook}
              onRemoveBook={handleRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default AssignedBooks;
