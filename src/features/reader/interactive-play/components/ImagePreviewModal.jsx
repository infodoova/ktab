import React, { useState, useCallback } from "react";


/**
 * ImagePreviewModal Component
 * Full-screen zoomable artwork preview with carousel navigation.
 */
export function ImagePreviewModal({ isOpen, scenes = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync initial index when modal opens
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }


  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    if (scenes.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % scenes.length);
    }
  }, [scenes.length]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    if (scenes.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + scenes.length) % scenes.length);
    }
  }, [scenes.length]);

  if (!isOpen) return null;

  const currentScene = scenes[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {currentScene?.sceneImage && (
          <img
            src={currentScene.sceneImage}
            alt={`Scene ${currentIndex + 1}`}
            className="max-h-[80vh] max-w-full object-contain rounded-3xl shadow-2xl border border-white/10"
          />
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Carousel buttons */}
        {scenes.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all"
            >
              &#10094;
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all"
            >
              &#10095;
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImagePreviewModal;
