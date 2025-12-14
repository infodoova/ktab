import { useState } from "react";

export default function ResponsiveImageSkeleton({
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
        bg-[var(--earth-paper)]
        ${rounded} 
        ${className}
      `}
    >
      {/* Embedded CSS: Leaf Organic Skeleton */}
      <style>{`
        @keyframes leafShimmer {
          0% {
            transform: translateX(-120%) rotate(0deg);
          }
          100% {
            transform: translateX(120%) rotate(2deg);
          }
        }

        /* Leaf shape mask using radial gradients resembling leaf veins */
        .leaf-mask {
          background:
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%),
            radial-gradient(circle at 80% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%),
            radial-gradient(circle at 50% 80%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%);
          background-color: var(--earth-sand);
          filter: blur(8px);
          opacity: 0.7;
          animation: leafShimmer 2.2s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* Leaf Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[var(--earth-sand-dark)] overflow-hidden">
          {/* Leaf shimmer layer */}
          <div className="leaf-mask absolute inset-0" />
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
          transition-opacity duration-300
          ${loaded && !error ? "opacity-100" : "opacity-0"}
          ${imgClassName}
        `}
      />

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--earth-brown)]">
          خطأ في التحميل
        </div>
      )}
    </div>
  );
}
