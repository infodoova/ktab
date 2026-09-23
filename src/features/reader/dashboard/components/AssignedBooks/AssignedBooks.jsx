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
  Headphones,
  Star,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useAssignedBooks } from "./useAssignedBooks";
import "./AssignedBooks.css";

/**
 * Individual Assigned Book Card with independent cover loading & error handling.
 * Standardized with unified 3:4 cover, floating footer pills, and 3-line body.
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
  const authorName =
    (book.customAuthorName && book.customAuthorName.trim()) ||
    (book.authorName && book.authorName.trim()) ||
    (book.author && book.author.trim()) ||
    "مؤلف غير محدد";
  const genreLabel =
    book.mainGenreName && book.subGenreName && book.mainGenreName.trim() !== book.subGenreName.trim()
      ? `${book.mainGenreName.trim()} / ${book.subGenreName.trim()}`
      : (book.mainGenreName && book.mainGenreName.trim()) ||
        (book.subGenreName && book.subGenreName.trim()) ||
        (book.genre && book.genre.trim()) ||
        "";
  const hasAudio = Boolean(book.hasAudio);
  const rating = Number(book.averageRating) || 0;
  const isDraft = String(book.status || "").toUpperCase() === "DRAFT" || Boolean(book.isDraft);

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

        {/* Top-Right: Draft Badge */}
        {isDraft && (
          <div className="ktab-assigned-card__top-badges">
            <span className="ktab-assigned-card__draft-badge">مسودة</span>
          </div>
        )}

        {/* More Options Button & Dropdown */}
        <div className="ktab-assigned-card__menu-area" onClick={(e) => e.stopPropagation()}>
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

        {/* Floating Cover Footer */}
        <div className="ktab-assigned-card__cover-footer">
          <div className="ktab-assigned-card__footer-pill" title={`التقييم: ${rating.toFixed(1)}`}>
            <Star size={11} className="ktab-assigned-card__star-icon" />
            <span>{rating.toFixed(1)}</span>
          </div>

          <div
            className={`ktab-assigned-card__footer-pill ${
              hasAudio
                ? "ktab-assigned-card__footer-pill--audio-active"
                : "ktab-assigned-card__footer-pill--audio-inactive"
            }`}
            title={hasAudio ? "يتوفر نسخة صوتية" : "نسخة نصية فقط"}
          >
            {hasAudio ? <Headphones size={11} /> : <BookOpen size={11} />}
            <span>{hasAudio ? "صوتي" : "نصي"}</span>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div
        className="ktab-assigned-card__body"
        onClick={() => onSelectBook(book)}
      >
        {genreLabel && (
          <span className="ktab-assigned-card__genre" title={genreLabel}>
            {genreLabel}
          </span>
        )}
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
