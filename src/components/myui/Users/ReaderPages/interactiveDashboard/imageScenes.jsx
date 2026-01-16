import React, { useState } from "react";

/**
 * ImageScenes Component
 * Displays the scene image with beautiful effects and animations
 * Pure presentation component - all logic in mainComp
 */
function ImageScenes({ image, sceneNumber = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="mb-1 md:mb-2 relative flex justify-center">
      {/* Main image container - perfect 16:9 aspect ratio with controlled size */}
      <div className="relative overflow-hidden rounded-lg shadow-sm w-full max-w-lg aspect-video">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--earth-sand)] via-[var(--earth-cream)] to-[var(--earth-sand)] animate-pulse" />
        )}

        {/* Error state */}
        {imageError && (
          <div className="h-full bg-gradient-to-br from-[var(--earth-sand)] to-[var(--earth-cream)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">🖼️</div>
              <p className="text-[var(--earth-brown)] text-xs">تعذر تحميل الصورة</p>
            </div>
          </div>
        )}

        {/* Actual image */}
        <img
          src={image}
          alt={`Scene ${sceneNumber + 1}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`
            w-full h-full object-cover
            transition-all duration-700
            ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          `}
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--earth-brown-dark)]/40 via-[var(--earth-brown)]/10 to-transparent pointer-events-none" />

        {/* Vignette effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(62,39,35,0.3)] pointer-events-none" />

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[var(--earth-sand)]/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-[var(--earth-sand)]/20 to-transparent pointer-events-none" />

        {/* Scene number watermark */}
        <div className="absolute top-2 right-2 bg-[var(--earth-brown)]/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[var(--earth-sand)]/30">
          <span className="text-white text-xs font-bold">#{sceneNumber + 1}</span>
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
