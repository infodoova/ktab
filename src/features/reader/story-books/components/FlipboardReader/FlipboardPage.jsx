import React, { memo } from "react";
import bunnyCover from "@/assets/images/children-stories/bunny.jpg";
import "./FlipboardPage.css";

/**
 * Pure presentation page component strictly designed for children's books:
 * - 1 square (1:1) artwork image per page
 * - 1 to 2 small sentences at max per page
 * - Starts immediately on page 1 with zero delay
 * - Zero bottom buttons across all pages
 * - Ends with the book cover filled
 */
export const FlipboardPage = memo(function FlipboardPage({
  page,
  pageIndex,
  totalPages,
  isVerticalFullscreen = false,
}) {
  if (!page) return null;

  const {
    type = "story",
    title,
    image,
    narrative,
    celebrationText,
  } = page;

  const handleImageError = (e) => {
    if (e?.currentTarget && e.currentTarget.src !== bunnyCover) {
      e.currentTarget.src = bunnyCover;
    }
  };

  return (
    <div
      className={`flipboard-page flipboard-page--${type} ${
        isVerticalFullscreen ? "flipboard-page--fullscreen" : ""
      }`}
      dir="rtl"
    >
      {/* ------------------------------------------------------------------
          1. Cover Page (Book Cover Filled - Placed at the end of the story)
          ------------------------------------------------------------------ */}
      {type === "cover" && (
        <div className="flipboard-page__wrapper flipboard-page__wrapper--cover-filled">
          <div className="flipboard-page__cover-filled-wrap">
            <img
              src={image || bunnyCover}
              alt={title || "غلاف الحكاية"}
              className="flipboard-page__cover-filled-img"
              onError={handleImageError}
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          2. Standard Story Page (1:1 image + 1-2 small sentences)
          ------------------------------------------------------------------ */}
      {type === "story" && (
        <div className="flipboard-page__wrapper">
          <div className="flipboard-page__image-wrap">
            <img
              src={image || bunnyCover}
              alt=""
              className="flipboard-page__image"
              onError={handleImageError}
              loading="eager"
            />
          </div>

          <div
            className={`flipboard-page__text-wrap ${
              isVerticalFullscreen ? "flipboard-page__text-wrap--glass" : ""
            }`}
          >
            <p className="flipboard-page__narrative">{narrative}</p>
            {totalPages > 1 && (
              <span className="flipboard-page__counter">
                {page.pageNumber || pageIndex + 1} / {totalPages}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          3. Ending Narrative Page (Pure text & image, zero buttons)
          ------------------------------------------------------------------ */}
      {type === "ending" && (
        <div className="flipboard-page__wrapper">
          <div className="flipboard-page__image-wrap">
            <img
              src={image || bunnyCover}
              alt=""
              className="flipboard-page__image"
              onError={handleImageError}
              loading="eager"
            />
          </div>

          <div
            className={`flipboard-page__text-wrap ${
              isVerticalFullscreen ? "flipboard-page__text-wrap--glass" : ""
            }`}
          >
            {celebrationText && (
              <h2 className="flipboard-page__ending-title">{celebrationText}</h2>
            )}
            <p className="flipboard-page__narrative">{narrative}</p>
            {totalPages > 1 && (
              <span className="flipboard-page__counter">
                {page.pageNumber || pageIndex + 1} / {totalPages}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default FlipboardPage;

