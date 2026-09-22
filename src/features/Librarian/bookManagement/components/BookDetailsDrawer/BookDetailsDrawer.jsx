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
  Edit3,
  Calendar,
  Star,
  Loader2,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useBookDetailsDrawer } from "../../hooks/useBookDetailsDrawer";
import "./BookDetailsDrawer.css";

/**
 * Editorial Apple-inspired Slide-over Drawer for Librarian Book Details.
 * Physically anchored to the left of the viewport.
 */
export function BookDetailsDrawer({
  isOpen,
  book: initialBook,
  onClose,
  onEdit,
}) {
  const { book, downloading, handleDownloadSource } = useBookDetailsDrawer({
    isOpen,
    bookId: initialBook?.id,
    initialBook,
    onClose,
  });

  if (!isOpen) return null;

  const currentBook = book || initialBook;
  const authorName =
    (currentBook?.customAuthorName && currentBook.customAuthorName.trim()) ||
    (currentBook?.authorName && currentBook.authorName.trim()) ||
    "غير محدد";
  const genreName = currentBook?.mainGenreName || "عام";
  const subGenre = currentBook?.subGenreName;

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="ktab-lib-drawer-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="librarian-drawer-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ktab-lib-drawer-backdrop-overlay"
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
            className="ktab-lib-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Mobile BottomSheet Grab Handle */}
            <div className="ktab-lib-drawer-handle" />

            {/* Header */}
            <div className="ktab-lib-drawer-header">
              <h3 id="librarian-drawer-title" className="ktab-lib-drawer-title">
                تفاصيل الكتاب
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="ktab-lib-drawer-close-btn"
                aria-label="إغلاق النافذة"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="ktab-lib-drawer-body">
              {/* Hero Section */}
              <div className="ktab-lib-drawer-hero">
                <div className="ktab-lib-drawer-cover-wrap">
                  {currentBook?.coverImageUrl ? (
                    <img
                      src={currentBook.coverImageUrl}
                      alt={currentBook?.title || "غلاف الكتاب"}
                      className="ktab-lib-drawer-cover-img"
                    />
                  ) : (
                    <div className="ktab-lib-drawer-fallback-cover">
                      <img
                        src={brandIconImg}
                        alt=""
                        className="ktab-lib-drawer-fallback-logo"
                      />
                    </div>
                  )}
                </div>

                <div className="ktab-lib-drawer-hero-info">
                  <h2 className="ktab-lib-drawer-book-title">{currentBook?.title}</h2>
                  <p className="ktab-lib-drawer-book-author">المؤلف: {authorName}</p>

                  <div className="ktab-lib-drawer-actions">
                    <button
                      type="button"
                      onClick={handleDownloadSource}
                      disabled={downloading}
                      className="ktab-lib-drawer-btn-download"
                      title="تحميل الملف المصدري للكتاب"
                    >
                      {downloading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Download size={15} strokeWidth={2.2} />
                      )}
                      <span>{downloading ? "جاري التجهيز..." : "تحميل ملف الكتاب"}</span>
                    </button>

                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose?.();
                          onEdit(currentBook);
                        }}
                        className="ktab-lib-drawer-btn-edit"
                        title="تعديل بيانات الكتاب"
                      >
                        <Edit3 size={15} strokeWidth={2.2} />
                        <span>تعديل بيانات الكتاب</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Summary / Description */}
              {currentBook?.description && (
                <div className="ktab-lib-drawer-section">
                  <h4 className="ktab-lib-drawer-section-title">نبذة عن الكتاب</h4>
                  <p className="ktab-lib-drawer-desc-box">{currentBook.description}</p>
                </div>
              )}

              {/* Specifications Grid */}
              <div className="ktab-lib-drawer-section">
                <h4 className="ktab-lib-drawer-section-title">بيانات ومواصفات الكتاب</h4>
                <div className="ktab-lib-drawer-specs-grid">
                  <div className="ktab-lib-drawer-spec-tile">
                    <div className="ktab-lib-drawer-spec-icon">
                      <User size={16} />
                    </div>
                    <div className="ktab-lib-drawer-spec-text">
                      <span className="ktab-lib-drawer-spec-label">اسم المؤلف</span>
                      <span className="ktab-lib-drawer-spec-val">{authorName}</span>
                    </div>
                  </div>

                  <div className="ktab-lib-drawer-spec-tile">
                    <div className="ktab-lib-drawer-spec-icon">
                      <Tag size={16} />
                    </div>
                    <div className="ktab-lib-drawer-spec-text">
                      <span className="ktab-lib-drawer-spec-label">التصنيف</span>
                      <span className="ktab-lib-drawer-spec-val">
                        {genreName}
                        {subGenre ? ` / ${subGenre}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="ktab-lib-drawer-spec-tile">
                    <div className="ktab-lib-drawer-spec-icon">
                      <BookOpen size={16} />
                    </div>
                    <div className="ktab-lib-drawer-spec-text">
                      <span className="ktab-lib-drawer-spec-label">عدد الصفحات</span>
                      <span className="ktab-lib-drawer-spec-val">
                        {currentBook?.pageCount ? `${currentBook.pageCount} صفحة` : "غير محدد"}
                      </span>
                    </div>
                  </div>

                  <div className="ktab-lib-drawer-spec-tile">
                    <div className="ktab-lib-drawer-spec-icon">
                      <Users size={16} />
                    </div>
                    <div className="ktab-lib-drawer-spec-text">
                      <span className="ktab-lib-drawer-spec-label">الفئة العمرية</span>
                      <span className="ktab-lib-drawer-spec-val">
                        {currentBook?.ageRangeMin || currentBook?.ageRangeMax
                          ? `${currentBook.ageRangeMin || 0} - ${currentBook.ageRangeMax || "+"} سنة`
                          : "جميع الفئات"}
                      </span>
                    </div>
                  </div>

                  <div className="ktab-lib-drawer-spec-tile">
                    <div className="ktab-lib-drawer-spec-icon">
                      <Headphones size={16} />
                    </div>
                    <div className="ktab-lib-drawer-spec-text">
                      <span className="ktab-lib-drawer-spec-label">الوسائط المتاحة</span>
                      <span className="ktab-lib-drawer-spec-val">
                        {currentBook?.hasAudio ? "نسخة صوتية ونصوص" : "قراءة نصية فقط"}
                      </span>
                    </div>
                  </div>

                  {currentBook?.language && (
                    <div className="ktab-lib-drawer-spec-tile">
                      <div className="ktab-lib-drawer-spec-icon">
                        <Globe size={16} />
                      </div>
                      <div className="ktab-lib-drawer-spec-text">
                        <span className="ktab-lib-drawer-spec-label">لغة الكتاب</span>
                        <span className="ktab-lib-drawer-spec-val">
                          {currentBook.language === "ar"
                            ? "العربية"
                            : currentBook.language === "en"
                            ? "الإنجليزية"
                            : currentBook.language}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentBook?.libraryOrganizationName && (
                    <div className="ktab-lib-drawer-spec-tile">
                      <div className="ktab-lib-drawer-spec-icon">
                        <Building2 size={16} />
                      </div>
                      <div className="ktab-lib-drawer-spec-text">
                        <span className="ktab-lib-drawer-spec-label">المكتبة التابعة</span>
                        <span className="ktab-lib-drawer-spec-val">
                          {currentBook.libraryOrganizationName}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentBook?.publishDate && (
                    <div className="ktab-lib-drawer-spec-tile">
                      <div className="ktab-lib-drawer-spec-icon">
                        <Calendar size={16} />
                      </div>
                      <div className="ktab-lib-drawer-spec-text">
                        <span className="ktab-lib-drawer-spec-label">تاريخ النشر</span>
                        <span className="ktab-lib-drawer-spec-val">
                          {(() => {
                            try {
                              const d = new Date(currentBook.publishDate);
                              return isNaN(d.getTime())
                                ? String(currentBook.publishDate).split("T")[0]
                                : d.toLocaleDateString("ar-EG", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  });
                            } catch {
                              return String(currentBook.publishDate).split("T")[0];
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="ktab-lib-drawer-spec-tile">
                    <div className="ktab-lib-drawer-spec-icon">
                      <Star size={16} />
                    </div>
                    <div className="ktab-lib-drawer-spec-text">
                      <span className="ktab-lib-drawer-spec-label">التقييم والمراجعات</span>
                      <span className="ktab-lib-drawer-spec-val">
                        {currentBook?.averageRating && Number(currentBook.averageRating) > 0
                          ? `${Number(currentBook.averageRating).toFixed(1)} / 5 (${currentBook.totalReviews || 0} مراجعة)`
                          : `0.0 / 5 (${currentBook?.totalReviews || 0} مراجعة)`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default BookDetailsDrawer;
