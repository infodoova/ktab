import React from "react";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  BookOpen,
  Users,
  ShieldCheck,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/myui/forms/Button";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { useLibraryDetailsDrawer } from "../../hooks/useLibraryDetailsDrawer";
import "./LibraryDetailsDrawer.css";

/**
 * Pure Declarative View: Library Details Slide-Over Drawer.
 * Built with standard DetailsDrawer: slide-over on desktop, true sheet modal on mobile.
 */
export function LibraryDetailsDrawer({
  isOpen,
  onClose,
  library,
  onEdit,
  onDelete,
}) {
  const { handleClose } = useLibraryDetailsDrawer({ isOpen, onClose });

  if (!library) return null;

  const admin = library.admin;
  const statusStr = String(library.status ?? "1").toUpperCase();
  const isActive = statusStr === "1" || statusStr === "ACTIVE";

  const footer = (
    <div className="ktab-admin-lib-drawer-footer">
      <Button
        variant="secondary"
        icon={<Edit3 size={15} />}
        onClick={() => {
          handleClose();
          onEdit?.(library);
        }}
      >
        تعديل البيانات
      </Button>
      <Button
        variant="danger"
        icon={<Trash2 size={15} />}
        onClick={() => {
          handleClose();
          onDelete?.(library);
        }}
      >
        حذف المكتبة
      </Button>
    </div>
  );

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title="تفاصيل المكتبة"
      footer={footer}
      width="520px"
      className="ktab-admin-lib-details-drawer"
    >
      {/* Hero Banner */}
      <div className="ktab-lib-drawer__hero">
        <div className="ktab-lib-drawer__logo-box">
          <Building2 size={32} />
        </div>
        <div>
          <h2 className="ktab-lib-drawer__org-name">{library.name}</h2>
          <p className="ktab-lib-drawer__org-loc">
            <MapPin size={14} />
            <span>
              {library.city}
              {library.country ? `، ${library.country}` : ""}
            </span>
          </p>
        </div>
      </div>

      {/* Description */}
      {library.description && (
        <div className="ktab-lib-drawer__section">
          <h4 className="ktab-lib-drawer__section-title">نبذة عن المكتبة</h4>
          <p className="ktab-lib-drawer__description">
            {library.description}
          </p>
        </div>
      )}

      {/* Key Specifications & Metrics */}
      <div className="ktab-lib-drawer__section">
        <h4 className="ktab-lib-drawer__section-title">بيانات وإحصائيات المكتبة</h4>
        <div className="ktab-lib-drawer__specs-grid">
          <div className="ktab-lib-drawer__spec-item">
            <span className="ktab-lib-drawer__spec-icon">
              <BookOpen size={16} />
            </span>
            <div className="ktab-lib-drawer__spec-data">
              <span className="ktab-lib-drawer__spec-label">إجمالي الكتب</span>
              <span className="ktab-lib-drawer__spec-value">
                {(library.totalBooks ?? 0).toLocaleString("en")}
              </span>
            </div>
          </div>

          <div className="ktab-lib-drawer__spec-item">
            <span className="ktab-lib-drawer__spec-icon">
              <Users size={16} />
            </span>
            <div className="ktab-lib-drawer__spec-data">
              <span className="ktab-lib-drawer__spec-label">طاقم العمل</span>
              <span className="ktab-lib-drawer__spec-value">
                {(library.totalStaff ?? library.staffCount ?? 0).toLocaleString("en")}
              </span>
            </div>
          </div>

          <div className="ktab-lib-drawer__spec-item">
            <span className="ktab-lib-drawer__spec-icon">
              <Globe size={16} />
            </span>
            <div className="ktab-lib-drawer__spec-data">
              <span className="ktab-lib-drawer__spec-label">الموقع الإلكتروني</span>
              <span className="ktab-lib-drawer__spec-value">
                {library.website ? (
                  <a
                    href={library.website.startsWith("http") ? library.website : `https://${library.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ktab-lib-drawer__link"
                  >
                    {library.website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  "غير متوفر"
                )}
              </span>
            </div>
          </div>

          <div className="ktab-lib-drawer__spec-item">
            <span className="ktab-lib-drawer__spec-icon">
              <Mail size={16} />
            </span>
            <div className="ktab-lib-drawer__spec-data">
              <span className="ktab-lib-drawer__spec-label">البريد الإلكتروني</span>
              <span className="ktab-lib-drawer__spec-value">{library.email || "غير متوفر"}</span>
            </div>
          </div>

          <div className="ktab-lib-drawer__spec-item">
            <span className="ktab-lib-drawer__spec-icon">
              <Phone size={16} />
            </span>
            <div className="ktab-lib-drawer__spec-data">
              <span className="ktab-lib-drawer__spec-label">رقم الهاتف</span>
              <span className="ktab-lib-drawer__spec-value">{library.phone || "غير متوفر"}</span>
            </div>
          </div>

          <div className="ktab-lib-drawer__spec-item">
            <span className="ktab-lib-drawer__spec-icon">
              <ShieldCheck size={16} />
            </span>
            <div className="ktab-lib-drawer__spec-data">
              <span className="ktab-lib-drawer__spec-label">حالة الحساب</span>
              <span className={`ktab-lib-drawer__status-badge ${isActive ? "ktab-lib-drawer__status-badge--active" : "ktab-lib-drawer__status-badge--inactive"}`}>
                {isActive ? "نشط" : "معطل"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Administrator Profile */}
      {admin && (
        <div className="ktab-lib-drawer__section">
          <h4 className="ktab-lib-drawer__section-title">المشرف الرئيسي</h4>
          <div className="ktab-lib-drawer__admin-card">
            <div className="ktab-lib-drawer__admin-avatar">
              <ShieldCheck size={22} />
            </div>
            <div className="ktab-lib-drawer__admin-details">
              <span className="ktab-lib-drawer__admin-role">مشرف المكتبة</span>
              <span className="ktab-lib-drawer__admin-name">
                {admin.fullName || `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || "غير محدد"}
              </span>
              {admin.email && (
                <span className="ktab-lib-drawer__admin-email">{admin.email}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </DetailsDrawer>
  );
}

export default LibraryDetailsDrawer;
