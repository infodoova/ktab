import React, { memo, useState, useEffect, useRef } from "react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import "./FlipboardPage.css";

// In-memory set of loaded image URLs in the current session (prevents reloading flash on page turns)
const loadedImageUrls = new Set();

/**
 * Clean & lightweight image component with smooth shimmer skeleton loader
 */
export const FlipboardImage = memo(function FlipboardImage({
  src,
  alt = "",
  className = "",
  loading = "eager",
}) {
  const [isLoaded, setIsLoaded] = useState(() => (src ? loadedImageUrls.has(src) : false));
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    if (loadedImageUrls.has(src)) {
      setIsLoaded(true);
      return;
    }
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      loadedImageUrls.add(src);
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    if (src) loadedImageUrls.add(src);
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (!src) {
    return (
      <div className="flipboard-page__image-placeholder">
        <img src={brandIconImg} alt="" className="flipboard-page__fallback-logo" />
      </div>
    );
  }

  return (
    <div className="flipboard-img-container">
      {!isLoaded && !hasError && (
        <div className="flipboard-img-skeleton" aria-hidden="true">
          <div className="flipboard-img-skeleton__shimmer" />
          <div className="flipboard-img-skeleton__spinner" />
        </div>
      )}
      {hasError ? (
        <div className="flipboard-img-fallback">
          <img src={brandIconImg} alt="" className="flipboard-page__fallback-logo" />
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} flipboard-img-element ${
            isLoaded ? "flipboard-img-element--loaded" : ""
          }`}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});

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
            {image ? (
              <FlipboardImage
                src={image}
                alt={title || "غلاف الحكاية"}
                className="flipboard-page__cover-filled-img"
                loading="eager"
              />
            ) : (
              <div className="flipboard-page__fallback-wrap">
                <img src={brandIconImg} alt="" className="flipboard-page__fallback-logo" />
                <h2 className="flipboard-page__fallback-title">{title}</h2>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          2. Standard Story Page (1:1 image + 1-2 small sentences)
          ------------------------------------------------------------------ */}
      {type === "story" && (
        <div className="flipboard-page__wrapper">
          <div className="flipboard-page__image-wrap">
            {image ? (
              <FlipboardImage
                src={image}
                alt=""
                className="flipboard-page__image"
                loading="eager"
              />
            ) : (
              <div className="flipboard-page__image-placeholder">
                <img src={brandIconImg} alt="" className="flipboard-page__fallback-logo" />
              </div>
            )}
          </div>

          <div
            className={`flipboard-page__text-wrap ${
              isVerticalFullscreen ? "flipboard-page__text-wrap--glass" : ""
            }`}
          >
            <p className="flipboard-page__narrative">{narrative}</p>
          </div>

          {totalPages > 1 && (
            <div className="flipboard-page__footer">
              <span className="flipboard-page__counter">
                {page.pageNumber || pageIndex + 1}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------
          3. Ending Narrative Page (Pure text & image, zero buttons)
          ------------------------------------------------------------------ */}
      {type === "ending" && (
        <div className="flipboard-page__wrapper">
          <div className="flipboard-page__image-wrap">
            {image ? (
              <FlipboardImage
                src={image}
                alt=""
                className="flipboard-page__image"
                loading="eager"
              />
            ) : (
              <div className="flipboard-page__image-placeholder">
                <img src={brandIconImg} alt="" className="flipboard-page__fallback-logo" />
              </div>
            )}
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
          </div>

          {totalPages > 1 && (
            <div className="flipboard-page__footer">
              <span className="flipboard-page__counter">
                {page.pageNumber || pageIndex + 1}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default FlipboardPage;

