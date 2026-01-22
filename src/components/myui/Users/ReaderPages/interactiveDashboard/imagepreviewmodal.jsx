import React from "react";

/**
 * ImagePreviewModal Component
 * A high-end full-screen image preview with deep blur and smooth animations
 */
function ImagePreviewModal({ isOpen, image, onClose, sceneNumber }) {
  if (!isOpen || !image) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500"
      onClick={onClose}
    >
      {/* Decorative background light leaks */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--earth-olive)]/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--earth-brown)]/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div
        className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center animate-in zoom-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Info and Close */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6 z-[210]">
          <div className="flex flex-col gap-1">
            <span className="text-[var(--earth-olive)] font-black text-xs uppercase tracking-[0.3em] drop-shadow-sm">
              معاينة المشهد
            </span>
            <span className="text-white/60 font-bold text-sm">
              المشهد رقم {sceneNumber}
            </span>
          </div>

          <button
            className="group p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/10 shadow-2xl backdrop-blur-md"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main Image Container */}
        <div className="relative w-full h-full flex items-center justify-center group/modal">
          {/* Subtle reflection under image */}
          <div className="absolute bottom-0 w-2/3 h-1/4 bg-white/5 blur-3xl rounded-full translate-y-1/2 opacity-20 pointer-events-none" />

          <img
            src={image}
            alt="Scene Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
}

export default ImagePreviewModal;
