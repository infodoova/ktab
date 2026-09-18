import React from "react";
import "./BookDetailsSkeleton.css";

/**
 * Editorial Apple Books-inspired Skeleton Loader for Book Details.
 * Renders high-fidelity shimmer placeholders for hero artwork, metadata, description, and reviews.
 */
export function BookDetailsSkeleton() {
  return (
    <div className="apple-details-skeleton" dir="rtl" aria-busy="true" aria-label="جاري تحميل تفاصيل العمل">
      {/* 1. Hero Section Skeleton */}
      <div className="apple-details-skeleton__hero">
        {/* Cover Artwork Shimmer Box */}
        <div className="apple-details-skeleton__artwork apple-skeleton-shimmer" />

        {/* Content & Details Column */}
        <div className="apple-details-skeleton__content">
          <div className="apple-details-skeleton__text-meta">
            {/* Genre Tag */}
            <div className="apple-details-skeleton__genre apple-skeleton-shimmer" />

            {/* Title Lines */}
            <div className="apple-details-skeleton__title-1 apple-skeleton-shimmer" />
            <div className="apple-details-skeleton__title-2 apple-skeleton-shimmer" />

            {/* Author */}
            <div className="apple-details-skeleton__author apple-skeleton-shimmer" />

            {/* Rating Stars Row */}
            <div className="apple-details-skeleton__rating apple-skeleton-shimmer" />
          </div>

          {/* Action Buttons Row */}
          <div className="apple-details-skeleton__actions">
            <div className="apple-details-skeleton__btn-primary apple-skeleton-shimmer" />
            <div className="apple-details-skeleton__btn-secondary apple-skeleton-shimmer" />
            <div className="apple-details-skeleton__btn-secondary apple-skeleton-shimmer" />
            <div className="apple-details-skeleton__btn-circle apple-skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* 2. Editorial Divider */}
      <div className="apple-details-skeleton__divider" />

      {/* 3. Publisher Description Skeleton */}
      <div className="apple-details-skeleton__desc">
        <div className="apple-details-skeleton__desc-heading apple-skeleton-shimmer" />
        <div className="apple-details-skeleton__line apple-skeleton-shimmer" style={{ width: "100%" }} />
        <div className="apple-details-skeleton__line apple-skeleton-shimmer" style={{ width: "95%" }} />
        <div className="apple-details-skeleton__line apple-skeleton-shimmer" style={{ width: "88%" }} />
        <div className="apple-details-skeleton__line apple-skeleton-shimmer" style={{ width: "62%" }} />
      </div>

      {/* 4. Metadata Strip Skeleton (7 Columns) */}
      <div className="apple-details-skeleton__strip">
        {[1, 2, 3, 4, 5, 6, 7].map((colIndex) => (
          <div key={colIndex} className="apple-details-skeleton__strip-col">
            <div className="apple-details-skeleton__strip-tag apple-skeleton-shimmer" />
            <div className="apple-details-skeleton__strip-mid apple-skeleton-shimmer" />
            <div className="apple-details-skeleton__strip-bot apple-skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* 5. Customer Reviews Skeleton */}
      <div className="apple-details-skeleton__reviews">
        <div className="apple-details-skeleton__reviews-header">
          <div className="apple-skeleton-shimmer" style={{ width: "11rem", height: "1.5rem", borderRadius: "0.375rem" }} />
          <div className="apple-skeleton-shimmer" style={{ width: "16rem", height: "0.875rem", borderRadius: "0.25rem", marginTop: "0.35rem" }} />
        </div>

        <div className="apple-details-skeleton__reviews-grid">
          {[1, 2, 3].map((cardIndex) => (
            <div key={cardIndex} className="apple-details-skeleton__review-card">
              <div className="apple-skeleton-shimmer" style={{ width: "6rem", height: "1rem", borderRadius: "9999px" }} />
              <div className="apple-skeleton-shimmer" style={{ width: "8rem", height: "0.85rem", borderRadius: "0.25rem" }} />
              <div className="apple-skeleton-shimmer" style={{ width: "100%", height: "0.875rem", borderRadius: "0.25rem" }} />
              <div className="apple-skeleton-shimmer" style={{ width: "85%", height: "0.875rem", borderRadius: "0.25rem" }} />
              <div className="apple-skeleton-shimmer" style={{ width: "60%", height: "0.875rem", borderRadius: "0.25rem" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookDetailsSkeleton;
