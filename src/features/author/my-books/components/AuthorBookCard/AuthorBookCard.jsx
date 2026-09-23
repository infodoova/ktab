import React from "react";
import {
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Send,
  Star,
  Headphones,
  BookOpen,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useAuthorBookCard } from "./useAuthorBookCard";
import "./AuthorBookCard.css";

/**
 * Pure presentation card component for author books.
 */
export const AuthorBookCard = React.memo(function AuthorBookCard({
  book,
  openMenuId,
  setOpenMenuId,
  isMenuOpen,
  onToggleMenu,
  onBookClick,
  onCardClick,
  onClick,
  onDeleteClick,
  onDelete,
  onSubmitClick,
  onSubmit,
}) {
  const {
    coverUrl,
    isDraft,
    isPendingApproval,
    isOpen,
    coverLoaded,
    hasCoverError,
    ratingText,
    hasAudio,
    genreLabel,
    authorDisplayName,
    handleCoverLoad,
    handleCoverError,
    toggleMenu,
    handleDetailsClick,
    handleEditClick,
    handleSubmitClick,
    handleDeleteClick,
    handleKeyDown,
  } = useAuthorBookCard({
    book,
    openMenuId,
    setOpenMenuId: setOpenMenuId || (onToggleMenu ? (id) => onToggleMenu(id) : undefined),
    isMenuOpen,
    onClick: onBookClick || onCardClick || onClick,
    onDelete: onDeleteClick || onDelete,
    onSubmit: onSubmitClick || onSubmit,
  });

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`كتاب: ${book.title || "بدون عنوان"}`}
      className={`ktab-book-card ${isDraft ? "ktab-book-card--draft" : ""}`}
      onClick={handleDetailsClick}
      onKeyDown={handleKeyDown}
    >
      {/* Visual Cover Stage */}
      <div className="ktab-book-card__cover-wrap">
        {!coverUrl || hasCoverError ? (
          <div
            className="ktab-book-card__fallback-cover"
            role="img"
            aria-label={book?.title || "كتاب"}
          >
            <img
              src={brandIconImg}
              alt=""
              className="ktab-book-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-book-card__image-container">
            {!coverLoaded && <div className="ktab-book-card__cover-shimmer" />}
            <img
              src={coverUrl}
              alt={book.title || "غلاف الكتاب"}
              className={`ktab-book-card__cover-img ${
                coverLoaded
                  ? "ktab-book-card__cover-img--loaded"
                  : "ktab-book-card__cover-img--loading"
              }`}
              loading="lazy"
              decoding="async"
              onLoad={handleCoverLoad}
              onError={handleCoverError}
            />
          </div>
        )}

        {/* Top-Right: Status Badge */}
        {isDraft && (
          <div className="ktab-book-card__top-badges">
            <span className="ktab-book-card__draft-badge">مسودة</span>
          </div>
        )}
        {isPendingApproval && (
          <div className="ktab-book-card__top-badges">
            <span className="ktab-book-card__pending-badge">قيد المراجعة</span>
          </div>
        )}

        {/* Top-Left: Menu Actions */}
        <div className="ktab-book-card__menu-anchor book-menu-area">
          <button
            type="button"
            onClick={toggleMenu}
            className="ktab-book-card__menu-btn"
            aria-label="خيارات الكتاب"
            title="خيارات"
          >
            <MoreVertical size={14} />
          </button>

          {isOpen && (
            <div
              className="ktab-book-card__menu-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDetailsClick}
                className="ktab-book-card__menu-item"
              >
                <span>عرض التفاصيل</span>
                <Eye size={13} />
              </button>

              {isDraft && !isPendingApproval && (
                <>
                  <button
                    type="button"
                    onClick={handleSubmitClick}
                    className="ktab-book-card__menu-item ktab-book-card__menu-item--submit"
                    title="نشر الكتاب وإرساله للمراجعة"
                  >
                    <span>نشر الكتاب</span>
                    <Send size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="ktab-book-card__menu-item"
                  >
                    <span>تعديل الكتاب</span>
                    <Edit size={13} />
                  </button>
                </>
              )}

              {!isPendingApproval && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="ktab-book-card__menu-item ktab-book-card__menu-item--danger"
                >
                  <span>حذف الكتاب</span>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Floating Cover Bar: Specs & Audio */}
        <div className="ktab-book-card__cover-footer">
          <div className="ktab-book-card__footer-pill" title={`التقييم: ${ratingText}`}>
            <Star size={11} className="ktab-book-card__star-icon" />
            <span>{ratingText}</span>
          </div>

          <div
            className={`ktab-book-card__footer-pill ${
              hasAudio
                ? "ktab-book-card__footer-pill--audio-active"
                : "ktab-book-card__footer-pill--audio-inactive"
            }`}
            title={hasAudio ? "يتوفر نسخة صوتية" : "نسخة نصية فقط"}
          >
            {hasAudio ? <Headphones size={11} /> : <BookOpen size={11} />}
            <span>{hasAudio ? "صوتي" : "نصي"}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="ktab-book-card__body">
        {genreLabel && (
          <span className="ktab-book-card__genre" title={genreLabel}>
            {genreLabel}
          </span>
        )}
        <h4 className="ktab-book-card__title" title={book?.title}>
          {book?.title}
        </h4>
        <p className="ktab-book-card__author" title={authorDisplayName}>
          {authorDisplayName}
        </p>
      </div>
    </article>
  );
});

export default AuthorBookCard;
