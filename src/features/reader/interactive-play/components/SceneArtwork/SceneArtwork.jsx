import React, { useState } from "react";
import { ZoomIn, Image as ImageIcon } from "lucide-react";
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
      dir="rtl"
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
        <div className="ktab-scene-artwork__skeleton" aria-label="جاري إعداد صورة المشهد">
          {/* Moving diagonal glass shimmer sweep */}
          <div className="ktab-scene-artwork__shimmer" aria-hidden="true" />

          {/* Central Pro Loader */}
          <div className="ktab-scene-artwork__loader-center">
            <div className="ktab-scene-artwork__ring-box">
              <div className="ktab-scene-artwork__spinning-ring" />
              <div className="ktab-scene-artwork__icon-center">
                <ImageIcon size={22} strokeWidth={1.8} />
              </div>
            </div>
          </div>
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
