import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Tag,
  BookOpen,
  Users,
  User,
  Headphones,
  Globe,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { usePublisherReviewDrawer } from "../../hooks/usePublisherReviewDrawer";
import "./PublisherReviewDrawer.css";

/**
 * Editorial Apple-inspired Slide-over Drawer for Publisher Editorial Review.
 * Anchored to the left of the viewport with comprehensive book inspection tiles,
 * source file download, and review decision actions.
 */
export function PublisherReviewDrawer({
  isOpen,
  book: initialBook,
  onClose,
  onApprove,
  onReject,
}) {
  const { book, downloading, handleDownloadSource } =
    usePublisherReviewDrawer({
      isOpen,
      bookId: initialBook?.id,
      initialBook,
    });

  if (!isOpen) return null;

  const currentBook = book || initialBook;
  const authorName =
    (currentBook?.customAuthorName && currentBook.customAuthorName.trim()) ||
    (currentBook?.authorName && currentBook.authorName.trim()) ||
    "غير محدد";

  const genreName = currentBook?.mainGenreName || "عام";
  const subGenre = currentBook?.subGenreName;

  const formatLanguage = (code) => {
    const normalized = String(code || "").toLowerCase();
    if (normalized === "ar" || normalized === "arabic") return "العربية";
    if (normalized === "en" || normalized === "english") return "الإنجليزية";
    return code || "العربية";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="ktab-pub-drawer-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="publisher-drawer-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ktab-pub-drawer-backdrop-overlay"
          />

          {/* Slide-over Drawer Panel (Bottom Sheet on Mobile, Left Card on Desktop) */}
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
            className="ktab-pub-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Mobile BottomSheet Grab Handle */}
            <div className="ktab-pub-drawer-handle" />

            {/* Header */}
            <div className="ktab-pub-drawer-header">
              <h3 id="publisher-drawer-title" className="ktab-pub-drawer-title">
                تفاصيل وفحص الكتاب
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="ktab-pub-drawer-close-btn"
                aria-label="إغلاق النافذة"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="ktab-pub-drawer-body">
              {/* Hero Section */}
              <div className="ktab-pub-drawer-hero">
                <div className="ktab-pub-drawer-cover-wrap">
                  {currentBook?.coverImageUrl ? (
                    <img
                      src={currentBook.coverImageUrl}
                      alt={currentBook?.title || "غلاف الكتاب"}
                      className="ktab-pub-drawer-cover-img"
                    />
                  ) : (
                    <div className="ktab-pub-drawer-fallback-cover">
                      <img
                        src={brandIconImg}
                        alt=""
                        className="ktab-pub-drawer-fallback-logo"
                      />
                    </div>
                  )}
                </div>

                <div className="ktab-pub-drawer-hero-info">
                  <h2 className="ktab-pub-drawer-book-title">{currentBook?.title}</h2>
                  <p className="ktab-pub-drawer-book-author">المؤلف: {authorName}</p>

                  <div className="ktab-pub-drawer-actions">
                    <button
                      type="button"
                      onClick={handleDownloadSource}
                      disabled={downloading}
                      className="ktab-pub-drawer-btn-download"
                      title="تحميل الملف المصدري للكتاب"
                    >
                      {downloading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Download size={15} strokeWidth={2.2} />
                      )}
                      <span>{downloading ? "جاري التجهيز..." : "تحميل ملف الكتاب"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Book Description Section (only if description is present) */}
              {currentBook?.description && (
                <div className="ktab-pub-drawer-section">
                  <h4 className="ktab-pub-drawer-section-title">نبذة عن الكتاب</h4>
                  <p className="ktab-pub-drawer-desc-box">{currentBook.description}</p>
                </div>
              )}

              {/* Review History / Notes if previously reviewed */}
              {currentBook?.reviewNote && (
                <div className="ktab-pub-drawer-section">
                  <h4 className="ktab-pub-drawer-section-title">الملاحظات التحريرية السابقة</h4>
                  <div className="ktab-pub-drawer-review-note-box">
                    <FileText size={16} className="ktab-pub-drawer-review-note-icon" />
                    <div>
                      <p className="ktab-pub-drawer-review-note-text">
                        {currentBook.reviewNote}
                      </p>
                      {currentBook?.reviewedByName && (
                        <span className="ktab-pub-drawer-review-note-meta">
                          بواسطة: {currentBook.reviewedByName}
                          {currentBook?.reviewedAt && ` • ${formatDate(currentBook.reviewedAt)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Specifications Grid */}
              <div className="ktab-pub-drawer-section">
                <h4 className="ktab-pub-drawer-section-title">بيانات ومواصفات الكتاب</h4>
                <div className="ktab-pub-drawer-specs-grid">
                  {currentBook?.customAuthorName && (
                    <div className="ktab-pub-drawer-spec-tile">
                      <div className="ktab-pub-drawer-spec-icon">
                        <User size={16} />
                      </div>
                      <div className="ktab-pub-drawer-spec-text">
                        <span className="ktab-pub-drawer-spec-label">اسم المؤلف المخصص</span>
                        <span className="ktab-pub-drawer-spec-val">
                          {currentBook.customAuthorName}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentBook?.authorName && (
                    <div className="ktab-pub-drawer-spec-tile">
                      <div className="ktab-pub-drawer-spec-icon">
                        <Users size={16} />
                      </div>
                      <div className="ktab-pub-drawer-spec-text">
                        <span className="ktab-pub-drawer-spec-label">حساب الكاتب</span>
                        <span className="ktab-pub-drawer-spec-val">{currentBook.authorName}</span>
                      </div>
                    </div>
                  )}

                  <div className="ktab-pub-drawer-spec-tile">
                    <div className="ktab-pub-drawer-spec-icon">
                      <Tag size={16} />
                    </div>
                    <div className="ktab-pub-drawer-spec-text">
                      <span className="ktab-pub-drawer-spec-label">التصنيف الأساسي</span>
                      <span className="ktab-pub-drawer-spec-val">
                        {genreName}
                        {subGenre ? ` / ${subGenre}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="ktab-pub-drawer-spec-tile">
                    <div className="ktab-pub-drawer-spec-icon">
                      <BookOpen size={16} />
                    </div>
                    <div className="ktab-pub-drawer-spec-text">
                      <span className="ktab-pub-drawer-spec-label">عدد الصفحات</span>
                      <span className="ktab-pub-drawer-spec-val">
                        {currentBook?.pageCount ? `${currentBook.pageCount} صفحة` : "غير محدد"}
                      </span>
                    </div>
                  </div>

                  <div className="ktab-pub-drawer-spec-tile">
                    <div className="ktab-pub-drawer-spec-icon">
                      <Headphones size={16} />
                    </div>
                    <div className="ktab-pub-drawer-spec-text">
                      <span className="ktab-pub-drawer-spec-label">الوسائط المتاحة</span>
                      <span className="ktab-pub-drawer-spec-val">
                        {currentBook?.hasAudio ? "نسخة صوتية ونصوص" : "قراءة نصية فقط"}
                      </span>
                    </div>
                  </div>

                  <div className="ktab-pub-drawer-spec-tile">
                    <div className="ktab-pub-drawer-spec-icon">
                      <Globe size={16} />
                    </div>
                    <div className="ktab-pub-drawer-spec-text">
                      <span className="ktab-pub-drawer-spec-label">لغة الكتاب</span>
                      <span className="ktab-pub-drawer-spec-val">
                        {formatLanguage(currentBook?.language)}
                      </span>
                    </div>
                  </div>

                  {(currentBook?.ageRangeMin || currentBook?.ageRangeMax) && (
                    <div className="ktab-pub-drawer-spec-tile">
                      <div className="ktab-pub-drawer-spec-icon">
                        <Users size={16} />
                      </div>
                      <div className="ktab-pub-drawer-spec-text">
                        <span className="ktab-pub-drawer-spec-label">الفئة العمرية</span>
                        <span className="ktab-pub-drawer-spec-val">
                          {currentBook.ageRangeMin || 0} - {currentBook.ageRangeMax || "+"} سنة
                        </span>
                      </div>
                    </div>
                  )}

                  {currentBook?.submittedAt && (
                    <div className="ktab-pub-drawer-spec-tile">
                      <div className="ktab-pub-drawer-spec-icon">
                        <Clock size={16} />
                      </div>
                      <div className="ktab-pub-drawer-spec-text">
                        <span className="ktab-pub-drawer-spec-label">تاريخ الإرسال</span>
                        <span className="ktab-pub-drawer-spec-val">
                          {formatDate(currentBook.submittedAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentBook?.libraryOrganizationName && (
                    <div className="ktab-pub-drawer-spec-tile">
                      <div className="ktab-pub-drawer-spec-icon">
                        <Building2 size={16} />
                      </div>
                      <div className="ktab-pub-drawer-spec-text">
                        <span className="ktab-pub-drawer-spec-label">المكتبة / المؤسسة</span>
                        <span className="ktab-pub-drawer-spec-val">
                          {currentBook.libraryOrganizationName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Editorial Actions Footer */}
            <div className="ktab-pub-drawer-footer">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReject?.(currentBook);
                }}
                className="ktab-pub-drawer-btn ktab-pub-drawer-btn--reject"
              >
                <XCircle size={16} strokeWidth={2.2} />
                <span>إعادة كمسودة مع ملاحظة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApprove?.(currentBook);
                }}
                className="ktab-pub-drawer-btn ktab-pub-drawer-btn--approve"
              >
                <CheckCircle size={16} strokeWidth={2.2} className="ktab-pub-drawer-approve-icon" />
                <span>قبول ونشر الكتاب</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default PublisherReviewDrawer;
