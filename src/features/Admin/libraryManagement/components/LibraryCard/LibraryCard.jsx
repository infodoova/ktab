import React from "react";
import {
  LibraryBig,
  MapPin,
  BookOpen,
  Users,
  MoreVertical,
  Edit3,
  Trash2,
  UserCheck,
  Phone,
  Mail,
} from "lucide-react";
import { useLibraryCard } from "../../hooks/useLibraryCard";
import "./LibraryCard.css";

/**
 * Editorial, Clean, and Minimal Library Card Component.
 * Clicking anywhere on the card opens the full details popup on the left side.
 * Edit and Delete are neatly contained inside the 3-dots option menu.
 */
export function LibraryCard({ library, onCardClick, onEdit, onDelete }) {
  const {
    isMenuOpen,
    menuRef,
    isActive,
    toggleMenu,
    handleEditClick,
    handleDeleteClick,
  } = useLibraryCard({ library, onEdit, onDelete });

  if (!library) return null;

  const admin = library.admin;

  return (
    <article
      className="ktab-lib-card"
      dir="rtl"
      onClick={() => onCardClick?.(library)}
    >
      <div className="ktab-lib-card__body">
        {/* Top Header Row */}
        <div className="ktab-lib-card__header">
          <div className="ktab-lib-card__title-group">
            <div className="ktab-lib-card__icon-wrapper">
              <LibraryBig size={20} />
            </div>
            <div>
              <h3 className="ktab-lib-card__name" title={library.name}>
                {library.name}
              </h3>
              <p className="ktab-lib-card__location">
                <MapPin size={12} />
                <span>
                  {library.city}
                  {library.country ? `، ${library.country}` : ""}
                </span>
              </p>
            </div>
          </div>

          <div className="ktab-lib-card__header-right">
            {/* 3-Dots Options Menu */}
            <div className="ktab-lib-card__menu-container" ref={menuRef}>
              <button
                type="button"
                className="ktab-lib-card__menu-btn"
                onClick={toggleMenu}
                aria-label="خيارات المكتبة"
                title="خيارات"
              >
                <MoreVertical size={17} />
              </button>

              {isMenuOpen && (
                <div className="ktab-lib-card__dropdown">
                  <button
                    type="button"
                    className="ktab-lib-card__dropdown-item"
                    onClick={handleEditClick}
                  >
                    <Edit3 size={14} />
                    <span>تعديل</span>
                  </button>
                  <button
                    type="button"
                    className="ktab-lib-card__dropdown-item ktab-lib-card__dropdown-item--delete"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="ktab-lib-card__description">
          {library.description || "لا يوجد وصف مدخل لهذه المكتبة حالياً."}
        </p>

        {/* Quick Contacts — plain inline row with icons */}
        {(library.phone || library.email) && (
          <div className="ktab-lib-card__contact-row">
            {library.phone && (
              <span className="ktab-lib-card__contact-inline" dir="ltr">
                <Phone size={11} />
                {library.phone}
              </span>
            )}
            {library.phone && library.email && (
              <span className="ktab-lib-card__contact-sep">|</span>
            )}
            {library.email && (
              <span className="ktab-lib-card__contact-inline">
                <Mail size={11} />
                {library.email}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer Row */}
      <div className="ktab-lib-card__meta-row">
        <div className="ktab-lib-card__stat-pills">
          <span className="ktab-lib-card__stat-pill" title="إجمالي الكتب">
            <BookOpen size={13} />
            <span>{(library.totalBooks ?? 0).toLocaleString("en")}</span>
          </span>

          <span className="ktab-lib-card__stat-sep">|</span>

          <span className="ktab-lib-card__stat-pill" title="طاقم العمل">
            <Users size={13} />
            <span>{(library.totalStaff ?? 0).toLocaleString("en")}</span>
          </span>
        </div>

        {admin && (
          <div
            className="ktab-lib-card__admin-chip-mini"
            title={`المشرف: ${admin.fullName || admin.email}`}
          >
            <UserCheck size={14} />
            <span>{admin.fullName || admin.email}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default LibraryCard;
