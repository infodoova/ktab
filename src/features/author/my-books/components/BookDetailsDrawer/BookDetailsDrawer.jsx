import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  BookOpen,
  Headphones,
  Globe,
  Calendar,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Bookmark,
  Tag,
  FileText,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useBookDetailsDrawer } from "./useBookDetailsDrawer";
import "./BookDetailsDrawer.css";

/**
 * Pure helper rendering icon based on specification item type.
 */
function renderSpecIcon(iconType) {
  switch (iconType) {
    case "user":
      return <User size={13} strokeWidth={2.2} />;
    case "building":
      return <Building2 size={13} strokeWidth={2.2} />;
    case "bookmark":
      return <Bookmark size={13} strokeWidth={2.2} />;
    case "tag":
      return <Tag size={13} strokeWidth={2.2} />;
    case "fileText":
      return <FileText size={13} strokeWidth={2.2} />;
    case "check":
      return <CheckCircle2 size={13} strokeWidth={2.2} />;
    case "clock":
      return <Clock size={13} strokeWidth={2.2} />;
    case "star":
      return <Star size={13} fill="currentColor" strokeWidth={1.5} />;
    case "headphones":
      return <Headphones size={13} strokeWidth={2.2} />;
    case "bookOpen":
      return <BookOpen size={13} strokeWidth={2.2} />;
    case "users":
      return <Users size={13} strokeWidth={2.2} />;
    case "globe":
      return <Globe size={13} strokeWidth={2.2} />;
    case "calendar":
      return <Calendar size={13} strokeWidth={2.2} />;
    case "eye":
      return <Eye size={13} strokeWidth={2.2} />;
    default:
      return <BookOpen size={13} strokeWidth={2.2} />;
  }
}

/**
 * Pure presentation BookDetailsDrawer component.
 * Uses useBookDetailsDrawer for state, animations, and lifecycle.
 */
export function BookDetailsDrawer({ isOpen, onClose, book }) {
  const {
    coverUrl,
    isDraft,
    title,
    author,
    description,
    statusLabel,
    canPreview,
    handlePreview,
    specItems,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
  } = useBookDetailsDrawer({ isOpen, onClose, book });

  return (
    <AnimatePresence>
      {isOpen && book && (
        <div
          className="ktab-book-drawer-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-drawer-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ktab-book-drawer-backdrop-overlay"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.98 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 350,
              mass: 0.8,
            }}
            className="ktab-book-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="ktab-book-drawer__header">
              <h3 id="book-drawer-title" className="ktab-book-drawer__title">
                تفاصيل الكتاب
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="ktab-book-drawer__close-btn"
                aria-label="إغلاق"
                title="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="ktab-book-drawer__body">
              {/* Hero Book Info */}
              <div className="ktab-book-drawer__hero">
                <div className="ktab-book-drawer__cover-wrap">
                  {!hasCoverError && coverUrl ? (
                    <>
                      {!coverLoaded && <div className="ktab-book-drawer__cover-shimmer" />}
                      <img
                        src={coverUrl}
                        alt={title}
                        onLoad={handleCoverLoad}
                        onError={handleCoverError}
                        className={`ktab-book-drawer__cover-img ${
                          coverLoaded
                            ? "ktab-book-drawer__cover-img--loaded"
                            : "ktab-book-drawer__cover-img--loading"
                        }`}
                        loading="lazy"
                        decoding="async"
                      />
                    </>
                  ) : (
                    <div className="ktab-book-drawer__fallback-cover">
                      <img
                        src={brandIconImg}
                        alt=""
                        className="ktab-book-drawer__fallback-logo"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>

                <div className="ktab-book-drawer__info">
                  <h4 className="ktab-book-drawer__book-title">{title}</h4>
                  <p className="ktab-book-drawer__book-author">
                    بقلم: <span>{author}</span>
                  </p>
                  <div className="ktab-book-drawer__status-badge-wrap">
                    <span
                      className={`ktab-book-drawer__status-pill ${
                        isDraft
                          ? "ktab-book-drawer__status-pill--draft"
                          : "ktab-book-drawer__status-pill--published"
                      }`}
                    >
                      {isDraft ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                      <span>{statusLabel}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Details Grid (All 12 metadata points in a clean grid) */}
              <div className="ktab-book-drawer__section">
                <h4 className="ktab-book-drawer__section-title">بيانات ومواصفات الكتاب</h4>
                <div className="ktab-book-drawer__grid">
                  {specItems.map((item) => (
                    <div key={item.id} className="ktab-book-drawer__tile">
                      <div className="ktab-book-drawer__tile-header">
                        <div
                          className={`ktab-book-drawer__tile-icon ktab-book-drawer__tile-icon--${
                            item.highlight || "neutral"
                          }`}
                        >
                          {renderSpecIcon(item.iconType)}
                        </div>
                        <span className="ktab-book-drawer__tile-label">{item.label}</span>
                      </div>
                      <span className="ktab-book-drawer__tile-value" title={item.value}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Summary / Description */}
              <div className="ktab-book-drawer__section">
                <h4 className="ktab-book-drawer__section-title">نبذة عن الكتاب</h4>
                <p className="ktab-book-drawer__desc-box">
                  {description || "لا يوجد وصف مسجل لهذا الكتاب حتى الآن."}
                </p>
              </div>
            </div>

            {/* Bottom Sticky Action: One Big Preview Book Button */}
            <div className="ktab-book-drawer__footer">
              <button
                type="button"
                onClick={handlePreview}
                disabled={!canPreview}
                className="ktab-book-drawer__preview-btn"
                title={canPreview ? "معاينة وقراءة الكتاب" : "ملف الكتاب غير متوفر للمعاينة"}
              >
                <BookOpen size={18} strokeWidth={2.2} />
                <span>معاينة الكتاب</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default BookDetailsDrawer;
