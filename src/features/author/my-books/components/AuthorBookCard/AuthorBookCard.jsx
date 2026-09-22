import React from "react";
import { MoreVertical, Trash2, Edit, Eye, Star, Headphones } from "lucide-react";
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
}) {
  const {
    coverUrl,
    isDraft,
    isOpen,
    coverLoaded,
    hasCoverError,
    ratingText,
    hasAudio,
    languageLabel,
    genreLabel,
    authorDisplayName,
    handleCoverLoad,
    handleCoverError,
    toggleMenu,
    handleDetailsClick,
    handleEditClick,
    handleDeleteClick,
    handleKeyDown,
  } = useAuthorBookCard({
    book,
    openMenuId,
    setOpenMenuId: setOpenMenuId || (onToggleMenu ? (id) => onToggleMenu(id) : undefined),
    isMenuOpen,
    onClick: onBookClick || onCardClick || onClick,
    onDelete: onDeleteClick || onDelete,
  });

  return (
    <div
      onClick={handleDetailsClick}
      className="ktab-book-card"
      dir="rtl"
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Cover Image + Floating Menu Actions */}
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
              alt={book?.title || "كتاب"}
              onLoad={handleCoverLoad}
              onError={handleCoverError}
              className={`ktab-book-card__cover-img ${
                coverLoaded
                  ? "ktab-book-card__cover-img--loaded"
                  : "ktab-book-card__cover-img--loading"
              }`}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* Top-Right: Draft and Language Badges */}
        <div className="ktab-book-card__top-badges">
          {isDraft && (
            <span className="ktab-book-card__draft-badge">مسودة</span>
          )}
          <span className="ktab-book-card__lang-badge">{languageLabel}</span>
        </div>

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

              {isDraft && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="ktab-book-card__menu-item"
                >
                  <span>تعديل الكتاب</span>
                  <Edit size={13} />
                </button>
              )}

              <button
                type="button"
                onClick={handleDeleteClick}
                className="ktab-book-card__menu-item ktab-book-card__menu-item--danger"
              >
                <span>حذف الكتاب</span>
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Floating Cover Bar: Rating & Audio */}
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
            <Headphones size={11} />
            <span>{hasAudio ? "صوتي" : "نصي"}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="ktab-book-card__body">
        <h4 className="ktab-book-card__title" title={book?.title}>
          {book?.title}
        </h4>
        <p
          className="ktab-book-card__author"
          title={`${authorDisplayName} • ${genreLabel}`}
        >
          {genreLabel} • {authorDisplayName}
        </p>
      </div>
    </div>
  );
});

export default AuthorBookCard;
