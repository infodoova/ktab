import React, { useState } from "react";

/**
 * ImageScenes Component
 * Displays the scene image with beautiful effects and animations
 * Pure presentation component - all logic in mainComp
 */
function ImageScenes({ image, onImageClick, isGenerating }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Reset image loaded state when image URL changes
  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [image]);

  const showSkeleton = isGenerating || (!imageLoaded && !imageError);

  return (
    <div className="mb-4 md:mb-6 relative flex justify-center w-full h-full">
      {/* Main image container - perfect 16:9 aspect ratio with controlled size */}
      <div
        className="relative overflow-hidden rounded-[2rem] shadow-2xl w-full aspect-video border border-white/10 cursor-zoom-in group/img"
        onClick={() => onImageClick?.(image)}
      >
        {/* Loading skeleton */}
        {showSkeleton && (
          <div className="absolute inset-0 bg-[var(--bg-dark)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[var(--primary-button)]/20 border-t-[var(--primary-button)] rounded-full animate-spin shadow-[0_0_20px_var(--primary-button)]/30" />
              <div className="h-2 w-32 bg-[var(--primary-button)]/10 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-[var(--primary-button)]/40 animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {imageError && (
          <div className="h-full bg-white/5 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2 opacity-20">🖼️</div>
              <p className="text-white/20 text-xs font-medium">
                تعذر تحميل الصورة
              </p>
            </div>
          </div>
        )}

        {/* Actual image */}
        <img
          src={image}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`
            w-full h-full object-cover
            transition-all duration-1000
            group-hover/img:scale-110
            ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          `}
        />

        {/* Interactive Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white/20 p-3 rounded-full border border-white/30 text-white transform scale-50 group-hover/img:scale-100 transition-transform duration-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Dynamic glow effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] pointer-events-none" />

       

        {/* Animated particles - smaller */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
          <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-[var(--earth-sand)] rounded-full animate-float" />
          <div className="absolute top-1/2 right-2/3 w-0.5 h-0.5 bg-[var(--earth-sand)] rounded-full animate-float-delay-1" />
          <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-[var(--earth-sand)] rounded-full animate-float-delay-2" />
        </div>
      </div>
    </div>
  );
}

export default ImageScenes;
