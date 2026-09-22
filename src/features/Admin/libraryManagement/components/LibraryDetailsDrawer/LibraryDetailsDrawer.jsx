import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
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
import { useLibraryDetailsDrawer } from "../../hooks/useLibraryDetailsDrawer";
import "./LibraryDetailsDrawer.css";

/**
 * Pure Declarative View: Library Details Slide-Over Drawer.
 * Opens on the left side of the screen on PC, full drawer on mobile.
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

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="ktab-lib-drawer-backdrop"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ktab-lib-drawer-backdrop-overlay"
          />

          {/* Slide-over Drawer Panel on Left Side (Bottom Sheet on mobile) */}
          <motion.div
            initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, x: -100 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
            exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, x: -100 }}
            transition={{
              type: "spring",
              damping: isMobile ? 32 : 30,
              stiffness: isMobile ? 320 : 350,
              mass: 0.8,
            }}
            className="ktab-lib-drawer"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Mobile BottomSheet Grab Handle */}
            <div className="ktab-lib-drawer-handle" />
            {/* Header */}
            <div className="ktab-lib-drawer__header">
              <h3 className="ktab-lib-drawer__title">تفاصيل المكتبة</h3>
              <button
                type="button"
                onClick={handleClose}
                className="ktab-lib-drawer__close-btn"
                aria-label="إغلاق النافذة"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Content */}
            <div className="ktab-lib-drawer__body">
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
                        {(library.totalStaff ?? 0).toLocaleString("en")}
                      </span>
                    </div>
                  </div>

                  {library.website && (
                    <div className="ktab-lib-drawer__spec-item">
                      <span className="ktab-lib-drawer__spec-icon">
                        <Globe size={16} />
                      </span>
                      <div className="ktab-lib-drawer__spec-data">
                        <span className="ktab-lib-drawer__spec-label">الموقع الإلكتروني</span>
                        <a
                          href={library.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ktab-lib-drawer__spec-value text-blue-600 underline"
                        >
                          {library.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {library.email && (
                    <div className="ktab-lib-drawer__spec-item">
                      <span className="ktab-lib-drawer__spec-icon">
                        <Mail size={16} />
                      </span>
                      <div className="ktab-lib-drawer__spec-data">
                        <span className="ktab-lib-drawer__spec-label">البريد الإلكتروني</span>
                        <span className="ktab-lib-drawer__spec-value">{library.email}</span>
                      </div>
                    </div>
                  )}

                  {library.phone && (
                    <div className="ktab-lib-drawer__spec-item">
                      <span className="ktab-lib-drawer__spec-icon">
                        <Phone size={16} />
                      </span>
                      <div className="ktab-lib-drawer__spec-data">
                        <span className="ktab-lib-drawer__spec-label">رقم الهاتف</span>
                        <span className="ktab-lib-drawer__spec-value" dir="ltr">{library.phone}</span>
                      </div>
                    </div>
                  )}

                  <div className="ktab-lib-drawer__spec-item">
                    <span className="ktab-lib-drawer__spec-icon">
                      <ShieldCheck size={16} />
                    </span>
                    <div className="ktab-lib-drawer__spec-data">
                      <span className="ktab-lib-drawer__spec-label">حالة المكتبة</span>
                      <span className="ktab-lib-drawer__spec-value">
                        {isActive ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Chip Card */}
              {admin && (
                <div className="ktab-lib-drawer__section">
                  <h4 className="ktab-lib-drawer__section-title">المشرف المسؤول (Library Admin)</h4>
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
            </div>

            {/* Footer Action Buttons */}
            <div className="ktab-lib-drawer__footer">
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LibraryDetailsDrawer;
