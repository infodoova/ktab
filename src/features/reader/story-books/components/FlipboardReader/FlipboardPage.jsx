import React, { memo, useState, useRef } from "react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import "./FlipboardPage.css";

// In-memory set of loaded image URLs in the current session (prevents reloading flash on page turns)
export const loadedImageUrls = new Set();

/**
 * Clean & lightweight image component with smooth shimmer skeleton loader
 */
export const FlipboardImage = memo(function FlipboardImage({
  src,
  alt = "",
  className = "",
  loading = "eager",
}) {
  const isCached = Boolean(src && loadedImageUrls.has(src));
  const [isLoaded, setIsLoaded] = useState(isCached);
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const imgRef = useRef(null);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setIsLoaded(isCached);
    setHasError(false);
  }

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
        <div className="flipboard-img-loader" aria-hidden="true">
          <div className="flipboard-img-spinner" />
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
 * Pure 1:1 Full-Artwork Story Page with Closed Captions (CC) Overlay:
 * - 100% full-page 1:1 square artwork edge-to-edge
 * - Narrative text overlaid as cinematic Closed Captions (CC)
 * - Discreet corner page counter
 */
export const FlipboardPage = memo(function FlipboardPage({
  page,
  pageIndex,
  totalPages,
  isMobileSlot = false,
  slotPosition = "top",
}) {
  if (!page) return null;

  const {
    type = "story",
    title,
    image,
    narrative,
    celebrationText,
    textZone = "BOTTOM_SPAN",
  } = page;

  const showCounter = totalPages > 1 && type !== "cover";
  const hasTextContent = Boolean(narrative || celebrationText || (type === "cover" && title));
  const showTextOverlay = hasTextContent && textZone !== "NONE";
  const zoneClass = textZone ? `flipboard-page__cc-container--${textZone.toLowerCase().replace(/_/g, "-")}` : "flipboard-page__cc-container--bottom-span";

  return (
    <div
      className={`flipboard-page flipboard-page--${type} ${
        isMobileSlot ? "flipboard-page--mobile-slot" : ""
      } ${isMobileSlot && slotPosition ? `flipboard-page--slot-${slotPosition}` : ""}`}
      dir="rtl"
    >
      <div className="flipboard-page__canvas">
        {/* 1. Full 1:1 Artwork (Edge-to-Edge) */}
        {image ? (
          <FlipboardImage
            src={image}
            alt={title || "مشهد القصة"}
            className="flipboard-page__artwork"
            loading="eager"
          />
        ) : (
          <div className="flipboard-page__fallback-art">
            <img src={brandIconImg} alt="" className="flipboard-page__fallback-logo" />
            {title && <span className="flipboard-page__fallback-title">{title}</span>}
          </div>
        )}

        {/* 2. Closed Captions (CC) Overlay with Arabic Safe Zone Positioning */}
        {showTextOverlay && (
          <div className={`flipboard-page__cc-container ${zoneClass}`} dir="rtl">
            <div className="flipboard-page__cc-pill">
              {celebrationText && (
                <span className="flipboard-page__cc-badge">{celebrationText}</span>
              )}
              {type === "cover" && !narrative && title && (
                <span className="flipboard-page__cc-title">{title}</span>
              )}
              {narrative && (
                <p className="flipboard-page__cc-text">{narrative}</p>
              )}
            </div>
          </div>
        )}

        {/* 3. Discreet Corner Page Badge */}
        {showCounter && (
          <div className="flipboard-page__counter-badge" aria-label={`صفحة ${page.pageNumber || pageIndex + 1}`}>
            {page.pageNumber || pageIndex + 1}
          </div>
        )}
      </div>
    </div>
  );
});

export default FlipboardPage;

