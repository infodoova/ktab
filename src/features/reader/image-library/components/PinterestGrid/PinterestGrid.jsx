import React from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { PinterestCard } from "../PinterestCard/PinterestCard";
import "./PinterestGrid.css";

const SKELETON_RATIOS = ["3/4", "2/3", "1/1", "16/9", "3/4", "2/3"];

/**
 * Pinterest-style multi-column masonry layout for displaying
 * generated book illustrations with varied aspect ratios.
 */
export function PinterestGrid({
  images = [],
  loading = false,
  loadingMore = false,
  page = 0,
  totalPages = 1,
  onLoadMore,
  onOpenDetails,
  onDownload,
  onShare,
  onDelete,
  onResetFilters,
  hasActiveFilters = false,
}) {
  if (loading && images.length === 0) {
    return (
      <div className="ktab-pinterest-grid" dir="rtl">
        {SKELETON_RATIOS.map((ratio, idx) => (
          <div
            key={`grid-skel-${idx}`}
            className="ktab-pinterest-grid__skeleton-card"
            style={{ aspectRatio: ratio }}
          />
        ))}
      </div>
    );
  }

  if (!loading && images.length === 0) {
    return (
      <div className="ktab-pinterest-empty" dir="rtl">
        <div className="ktab-pinterest-empty__icon-box">
          <ImageOff size={34} strokeWidth={1.5} />
        </div>
        <h2 className="ktab-pinterest-empty__title">لا توجد صور مُنشأة</h2>
        <p className="ktab-pinterest-empty__desc">
          {hasActiveFilters
            ? "لم يتم العثور على صور تطابق خيارات التصفية الحالية. يمكنك إعادة تعيين الفلاتر لعرض كافة الصور."
            : "لم تقم بتوليد أي صور للكتب بعد. يمكنك توليد صور أثناء قراءة أي كتاب في وضع القارئ."}
        </p>
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            className="ktab-pinterest-empty__btn"
            onClick={onResetFilters}
          >
            إعادة تعيين خيارات التصفية
          </button>
        )}
      </div>
    );
  }

  const hasMore = page < totalPages - 1;

  return (
    <div className="ktab-pinterest-container" dir="rtl">
      {/* CSS Column Masonry Grid */}
      <div className="ktab-pinterest-grid">
        {images.map((image) => (
          <PinterestCard
            key={image.imageId || `${image.bookId}-${image.imageUrl}`}
            image={image}
            onOpenDetails={onOpenDetails}
            onDownload={onDownload}
            onShare={onShare}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Infinite/Load More Controls */}
      {hasMore && (
        <div className="ktab-pinterest-loadmore-wrap">
          <button
            type="button"
            className="ktab-pinterest-loadmore-btn"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 size={16} className="ktab-pinterest-spinner" />
                <span>جاري تحميل المزيد...</span>
              </>
            ) : (
              <span>عرض المزيد من الصور</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default PinterestGrid;
