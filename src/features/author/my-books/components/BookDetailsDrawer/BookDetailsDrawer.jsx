import React from "react";
import {
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
  Send,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
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
 * Editorial BookDetailsDrawer component using the shared DetailsDrawer shell.
 * Uses useBookDetailsDrawer for data loading and presentation attributes.
 */
export function BookDetailsDrawer({ isOpen, onClose, book, onSubmit }) {
  const {
    coverUrl,
    isDraft,
    isPending,
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
    <DetailsDrawer
      isOpen={Boolean(isOpen && book)}
      onClose={onClose}
      title="تفاصيل الكتاب"
      footer={
        <div className="ktab-book-drawer__footer-actions">
          {isDraft && !isPending && typeof onSubmit === "function" && (
            <button
              type="button"
              onClick={() => {
                onClose?.();
                onSubmit(book);
              }}
              className="ktab-book-drawer__submit-btn"
              title="نشر الكتاب وإرساله للمراجعة"
            >
              <Send size={16} strokeWidth={2.2} />
              <span>نشر الكتاب للمراجعة</span>
            </button>
          )}
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
      }
    >
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
                  : isPending
                  ? "ktab-book-drawer__status-pill--pending"
                  : "ktab-book-drawer__status-pill--published"
              }`}
            >
              {isDraft || isPending ? <Clock size={12} /> : <CheckCircle2 size={12} />}
              <span>{statusLabel}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Comprehensive Details Grid */}
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
    </DetailsDrawer>
  );
}

export default BookDetailsDrawer;
