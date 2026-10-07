import { BookTrailerSection } from "@/features/trailers/components/BookTrailerSection/BookTrailerSection";
import React from "react";
import {
  Download,
  Trash2,
  Tag,
  BookOpen,
  Users,
  User,
  Headphones,
  Globe,
  Calendar,
  Star,
  Building2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/myui/forms/Button";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { useBookDetailsDrawer } from "../../hooks/useBookDetailsDrawer";
import "./BookDetailsDrawer.css";

/**
 * Editorial Slide-over Drawer for Library Book Details using DetailsDrawer.
 */
export function BookDetailsDrawer({ isOpen, book: initialBook, onClose, onDelete }) {
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

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="تفاصيل الكتاب"
      footer={
        <div className="ktab-book-drawer__footer-actions">
          <button
            type="button"
            onClick={handleDownloadSource}
            disabled={downloading}
            className="ktab-book-drawer__btn-download"
            title="تحميل الملف المصدري للكتاب"
          >
            {downloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} strokeWidth={2.2} />
            )}
            <span>{downloading ? "جاري التجهيز..." : "تحميل الكتاب"}</span>
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                onClose?.();
                onDelete(currentBook);
              }}
              className="ktab-book-drawer__btn-delete"
              title="حذف الكتاب نهائياً من المكتبة"
            >
              <Trash2 size={16} strokeWidth={2.2} />
              <span>حذف الكتاب</span>
            </button>
          )}
        </div>
      }
    >
      {/* Hero Section */}
      <div className="ktab-book-drawer__hero">
        <div className="ktab-book-drawer__cover-wrap">
          {currentBook?.coverImageUrl ? (
            <img
              src={currentBook.coverImageUrl}
              alt={currentBook?.title || "غلاف الكتاب"}
              className="ktab-book-drawer__cover-img"
            />
          ) : (
            <div className="ktab-book-drawer__fallback-cover">
              <img
                src={brandIconImg}
                alt=""
                className="ktab-book-drawer__fallback-logo"
              />
            </div>
          )}
        </div>

        <div className="ktab-book-drawer__hero-info">
          <h2 className="ktab-book-drawer__book-title">{currentBook?.title}</h2>
          <p className="ktab-book-drawer__book-author">المؤلف: {authorName}</p>
        </div>
      </div>

      {/* Book Summary / Description */}
      {currentBook?.description && (
        <div className="ktab-book-drawer__section">
          <h4 className="ktab-book-drawer__section-title">نبذة عن الكتاب</h4>
          <p className="ktab-book-drawer__desc-box">{currentBook.description}</p>
        </div>
      )}

      <BookTrailerSection bookId={currentBook?.id} book={currentBook} title={currentBook?.title} poster={currentBook?.coverImageUrl} enabled={Boolean(isOpen && currentBook)} />

      {/* Specifications Grid */}
      <div className="ktab-book-drawer__section">
        <h4 className="ktab-book-drawer__section-title">بيانات ومواصفات الكتاب</h4>
        <div className="ktab-book-drawer__specs-grid">
          <div className="ktab-book-drawer__spec-tile">
            <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--author">
              <User size={16} />
            </div>
            <div className="ktab-book-drawer__spec-text">
              <span className="ktab-book-drawer__spec-label">اسم المؤلف</span>
              <span className="ktab-book-drawer__spec-val">{authorName}</span>
            </div>
          </div>

          <div className="ktab-book-drawer__spec-tile">
            <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--genre">
              <Tag size={16} />
            </div>
            <div className="ktab-book-drawer__spec-text">
              <span className="ktab-book-drawer__spec-label">التصنيف</span>
              <span className="ktab-book-drawer__spec-val">
                {genreName}
                {subGenre ? ` / ${subGenre}` : ""}
              </span>
            </div>
          </div>

          <div className="ktab-book-drawer__spec-tile">
            <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--pages">
              <BookOpen size={16} />
            </div>
            <div className="ktab-book-drawer__spec-text">
              <span className="ktab-book-drawer__spec-label">عدد الصفحات</span>
              <span className="ktab-book-drawer__spec-val">
                {currentBook?.pageCount ? `${currentBook.pageCount} صفحة` : "غير محدد"}
              </span>
            </div>
          </div>

          <div className="ktab-book-drawer__spec-tile">
            <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--age">
              <Users size={16} />
            </div>
            <div className="ktab-book-drawer__spec-text">
              <span className="ktab-book-drawer__spec-label">الفئة العمرية</span>
              <span className="ktab-book-drawer__spec-val">
                {currentBook?.ageRangeMin || currentBook?.ageRangeMax
                  ? `${currentBook.ageRangeMin || 0} - ${currentBook.ageRangeMax || "+"} سنة`
                  : "جميع الفئات"}
              </span>
            </div>
          </div>

          <div className="ktab-book-drawer__spec-tile">
            <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--media">
              <Headphones size={16} />
            </div>
            <div className="ktab-book-drawer__spec-text">
              <span className="ktab-book-drawer__spec-label">الوسائط المتاحة</span>
              <span className="ktab-book-drawer__spec-val">
                {currentBook?.hasAudio ? "نسخة صوتية ونصوص" : "قراءة نصية فقط"}
              </span>
            </div>
          </div>

          {currentBook?.language && (
            <div className="ktab-book-drawer__spec-tile">
              <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--lang">
                <Globe size={16} />
              </div>
              <div className="ktab-book-drawer__spec-text">
                <span className="ktab-book-drawer__spec-label">لغة الكتاب</span>
                <span className="ktab-book-drawer__spec-val">
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
            <div className="ktab-book-drawer__spec-tile">
              <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--library">
                <Building2 size={16} />
              </div>
              <div className="ktab-book-drawer__spec-text">
                <span className="ktab-book-drawer__spec-label">المكتبة التابعة</span>
                <span className="ktab-book-drawer__spec-val">
                  {currentBook.libraryOrganizationName}
                </span>
              </div>
            </div>
          )}

          {currentBook?.publishDate && (
            <div className="ktab-book-drawer__spec-tile">
              <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--date">
                <Calendar size={16} />
              </div>
              <div className="ktab-book-drawer__spec-text">
                <span className="ktab-book-drawer__spec-label">تاريخ النشر</span>
                <span className="ktab-book-drawer__spec-val">
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

          <div className="ktab-book-drawer__spec-tile">
            <div className="ktab-book-drawer__spec-icon ktab-book-drawer__spec-icon--star">
              <Star size={16} />
            </div>
            <div className="ktab-book-drawer__spec-text">
              <span className="ktab-book-drawer__spec-label">التقييم والمراجعات</span>
              <span className="ktab-book-drawer__spec-val">
                {currentBook?.averageRating && Number(currentBook.averageRating) > 0
                  ? `${Number(currentBook.averageRating).toFixed(1)} / 5 (${currentBook.totalReviews || 0} مراجعة)`
                  : `0.0 / 5 (${currentBook?.totalReviews || 0} مراجعة)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DetailsDrawer>
  );
}

export default BookDetailsDrawer;
