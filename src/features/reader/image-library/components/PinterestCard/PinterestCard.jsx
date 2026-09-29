import React, { useState } from "react";
import { Download, Share2, Trash2, Maximize2 } from "lucide-react";
import { ShareMenu } from "@/components/common";
import { getNormalizedRatio } from "../../utils/imageLibraryUtils";
import "./PinterestCard.css";

/**
 * Clean Pinterest Image Card.
 * Displays only the image strictly in its proportional aspect ratio.
 * No description, titles, or badges are shown on the card itself.
 * Clicking opens the left DetailsDrawer.
 */
export function PinterestCard({
  image,
  onOpenDetails,
  onDownload,
  onShare,
  onDelete,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const aspectRatio = getNormalizedRatio(image.aspectRatio);

  const handleActionClick = (e, callback) => {
    e.stopPropagation();
    callback(image);
  };

  return (
    <article
      className="ktab-pinterest-card"
      onClick={() => onOpenDetails(image)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetails(image);
        }
      }}
      aria-label={image.bookTitle ? `صورة من كتاب ${image.bookTitle}` : "صورة كتاب"}
      dir="rtl"
    >
      {/* Media Box strictly conforming to proportional aspect-ratio */}
      <div
        className="ktab-pinterest-card__media-box"
        style={{ aspectRatio }}
      >
        {!imageLoaded && !imageError && (
          <div className="ktab-pinterest-card__skeleton" />
        )}

        <img
          src={image.imageUrl}
          alt={image.bookTitle || "صورة من الكتاب"}
          loading="lazy"
          className={`ktab-pinterest-card__img ${
            imageLoaded ? "ktab-pinterest-card__img--loaded" : ""
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Hover Action Overlay */}
        <div className="ktab-pinterest-card__overlay">
          {/* Top: Expand icon */}
          <div className="ktab-pinterest-card__overlay-top">
            <button
              type="button"
              className="ktab-pinterest-card__action-btn"
              onClick={(e) => handleActionClick(e, onOpenDetails)}
              title="عرض التفاصيل الكاملة"
              aria-label="عرض التفاصيل"
            >
              <Maximize2 size={15} strokeWidth={2.2} />
            </button>
          </div>

          {/* Bottom: Download, Share, Delete */}
          <div className="ktab-pinterest-card__overlay-bottom">
            <div className="ktab-pinterest-card__actions-group">
              <button
                type="button"
                className="ktab-pinterest-card__action-btn"
                onClick={(e) => handleActionClick(e, onDownload)}
                title="تنزيل الصورة وحفظها"
                aria-label="تنزيل الصورة"
              >
                <Download size={15} strokeWidth={2.2} />
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
                  className="ktab-pinterest-card__action-btn"
                  onClick={(e) => e.stopPropagation()}
                  title="مشاركة الصورة"
                  aria-label="مشاركة الصورة"
                >
                  <Share2 size={15} strokeWidth={2.2} />
                </button>
              </ShareMenu>
            </div>

            <button
              type="button"
              className="ktab-pinterest-card__action-btn ktab-pinterest-card__action-btn--danger"
              onClick={(e) => handleActionClick(e, onDelete)}
              title="حذف الصورة"
              aria-label="حذف الصورة"
            >
              <Trash2 size={15} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PinterestCard;
