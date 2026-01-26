import React, { useState, useEffect, useCallback } from "react";

/**
 * ImagePreviewModal Component
 * A high-end full-screen image preview with deep blur, smooth animations,
 * and carousel functionality to navigate through all story images.
 */
function ImagePreviewModal({ isOpen, scenes = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Sync index when modal opens with a specific image
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setTransform({ scale: 1, x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Reset zoom when image changes
  useEffect(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, [currentIndex]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % scenes.length);
  }, [scenes.length]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + scenes.length) % scenes.length);
  }, [scenes.length]);

  // Zoom handling (Zoom at Pointer)
  const handleWheel = (e) => {
    e.stopPropagation();
    const delta = -e.deltaY;
    const factor = 0.15; // Slightly faster zoom
    const zoomDirection = delta > 0 ? 1 : -1;
    
    const newScale = Math.min(Math.max(1, transform.scale + (zoomDirection * factor * transform.scale)), 8);
    
    if (newScale === 1) {
      setTransform({ scale: 1, x: 0, y: 0 });
      return;
    }

    // Zoom-at-pointer logic
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate how far the mouse is from the current image center (in pixels)
    const imageCenterX = rect.width / 2 + transform.x;
    const imageCenterY = rect.height / 2 + transform.y;

    const dx = (mouseX - imageCenterX) / transform.scale;
    const dy = (mouseY - imageCenterY) / transform.scale;

    const newX = transform.x - dx * (newScale - transform.scale);
    const newY = transform.y - dy * (newScale - transform.scale);

    setTransform({
      scale: newScale,
      x: newX,
      y: newY
    });
  };

  // Pan handling
  const onMouseDown = (e) => {
    if (transform.scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const onMouseMove = (e) => {
    if (isDragging && transform.scale > 1) {
      // Direct update for responsiveness
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const onMouseUp = () => setIsDragging(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "ArrowRight") handlePrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || scenes.length === 0) return null;

  const currentScene = scenes[currentIndex];
  const displayImage = currentScene?.sceneImage;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black animate-in fade-in duration-500 overflow-hidden select-none"
      onClick={onClose}
      onWheel={handleWheel}
      dir="rtl"
    >
      {/* Immersive Background Blur */}
      {displayImage && (
        <div 
          className="absolute inset-0 opacity-20 blur-3xl scale-110 pointer-events-none transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${displayImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
      )}

      {/* Navigation Buttons - Only show when not zoomed in */}
      {transform.scale === 1 && (
        <div className="hidden md:flex absolute inset-0 items-center justify-between p-4 md:p-10 pointer-events-none z-[250]">
          <button
            className="pointer-events-auto p-4 md:p-6 bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all border border-white/10 backdrop-blur-md rounded-full group disabled:opacity-0"
            onClick={handlePrev}
            disabled={scenes.length <= 1}
          >
            <svg className="w-8 h-8 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            className="pointer-events-auto p-4 md:p-6 bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all border border-white/10 backdrop-blur-md rounded-full group disabled:opacity-0"
            onClick={handleNext}
            disabled={scenes.length <= 1}
          >
            <svg className="w-8 h-8 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
        onClick={(e) => {
          if (transform.scale > 1) e.stopPropagation();
          else onClose();
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Top Tray Overlay */}
        <div className={`absolute top-0 left-0 right-0 flex justify-between items-start pt-6 md:pt-10 px-6 md:px-10 z-[260] bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-20 transition-opacity duration-300 ${transform.scale > 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[var(--earth-olive)] font-black text-xs md:text-sm uppercase tracking-[0.3em] drop-shadow-2xl">
              المشهد {currentIndex + 1} من {scenes.length}
            </span>
            <span className="text-white/80 font-bold text-sm md:text-xl drop-shadow-lg">
              عرض كامل الشاشة
            </span>
            <div className="flex gap-2 mt-2">
               <span className="bg-white/10 text-[10px] text-white/60 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/5">
                 استخدم عجلة الماوس للتقريب
               </span>
            </div>
          </div>

          <button
            className="group p-3 md:p-5 bg-black/20 hover:bg-black/40 rounded-2xl text-white transition-all border border-white/10 shadow-2xl backdrop-blur-md"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:rotate-90 duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* The Image (with Zoom & Pan) */}
        <div className="w-full h-full flex items-center justify-center">
          {displayImage ? (
            <img
              key={currentIndex}
              src={displayImage}
              alt="Scene Full View"
              draggable={false}
              className={`
                w-full h-full object-contain 
                animate-in fade-in 
                ${isDragging ? 'cursor-grabbing select-none' : transform.scale > 1 ? 'cursor-grab' : ''}
                will-change-transform
              `}
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-white/20">
              <div className="w-16 h-16 border-4 border-white/10 border-t-white/30 rounded-full animate-spin" />
              <span className="font-bold tracking-widest uppercase">جاري التحميل...</span>
            </div>
          )}
        </div>

        {/* Bottom Tray Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 flex flex-col items-center gap-6 pb-8 md:pb-12 z-[260] bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 transition-opacity duration-300 ${transform.scale > 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex md:hidden items-center justify-between w-full max-w-[280px]">
             <button
              className="p-5 bg-black/40 rounded-full text-white border border-white/10 backdrop-blur-xl active:scale-95 transition-transform"
              onClick={handlePrev}
              disabled={scenes.length <= 1}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              className="p-5 bg-black/40 rounded-full text-white border border-white/10 backdrop-blur-xl active:scale-95 transition-transform"
              onClick={handleNext}
              disabled={scenes.length <= 1}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="flex gap-3 px-6 flex-wrap justify-center max-w-2xl">
            {scenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 shadow-xl ${
                  idx === currentIndex ? "w-12 bg-white" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Global Floating Reset Button (Visible only when zoomed) */}
        {transform.scale > 1 && (
          <button
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[300] px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl transition-all animate-in slide-in-from-bottom-8 flex items-center gap-3 font-black text-xs md:text-sm uppercase tracking-widest group active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              setTransform({ scale: 1, x: 0, y: 0 });
            }}
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            إعادة الضبط
          </button>
        )}
      </div>
    </div>
  );
}

export default ImagePreviewModal;

