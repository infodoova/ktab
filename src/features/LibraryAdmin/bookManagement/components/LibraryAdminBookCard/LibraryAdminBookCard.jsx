import React from "react";
import {
  MoreVertical,
  Trash2,
  Eye,
  Download,
  Headphones,
  BookOpen,
  Star,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useLibraryAdminBookCard } from "../../hooks/useLibraryAdminBookCard";
import "./LibraryAdminBookCard.css";

/**
 * Editorial Apple-inspired Library Book Card Component.
 * Pure presentation layer backed by useLibraryAdminBookCard hook.
 */
export function LibraryAdminBookCard({ book, onDetails, onDelete }) {
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
    handleDeleteClick,
    handleDownloadSource,
  } = useLibraryAdminBookCard({ book, onDetails, onDelete });

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
    <article className="ktab-lib-book-card" dir="rtl">
      {/* 3:4 Proportion Book Cover Box */}
      <div
        className="ktab-lib-book-card__cover-wrap"
        onClick={handleDetailsClick}
        role="button"
        tabIndex={0}
      >
        {!coverUrl || hasCoverError ? (
          <div className="ktab-lib-book-card__fallback-cover" aria-label={book.title}>
            <img
              src={brandIconImg}
              alt=""
              className="ktab-lib-book-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-lib-book-card__image-box">
            {!coverLoaded && <div className="ktab-lib-book-card__shimmer" />}
            <img
              src={coverUrl}
              alt={book.title || "كتاب"}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setHasCoverError(true)}
              className={`ktab-lib-book-card__img ${
                coverLoaded
                  ? "ktab-lib-book-card__img--loaded"
                  : "ktab-lib-book-card__img--loading"
              }`}
              loading="lazy"
            />
          </div>
        )}



        {/* Top-Right: Status Badge */}
        {isDraft && (
          <div className="ktab-lib-book-card__top-badges">
            <span className="ktab-lib-book-card__draft-badge">مسودة</span>
          </div>
        )}

        {/* Action Menu (Top-Left) */}
        <div className="ktab-lib-book-card__menu-anchor" ref={menuRef}>
          <button
            type="button"
            onClick={toggleMenu}
            className="ktab-lib-book-card__menu-btn"
            aria-label="خيارات الكتاب"
            title="خيارات"
          >
            <MoreVertical size={14} />
          </button>

          {isMenuOpen && (
            <div
              className="ktab-lib-book-card__dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDetailsClick}
                className="ktab-lib-book-card__dropdown-item"
              >
                <Eye size={14} />
                <span>عرض تفاصيل الكتاب</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSource}
                disabled={downloading}
                className="ktab-lib-book-card__dropdown-item"
              >
                <Download size={14} />
                <span>{downloading ? "جاري التجهيز..." : "تنزيل ملف الكتاب"}</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
                className="ktab-lib-book-card__dropdown-item ktab-lib-book-card__dropdown-item--danger"
              >
                <Trash2 size={14} />
                <span>حذف الكتاب من المكتبة</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Cover Footer */}
        <div className="ktab-lib-book-card__cover-footer">
          <div className="ktab-lib-book-card__pill" title={`التقييم: ${Number(book.averageRating || 0).toFixed(1)}`}>
            <Star size={11} className="ktab-lib-book-card__star-icon" />
            <span>{Number(book.averageRating || 0).toFixed(1)}</span>
          </div>

          <div
            className={`ktab-lib-book-card__pill ${
              book.hasAudio
                ? "ktab-lib-book-card__pill--audio-active"
                : "ktab-lib-book-card__pill--audio-inactive"
            }`}
            title={book.hasAudio ? "نسخة صوتية" : "نسخة نصية"}
          >
            {book.hasAudio ? <Headphones size={11} /> : <BookOpen size={11} />}
            <span>{book.hasAudio ? "صوتي" : "نصي"}</span>
          </div>
        </div>
      </div>

      {/* Book Metadata Body */}
      <div className="ktab-lib-book-card__body">
        {genreLabel && (
          <span className="ktab-lib-book-card__genre" title={genreLabel}>
            {genreLabel}
          </span>
        )}
        <h3
          className="ktab-lib-book-card__title"
          title={book.title}
          onClick={handleDetailsClick}
        >
          {book.title}
        </h3>
        <p className="ktab-lib-book-card__author" title={authorDisplayName}>
          {authorDisplayName}
        </p>
      </div>
    </article>
  );
}

export default LibraryAdminBookCard;
