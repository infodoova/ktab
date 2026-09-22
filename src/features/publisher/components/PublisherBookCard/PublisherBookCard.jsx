import React from "react";
import {
  MoreVertical,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Headphones,
  BookOpen,
  FileText,
  Star,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { usePublisherBookCard } from "../../hooks/usePublisherBookCard";
import "./PublisherBookCard.css";

/**
 * Editorial Apple-inspired Publisher Review Queue Book Card.
 * Adheres strictly to the unified Pro Card Display System:
 * 3:4 proportion cover box, optical pill centering, 3-line body (genre -> title -> author),
 * and zero description on card.
 */
export function PublisherBookCard({ book, onDetails, onApprove, onReject }) {
  const {
    isMenuOpen,
    menuRef,
    coverLoaded,
    hasCoverError,
    downloading,
    authorDisplayName,
    genreLabel,
    setCoverLoaded,
    setHasCoverError,
    toggleMenu,
    handleDetailsClick,
    handleApproveClick,
    handleRejectClick,
    handleDownloadSource,
    handleKeyDown,
  } = usePublisherBookCard({ book, onDetails, onApprove, onReject });

  if (!book) return null;

  const coverUrl = book.coverImageUrl;
  const isDraft = String(book.status || "").toUpperCase() === "DRAFT";
  const rating = Number(book.averageRating) || 0;

  return (
    <article className="ktab-pub-book-card" dir="rtl">
      {/* 3:4 Proportional Book Cover Box */}
      <div
        className="ktab-pub-book-card__cover-wrap"
        onClick={handleDetailsClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {!coverUrl || hasCoverError ? (
          <div className="ktab-pub-book-card__fallback-cover" aria-label={book.title}>
            <img
              src={brandIconImg}
              alt=""
              className="ktab-pub-book-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-pub-book-card__image-box">
            {!coverLoaded && <div className="ktab-pub-book-card__shimmer" />}
            <img
              src={coverUrl}
              alt={book.title || "كتاب"}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setHasCoverError(true)}
              className={`ktab-pub-book-card__img ${
                coverLoaded
                  ? "ktab-pub-book-card__img--loaded"
                  : "ktab-pub-book-card__img--loading"
              }`}
              loading="lazy"
            />
          </div>
        )}

        {/* Top-Right: Status Badge */}
        {isDraft && (
          <div className="ktab-pub-book-card__top-badges">
            <span className="ktab-pub-book-card__draft-badge">مسودة</span>
          </div>
        )}

        {/* Action Menu (Top-Left) */}
        <div className="ktab-pub-book-card__menu-anchor" ref={menuRef}>
          <button
            type="button"
            onClick={toggleMenu}
            className="ktab-pub-book-card__menu-btn"
            aria-label="خيارات المراجعة"
            title="خيارات"
          >
            <MoreVertical size={14} />
          </button>

          {isMenuOpen && (
            <div
              className="ktab-pub-book-card__dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDetailsClick}
                className="ktab-pub-book-card__dropdown-item"
              >
                <Eye size={14} />
                <span>فحص ومراجعة الكتاب</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSource}
                disabled={downloading}
                className="ktab-pub-book-card__dropdown-item"
              >
                <Download size={14} />
                <span>{downloading ? "جاري التجهيز..." : "تنزيل ملف الكتاب"}</span>
              </button>

              <button
                type="button"
                onClick={handleApproveClick}
                className="ktab-pub-book-card__dropdown-item ktab-pub-book-card__dropdown-item--approve"
              >
                <CheckCircle size={14} />
                <span>قبول ونشر الكتاب</span>
              </button>

              <button
                type="button"
                onClick={handleRejectClick}
                className="ktab-pub-book-card__dropdown-item ktab-pub-book-card__dropdown-item--danger"
              >
                <XCircle size={14} />
                <span>إعادة كمسودة مع ملاحظة</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Cover Footer */}
        <div className="ktab-pub-book-card__cover-footer">
          {book.pageCount ? (
            <div className="ktab-pub-book-card__pill" title={`${book.pageCount} صفحة`}>
              <FileText size={11} />
              <span>{book.pageCount} صفحة</span>
            </div>
          ) : rating > 0 ? (
            <div className="ktab-pub-book-card__pill" title={`التقييم: ${rating.toFixed(1)}`}>
              <Star size={11} className="ktab-pub-book-card__star-icon" />
              <span>{rating.toFixed(1)}</span>
            </div>
          ) : null}

          <div
            className={`ktab-pub-book-card__pill ${
              book.hasAudio
                ? "ktab-pub-book-card__pill--audio-active"
                : "ktab-pub-book-card__pill--audio-inactive"
            }`}
            title={book.hasAudio ? "نسخة صوتية" : "نسخة نصية"}
          >
            {book.hasAudio ? <Headphones size={11} /> : <BookOpen size={11} />}
            <span>{book.hasAudio ? "صوتي" : "نصي"}</span>
          </div>
        </div>
      </div>

      {/* Book Metadata Body */}
      <div className="ktab-pub-book-card__body">
        {genreLabel && (
          <span className="ktab-pub-book-card__genre" title={genreLabel}>
            {genreLabel}
          </span>
        )}
        <h3
          className="ktab-pub-book-card__title"
          title={book.title}
          onClick={handleDetailsClick}
        >
          {book.title}
        </h3>
        <p className="ktab-pub-book-card__author" title={authorDisplayName}>
          {authorDisplayName}
        </p>

        {/* Visible Accept & Reject Actions Outside Card Menu */}
        <div className="ktab-pub-book-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleApproveClick}
            className="ktab-pub-book-card__action-btn ktab-pub-book-card__action-btn--approve"
            title="اعتماد وقبول الكتاب للنشر"
          >
            <CheckCircle size={14} strokeWidth={2.4} />
            <span>قبول</span>
          </button>

          <button
            type="button"
            onClick={handleRejectClick}
            className="ktab-pub-book-card__action-btn ktab-pub-book-card__action-btn--reject"
            title="رفض وإعادة الكتاب كمسودة"
          >
            <XCircle size={14} strokeWidth={2.4} />
            <span>رفض</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default PublisherBookCard;
