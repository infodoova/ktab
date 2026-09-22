import React from "react";
import { UserRound, Mail, MoreVertical, Edit3, Trash2, Hash, ShieldCheck } from "lucide-react";
import { usePublisherCard } from "../../hooks/usePublisherCard";
import "./PublisherCard.css";

/**
 * Editorial, Compact Publisher Card Component.
 * Minimalist and refined representation of an individual publisher account.
 */
export function PublisherCard({ publisher, onEdit, onDelete }) {
  const {
    isMenuOpen,
    menuRef,
    toggleMenu,
    handleEditClick,
    handleDeleteClick,
  } = usePublisherCard({ publisher, onEdit, onDelete });

  if (!publisher) return null;

  const displayName =
    publisher.fullName ||
    [publisher.firstName, publisher.middleName, publisher.lastName]
      .filter(Boolean)
      .join(" ") ||
    "ناشر غير معنون";

  const roleLabel =
    publisher.role === "40" || publisher.role === "PUBLISHER"
      ? "ناشر"
      : publisher.role || "ناشر";

  return (
    <article className="ktab-pub-card" dir="rtl">
      <div className="ktab-pub-card__body">
        {/* Header Row */}
        <div className="ktab-pub-card__header">
          <div className="ktab-pub-card__title-group">
            <div className="ktab-pub-card__icon-wrapper">
              <UserRound size={17} />
            </div>
            <div className="ktab-pub-card__meta">
              <h3 className="ktab-pub-card__name" title={displayName}>
                {displayName}
              </h3>
              <p className="ktab-pub-card__role">
                <ShieldCheck size={11} />
                <span>{roleLabel}</span>
              </p>
            </div>
          </div>

          <div className="ktab-pub-card__menu-container" ref={menuRef}>
            <button
              type="button"
              className="ktab-pub-card__menu-btn"
              onClick={toggleMenu}
              aria-label="خيارات الناشر"
              title="خيارات"
            >
              <MoreVertical size={17} />
            </button>

            {isMenuOpen && (
              <div className="ktab-pub-card__dropdown">
                <button
                  type="button"
                  className="ktab-pub-card__dropdown-item"
                  onClick={handleEditClick}
                >
                  <Edit3 size={14} />
                  <span>تعديل الحساب</span>
                </button>
                <button
                  type="button"
                  className="ktab-pub-card__dropdown-item ktab-pub-card__dropdown-item--delete"
                  onClick={handleDeleteClick}
                >
                  <Trash2 size={14} />
                  <span>حذف الحساب</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Rows */}
        <div className="ktab-pub-card__info-section">
          <div className="ktab-pub-card__info-row" title="البريد الإلكتروني">
            <Mail size={13} />
            <span className="ktab-pub-card__email" dir="ltr">
              {publisher.email || "لا يوجد بريد مسجل"}
            </span>
          </div>

          <div className="ktab-pub-card__info-row" title="معرف الحساب">
            <Hash size={13} />
            <span>معرف الناشر: #{publisher.id}</span>
          </div>
        </div>
      </div>

    </article>
  );
}

export default PublisherCard;
