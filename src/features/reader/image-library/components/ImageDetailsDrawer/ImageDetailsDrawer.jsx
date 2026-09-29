import React from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Share2,
  Trash2,
  BookOpen,
  Calendar,
  Sparkles,
  Maximize,
  ExternalLink,
} from "lucide-react";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { ShareMenu } from "@/components/common";
import {
  getNormalizedRatio,
  getRatioLabel,
  getThemeLabel,
  formatImageDate,
} from "../../utils/imageLibraryUtils";
import "./ImageDetailsDrawer.css";

/**
 * Left slide-over DetailsDrawer for inspecting image metadata,
 * scene prompt context, technical specs, downloading, sharing, and deleting.
 */
export function ImageDetailsDrawer({
  image,
  isOpen = false,
  onClose,
  onDownload,
  onShare,
  onDelete,
}) {
  if (!image) return null;

  const ratio = getNormalizedRatio(image.aspectRatio);
  const ratioLabel = getRatioLabel(image.aspectRatio);
  const themeLabel = getThemeLabel(image.theme);
  const dateStr = formatImageDate(image.createdAt);

  const footer = (
    <div className="ktab-img-drawer__footer-actions" dir="rtl">
      <button
        type="button"
        className="ktab-img-drawer__btn ktab-img-drawer__btn--download"
        onClick={() => onDownload(image)}
        title="تنزيل الصورة وحفظها على جهازك"
      >
        <Download size={16} strokeWidth={2.2} />
        <span>تنزيل الصورة</span>
      </button>

      <ShareMenu
        url={image.imageUrl}
        title={image.bookTitle ? `صورة من: ${image.bookTitle}` : "صورة كتاب"}
        text={image.context || "مشهد مصور من تطبيق كِتَاب"}
        align="right"
        direction="up"
      >
        <button
          type="button"
          className="ktab-img-drawer__btn ktab-img-drawer__btn--share"
          title="مشاركة الصورة"
        >
          <Share2 size={16} strokeWidth={2.2} />
          <span>مشاركة</span>
        </button>
      </ShareMenu>

      <button
        type="button"
        className="ktab-img-drawer__btn ktab-img-drawer__btn--delete"
        onClick={() => {
          onClose();
          onDelete(image);
        }}
        title="حذف الصورة نهائياً"
      >
        <Trash2 size={16} strokeWidth={2.2} />
        <span>حذف</span>
      </button>
    </div>
  );

  return (
    <DetailsDrawer
      isOpen={Boolean(isOpen && image)}
      onClose={onClose}
      title="تفاصيل الصورة"
      subtitle={image.bookTitle || "صورة من الكتاب"}
      width="540px"
      footer={footer}
    >
      <div className="ktab-img-drawer__content" dir="rtl">
        {/* Full Image Preview */}
        <div
          className="ktab-img-drawer__media-box"
          style={{ aspectRatio: ratio }}
        >
          <img
            src={image.imageUrl}
            alt={image.context || image.bookTitle || "صورة الكتاب"}
            className="ktab-img-drawer__img"
          />
        </div>

        {/* Book Link Banner */}
        {image.bookId && (
          <div className="ktab-img-drawer__book-card">
            <div className="ktab-img-drawer__book-info">
              <span className="ktab-img-drawer__book-badge">
                <BookOpen size={13} />
                الكتاب المصاحب
              </span>
              <h4 className="ktab-img-drawer__book-title">{image.bookTitle}</h4>
            </div>
            <Link
              to={`/reader/BookDetails/${image.bookId}`}
              className="ktab-img-drawer__book-link"
              title="الانتقال إلى صفحة الكتاب"
            >
              <span>فتح الكتاب</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        )}

        {/* Scene Context (Prompt) */}
        {image.context && (
          <div className="ktab-img-drawer__section">
            <h5 className="ktab-img-drawer__section-title">
              النص التوليدي المقتبس من الصفحة
            </h5>
            <div className="ktab-img-drawer__quote">
              <p className="ktab-img-drawer__quote-text">
                "{image.context}"
              </p>
            </div>
          </div>
        )}

        {/* Artistic Specifications */}
        <div className="ktab-img-drawer__specs-grid">
          <div className="ktab-img-drawer__spec-item">
            <span className="ktab-img-drawer__spec-label">النمط الفني</span>
            <span className="ktab-img-drawer__spec-val">
              <Sparkles size={13} className="ktab-img-drawer__spec-icon" />
              {themeLabel}
            </span>
          </div>

          <div className="ktab-img-drawer__spec-item">
            <span className="ktab-img-drawer__spec-label">الأبعاد</span>
            <span className="ktab-img-drawer__spec-val">
              <Maximize size={13} className="ktab-img-drawer__spec-icon" />
              {ratioLabel}
            </span>
          </div>

          {dateStr && (
            <div className="ktab-img-drawer__spec-item">
              <span className="ktab-img-drawer__spec-label">تاريخ الإنشاء</span>
              <span className="ktab-img-drawer__spec-val">
                <Calendar size={13} className="ktab-img-drawer__spec-icon" />
                {dateStr}
              </span>
            </div>
          )}
        </div>

        {/* Creative Style Notes */}
        {image.styleNotes && (
          <div className="ktab-img-drawer__section">
            <h5 className="ktab-img-drawer__section-title">
              الملاحظات والتوجيه الفني
            </h5>
            <p className="ktab-img-drawer__stylenotes-text">
              {image.styleNotes}
            </p>
          </div>
        )}
      </div>
    </DetailsDrawer>
  );
}

export default ImageDetailsDrawer;
