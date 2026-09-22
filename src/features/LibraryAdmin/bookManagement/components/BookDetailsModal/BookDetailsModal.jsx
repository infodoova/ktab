import React from "react";
import {
  X,
  Download,
  Calendar,
  User,
  BookOpen,
  Tag,
  Languages,
  Headphones,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/myui/Modal";
import { BottomSheet } from "@/components/myui/BottomSheet";
import { Button } from "@/components/myui/forms/Button";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useBookDetailsModal } from "../../hooks/useBookDetailsModal";
import "./BookDetailsModal.css";

/**
 * Editorial Apple-inspired modal displaying full book metadata,
 * source file download, and direct deletion trigger.
 */
export function BookDetailsModal({ isOpen, book: initialBook, onClose, onDelete }) {
  const { book, loading, downloading, isMobile, handleDownloadSource } =
    useBookDetailsModal({
      bookId: initialBook?.id,
      initialBook,
      onClose,
    });

  if (!isOpen) return null;

  const currentBook = book || initialBook;
  const authorName =
    currentBook?.authorName || currentBook?.customAuthorName || "غير محدد";
  const genreName = currentBook?.mainGenreName || "عام";
  const subGenre = currentBook?.subGenreName;

  const bodyContent = (
    <div className="ktab-book-details" dir="rtl">
      {/* Header Row */}
      <div className="ktab-book-details__top">
        <div className="ktab-book-details__cover-box">
          {currentBook?.coverImageUrl ? (
            <img
              src={currentBook.coverImageUrl}
              alt={currentBook?.title || "غلاف الكتاب"}
              className="ktab-book-details__cover-img"
            />
          ) : (
            <div className="ktab-book-details__fallback-cover">
              <img src={brandIconImg} alt="" className="ktab-book-details__fallback-logo" />
            </div>
          )}
        </div>

        <div className="ktab-book-details__hero">
          <div className="ktab-book-details__status-row">
            <span className="ktab-book-details__status-pill">
              {currentBook?.status === "PUBLISHED" ? "منشور" : "مسودة"}
            </span>
            {currentBook?.language && (
              <span className="ktab-book-details__meta-pill">{currentBook.language}</span>
            )}
          </div>

          <h2 className="ktab-book-details__title">{currentBook?.title}</h2>
          <p className="ktab-book-details__author">{authorName}</p>

          <div className="ktab-book-details__actions">
            <Button
              variant="secondary"
              icon={<Download size={15} />}
              onClick={handleDownloadSource}
              loading={downloading}
            >
              تحميل ملف الكتاب
            </Button>
            {onDelete && (
              <Button
                variant="danger"
                icon={<Trash2 size={15} />}
                onClick={() => {
                  onClose?.();
                  onDelete(currentBook);
                }}
              >
                حذف من المكتبة
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {currentBook?.description && (
        <div className="ktab-book-details__section">
          <h4 className="ktab-book-details__section-title">نبذة عن الكتاب</h4>
          <p className="ktab-book-details__desc">{currentBook.description}</p>
        </div>
      )}

      {/* Specifications Grid */}
      <div className="ktab-book-details__specs-grid">
        <div className="ktab-book-details__spec-tile">
          <Tag size={16} />
          <div>
            <span className="ktab-book-details__spec-label">التصنيف الأساسي</span>
            <span className="ktab-book-details__spec-val">
              {genreName}
              {subGenre ? ` / ${subGenre}` : ""}
            </span>
          </div>
        </div>

        <div className="ktab-book-details__spec-tile">
          <BookOpen size={16} />
          <div>
            <span className="ktab-book-details__spec-label">عدد الصفحات</span>
            <span className="ktab-book-details__spec-val">
              {currentBook?.pageCount ? `${currentBook.pageCount} صفحة` : "غير محدد"}
            </span>
          </div>
        </div>

        <div className="ktab-book-details__spec-tile">
          <Languages size={16} />
          <div>
            <span className="ktab-book-details__spec-label">الفئة العمرية</span>
            <span className="ktab-book-details__spec-val">
              {currentBook?.ageRangeMin || currentBook?.ageRangeMax
                ? `${currentBook.ageRangeMin || 0} - ${currentBook.ageRangeMax || "+"} سنة`
                : "جميع الفئات"}
            </span>
          </div>
        </div>

        <div className="ktab-book-details__spec-tile">
          <Headphones size={16} />
          <div>
            <span className="ktab-book-details__spec-label">الوسائط المتاحة</span>
            <span className="ktab-book-details__spec-val">
              {currentBook?.hasAudio ? "نسخة صوتية وقراءة نصية" : "قراءة نصية فقط"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title="تفاصيل الكتاب">
        <div className="p-4" dir="rtl">
          {bodyContent}
        </div>
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="تفاصيل الكتاب"
      className="ktab-book-details-modal"
    >
      <div dir="rtl" className="p-2">
        {bodyContent}
      </div>
    </Modal>
  );
}

export default BookDetailsModal;
