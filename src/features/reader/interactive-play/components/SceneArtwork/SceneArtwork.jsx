import React, { useState } from "react";
import { ZoomIn, Sparkles } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import "./SceneArtwork.css";

/**
 * Scene artwork image maintaining strict 1:1 aspect ratio.
 * Features smooth image transitions, rich generating loader, and full-screen zoom trigger.
 */
export function SceneArtwork({ image, onImageClick, isGenerating }) {
  const [prevImage, setPrevImage] = useState(image);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  /* Reset image loading state during render when image prop changes */
  if (image !== prevImage) {
    setPrevImage(image);
    setLoaded(false);
    setError(false);
  }

  const showSkeleton = isGenerating || (!loaded && !error);

  return (
    <div
      className="ktab-scene-artwork"
      onClick={() => {
        if (image && !error) onImageClick?.(image);
      }}
      role="button"
      tabIndex={0}
      aria-label="تكبير صورة المشهد"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (image && !error) onImageClick?.(image);
        }
      }}
    >
      {showSkeleton && (
        <div className="ktab-scene-artwork__skeleton">
          <div className="ktab-scene-artwork__skeleton-inner">
            <div className="ktab-scene-artwork__spinner-container">
              <div className="ktab-scene-artwork__spinner-ring" />
              <Sparkles size={22} className="ktab-scene-artwork__spinner-icon" />
            </div>
            <div className="ktab-scene-artwork__skeleton-labels">
              <span className="ktab-scene-artwork__skeleton-title">
                جاري رسم لوحة المشهد...
              </span>
              <span className="ktab-scene-artwork__skeleton-sub">
                توليد الرسوم التوضيحية
              </span>
            </div>
          </div>
          <div className="ktab-scene-artwork__shimmer" />
        </div>
      )}

      {error ? (
        <div className="ktab-scene-artwork__fallback">
          <img
            src={brandIconImg}
            alt=""
            className="ktab-scene-artwork__fallback-logo"
            aria-hidden="true"
          />
          <span className="ktab-scene-artwork__fallback-text">صورة المشهد</span>
        </div>
      ) : (
        <img
          src={image}
          alt="صورة المشهد"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`ktab-scene-artwork__image ${
            loaded ? "ktab-scene-artwork__image--loaded" : "ktab-scene-artwork__image--loading"
          }`}
          loading="eager"
          decoding="async"
        />
      )}

      {loaded && !error && (
        <div className="ktab-scene-artwork__zoom-hint" aria-hidden="true">
          <ZoomIn size={16} />
        </div>
      )}
    </div>
  );
}

export default SceneArtwork;
