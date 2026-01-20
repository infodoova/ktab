import React, { useState } from "react";

/**
 * ImageScenes Component
 * Displays the scene image with beautiful effects and animations
 * Pure presentation component - all logic in mainComp
 */
function ImageScenes({ image, sceneNumber, onImageClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="mb-4 md:mb-6 relative flex justify-center w-full h-full">
      {/* Main image container - perfect 16:9 aspect ratio with controlled size */}
      <div
        className="relative overflow-hidden rounded-[2rem] shadow-2xl w-full h-full border border-white/10 cursor-zoom-in group/img"
        onClick={() => onImageClick?.(image)}
      >
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse" />
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
          alt={`Scene ${sceneNumber}`}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--earth-brown-dark)]/40 via-[var(--earth-brown)]/10 to-transparent pointer-events-none" />

        {/* Vignette effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(62,39,35,0.3)] pointer-events-none" />

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[var(--earth-sand)]/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-[var(--earth-sand)]/20 to-transparent pointer-events-none" />

        {/* Scene number watermark */}
        <div className="absolute top-2 right-2 bg-[var(--earth-brown)]/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[var(--earth-sand)]/30">
          <span className="text-white text-xs font-bold">#{sceneNumber}</span>
        </div>

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
