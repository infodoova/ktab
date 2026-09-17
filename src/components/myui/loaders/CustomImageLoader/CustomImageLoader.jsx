import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import "./CustomImageLoader.css";

/**
 * Editorial Apple-inspired Image Loader Component.
 * Features a high-performance shimmer skeleton, progressive image fade-in,
 * and clean fallback error state without layout shifts or cartoonish badges.
 */
export const CustomImageLoader = React.memo(function CustomImageLoader({
  src,
  alt = "",
  aspectRatio,
  className = "",
  imgClassName = "",
  rounded = "rounded-xl",
  loading = "lazy",
  onLoad,
  onError,
}) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setLoaded(false);
    onError?.(e);
  };

  const style = aspectRatio ? { aspectRatio } : undefined;

  return (
    <div
      key={src}
      className={`ktab-img-loader ${rounded} ${className}`}
      style={style}
    >
      {/* Editorial Shimmer Skeleton */}
      {!loaded && !hasError && (
        <div className="ktab-img-loader__skeleton">
          <div className="ktab-img-loader__shimmer" />
        </div>
      )}

      {/* Target Image with buttery blur-in */}
      {!hasError && src && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`ktab-img-loader__image ${
            loaded ? "ktab-img-loader__image--loaded" : "ktab-img-loader__image--loading"
          } ${imgClassName}`}
        />
      )}

      {/* Clean Apple-style Error State */}
      {(hasError || !src) && (
        <div className="ktab-img-loader__fallback" aria-label="صورة غير متوفرة">
          <ImageIcon size={22} className="ktab-img-loader__fallback-icon" />
        </div>
      )}
    </div>
  );
});

export default CustomImageLoader;
