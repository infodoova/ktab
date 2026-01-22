import React, { useState } from "react";

const ResponsiveImageSkeleton = React.memo(function ResponsiveImageSkeleton({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  rounded = "rounded-xl",
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      key={src}
      className={`
        relative overflow-hidden 
        bg-neutral-900
        ${rounded} 
        ${className}
      `}
    >
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-layer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 100%
          );
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Modern Dark Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-neutral-800/50 overflow-hidden">
          <div className="shimmer-layer absolute inset-0" />
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`
          h-full w-full object-cover 
          ${loaded && !error ? "opacity-100" : "opacity-0"}
          ${imgClassName}
        `}
      />

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20">
          خطأ في التحميل
        </div>
      )}
    </div>
  );
});

export default ResponsiveImageSkeleton;
