import React, { useState } from "react";
import "./imageSkeletonLoaderCP.css";

export const ResponsiveImageSkeleton = React.memo(function ResponsiveImageSkeleton({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  rounded = "",
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      key={src}
      className={`ktab-img-skeleton-container ${rounded} ${className}`}
    >
      {/* Modern Light Shimmer Skeleton */}
      {!loaded && !error && (
        <div className="ktab-img-skeleton-placeholder">
          <div className="ktab-img-skeleton-shimmer" />
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`ktab-img-skeleton-img ${
          loaded && !error
            ? "ktab-img-skeleton-img--visible"
            : "ktab-img-skeleton-img--hidden"
        } ${imgClassName}`}
      />

      {/* Error Message */}
      {error && (
        <div className="ktab-img-skeleton-error">
          خطأ في التحميل
        </div>
      )}
    </div>
  );
});

export const ImageSkeletonLoaderCP = ResponsiveImageSkeleton;
export default ResponsiveImageSkeleton;
