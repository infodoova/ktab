import React from "react";
import {
  MoreVertical,
  Eye,
  Download,
  Headphones,
  Edit3,
  BookOpen,
  Star,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useLibrarianBookCard } from "../../hooks/useLibrarianBookCard";
import "./LibrarianBookCard.css";

/**
 * Editorial Apple-inspired Librarian Book Card.
 * Displays 3:4 cover with fallback, metadata body, and action dropdown menu.
 */
export function LibrarianBookCard({ book, onDetails, onEdit }) {
  const {
    isMenuOpen,
    menuRef,
    coverLoaded,
    hasCoverError,
    downloading,
    setCoverLoaded,
    setHasCoverError,
    toggleMenu,
    handleDetailsClick,
    handleEditClick,
    handleDownloadSource,
  } = useLibrarianBookCard({ book, onDetails, onEdit });

  if (!book) return null;

  const authorDisplayName =
    (book.customAuthorName && book.customAuthorName.trim()) ||
    (book.authorName && book.authorName.trim()) ||
    "مؤلف غير معروف";

  const genreLabel =
    book.mainGenreName && book.subGenreName && book.mainGenreName.trim() !== book.subGenreName.trim()
      ? `${book.mainGenreName.trim()} / ${book.subGenreName.trim()}`
      : (book.mainGenreName && book.mainGenreName.trim()) ||
        (book.subGenreName && book.subGenreName.trim()) ||
        "";

  const isDraft = String(book.status || "").toUpperCase() === "DRAFT";
  const coverUrl = book.coverImageUrl;

  return (
    <article className="ktab-librarian-book-card" dir="rtl">
      {/* 3:4 Proportion Book Cover Box */}
      <div
        className="ktab-librarian-book-card__cover-wrap"
        onClick={handleDetailsClick}
        role="button"
        tabIndex={0}
      >
        {!coverUrl || hasCoverError ? (
          <div className="ktab-librarian-book-card__fallback-cover" aria-label={book.title}>
            <img
              src={brandIconImg}
              alt=""
              className="ktab-librarian-book-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-librarian-book-card__image-box">
            {!coverLoaded && <div className="ktab-librarian-book-card__shimmer" />}
            <img
              src={coverUrl}
              alt={book.title || "كتاب"}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setHasCoverError(true)}
              className={`ktab-librarian-book-card__img ${
                coverLoaded
                  ? "ktab-librarian-book-card__img--loaded"
                  : "ktab-librarian-book-card__img--loading"
              }`}
              loading="lazy"
            />
          </div>
        )}

        {/* Top-Right: Status Badge */}
        {isDraft && (
          <div className="ktab-librarian-book-card__top-badges">
            <span className="ktab-librarian-book-card__draft-badge">مسودة</span>
          </div>
        )}

        {/* Action Menu (Top-Left) */}
        <div className="ktab-librarian-book-card__menu-anchor" ref={menuRef}>
          <button
            type="button"
            onClick={toggleMenu}
            className="ktab-librarian-book-card__menu-btn"
            aria-label="خيارات الكتاب"
            title="خيارات"
          >
            <MoreVertical size={14} />
          </button>

          {isMenuOpen && (
            <div
              className="ktab-librarian-book-card__dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDetailsClick}
                className="ktab-librarian-book-card__dropdown-item"
              >
                <Eye size={14} />
                <span>عرض تفاصيل الكتاب</span>
              </button>

              <button
                type="button"
                onClick={handleEditClick}
                className="ktab-librarian-book-card__dropdown-item"
              >
                <Edit3 size={14} />
                <span>تعديل بيانات الكتاب</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSource}
                disabled={downloading}
                className="ktab-librarian-book-card__dropdown-item"
              >
                <Download size={14} />
                <span>{downloading ? "جاري التجهيز..." : "تنزيل ملف الكتاب"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Cover Footer */}
        <div className="ktab-librarian-book-card__cover-footer">
          <div className="ktab-librarian-book-card__pill" title={`التقييم: ${Number(book.averageRating || 0).toFixed(1)}`}>
            <Star size={11} className="ktab-librarian-book-card__star-icon" />
            <span>{Number(book.averageRating || 0).toFixed(1)}</span>
          </div>

          <div
            className={`ktab-librarian-book-card__pill ${
              book.hasAudio
                ? "ktab-librarian-book-card__pill--audio-active"
                : "ktab-librarian-book-card__pill--audio-inactive"
            }`}
            title={book.hasAudio ? "نسخة صوتية" : "نسخة نصية"}
          >
            {book.hasAudio ? <Headphones size={11} /> : <BookOpen size={11} />}
            <span>{book.hasAudio ? "صوتي" : "نصي"}</span>
          </div>
        </div>
      </div>

      {/* Book Metadata Body */}
      <div className="ktab-librarian-book-card__body">
        {genreLabel && (
          <span className="ktab-librarian-book-card__genre" title={genreLabel}>
            {genreLabel}
          </span>
        )}
        <h3
          className="ktab-librarian-book-card__title"
          title={book.title}
          onClick={handleDetailsClick}
        >
          {book.title}
        </h3>
        <p className="ktab-librarian-book-card__author" title={authorDisplayName}>
          {authorDisplayName}
        </p>
      </div>
    </article>
  );
}

export default LibrarianBookCard;
