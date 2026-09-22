import React from "react";
import { UserRound, Mail, MoreVertical, Trash2, Hash, ShieldCheck, Building2 } from "lucide-react";
import { useStaffCard } from "../../hooks/useStaffCard";
import "./StaffCard.css";

/**
 * Editorial, Compact Library Staff Card Component.
 * Displays staff member credentials and organization association.
 */
export function StaffCard({ member, onDelete }) {
  const { isMenuOpen, menuRef, toggleMenu, handleDeleteClick } = useStaffCard({
    member,
    onDelete,
  });

  if (!member) return null;

  const displayName =
    member.fullName ||
    [member.firstName, member.middleName, member.lastName].filter(Boolean).join(" ") ||
    "موظف غير معنون";

  const rawRole = String(member.roleCode || member.role || "").toUpperCase();
  const roleLabel =
    rawRole === "30" || rawRole === "LIBRARIAN"
      ? "أمين مكتبة"
      : rawRole === "35" || rawRole === "LIBRARY_ADMIN"
      ? "مشرف مكتبة"
      : member.role || "موظف";

  const userId = member.userId || member.id;

  return (
    <article className="ktab-staff-card" dir="rtl">
      <div className="ktab-staff-card__body">
        {/* Header */}
        <div className="ktab-staff-card__header">
          <div className="ktab-staff-card__title-group">
            <div className="ktab-staff-card__icon-wrapper">
              <UserRound size={17} />
            </div>
            <div className="ktab-staff-card__meta">
              <h3 className="ktab-staff-card__name" title={displayName}>
                {displayName}
              </h3>
              <p className="ktab-staff-card__role">
                <ShieldCheck size={11} />
                <span>{roleLabel}</span>
              </p>
            </div>
          </div>

          <div className="ktab-staff-card__menu-container" ref={menuRef}>
            <button
              type="button"
              className="ktab-staff-card__menu-btn"
              onClick={toggleMenu}
              aria-label="خيارات الموظف"
              title="خيارات"
            >
              <MoreVertical size={15} />
            </button>

            {isMenuOpen && (
              <div className="ktab-staff-card__dropdown">
                <button
                  type="button"
                  className="ktab-staff-card__dropdown-item ktab-staff-card__dropdown-item--delete"
                  onClick={handleDeleteClick}
                >
                  <Trash2 size={13} />
                  <span>استبعاد من الفريق</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="ktab-staff-card__info-section">
          <div className="ktab-staff-card__info-row" title="البريد الإلكتروني">
            <Mail size={12} />
            <span className="ktab-staff-card__email" dir="ltr">
              {member.email || "لا يوجد بريد مسجل"}
            </span>
          </div>

          {member.libraryOrganizationName && (
            <div className="ktab-staff-card__info-row" title="المكتبة">
              <Building2 size={12} />
              <span className="ktab-staff-card__lib-name">{member.libraryOrganizationName}</span>
            </div>
          )}

          {userId && (
            <div className="ktab-staff-card__info-row" title="معرف الموظف">
              <Hash size={12} />
              <span>معرف الموظف: #{userId}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default StaffCard;
