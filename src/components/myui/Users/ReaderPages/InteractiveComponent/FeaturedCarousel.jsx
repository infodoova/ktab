import React, { useState, useEffect, useCallback } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function FeaturedCarousel({ stories = [], onStoryClick, isDark = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  }, [stories.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  }, [stories.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      prevSlide();
    } else if (info.offset.x < -swipeThreshold) {
      nextSlide();
    }
  };

  return (
    <div className="relative w-full py-0 select-none overflow-hidden" dir="ltr">
      {/* --- FULL WIDTH CONTAINER --- */}
      <div className="w-full">
        <div className={cn(
          "relative w-full aspect-square md:aspect-auto md:h-[calc(100vh-80px)] transition-all duration-500",
          isDark 
            ? "bg-[#0f0f0f] border-b border-white/5 shadow-2xl" 
            : "bg-white border-b border-black/5 shadow-xl"
        )}>
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 35 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
              }}
              className="absolute inset-0 w-full h-full flex flex-col md:flex-row cursor-grab active:cursor-grabbing"
            >
              {/* IMAGE PART */}
              <div className="relative w-full h-full md:w-[55%] overflow-hidden pointer-events-none">
                <img 
                  src={currentStory.coverImageUrl} 
                  className="w-full h-full object-cover" 
                  alt={currentStory.title} 
                />
                {/* Mobile Gradient Overlay - Stronger for better text readability */}
                <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#0f0f0f]/95 via-[#0f0f0f]/70 to-[#0f0f0f]/30" />
                {/* PC Gradient Overlay */}
                <div className="hidden md:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0f0f0f] to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
                  <span className="px-5 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-[10px] md:text-xs font-black text-[#5de3ba] uppercase tracking-widest shadow-2xl">
                    {currentStory.genre || "رواية تفاعلية"}
                  </span>
                </div>

                {/* MOBILE CONTENT OVERLAY - Inside Image */}
                <div className="absolute inset-0 md:hidden flex flex-col justify-end p-6 pb-20 z-10" dir="rtl">
                  <div className="space-y-4 text-right">
                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
                      {currentStory.title}
                    </h2>

                    {/* Description - Mobile */}
                    <p className="text-white/70 text-sm font-medium leading-relaxed line-clamp-2">
                      {currentStory.description || "استعد لتجربة قصة تفاعلية فريدة حيث قراراتك هي التي ترسم النهاية وتحدد مصير الأبطال في عالم مليء بالمفاجآت."}
                    </p>

                    {/* Action Button - Mobile */}
                    <div className="pt-2">
                      <button
                        onClick={() => onStoryClick?.(currentStory)}
                        className="group w-full flex flex-row-reverse items-center justify-center gap-3 bg-[#5de3ba] hover:bg-[#4dd2aa] text-black h-14 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 active:scale-95 shadow-lg shadow-[#5de3ba]/30"
                      >
                        <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center">
                          <Play size={14} className="fill-current rotate-180" />
                        </div>
                        <span className="font-tajawal">ابدأ المغامرة</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTENT PART - Desktop Only */}
              <div className="hidden md:flex relative flex-1 h-full flex-col justify-center p-12 lg:p-20 text-right z-10" dir="rtl">
                <div className="space-y-6 lg:space-y-8">
                  {/* Title */}
                  <h2 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
                    {currentStory.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/60 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl line-clamp-3 italic">
                    {currentStory.description || "استعد لتجربة قصة تفاعلية فريدة حيث قراراتك هي التي ترسم النهاية وتحدد مصير الأبطال في عالم مليء بالمفاجآت."}
                  </p>

                  {/* Action Row */}
                  <div className="flex items-center justify-end gap-4 pt-4 lg:pt-8 text-right">
                    <button
                      onClick={() => onStoryClick?.(currentStory)}
                      className="group flex flex-row-reverse items-center justify-center gap-4 bg-[#5de3ba] hover:bg-[#4dd2aa] text-black h-20 px-14 rounded-3xl font-black uppercase text-base tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#5de3ba]/20"
                    >
                      <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                        <Play size={14} className="fill-current rotate-180" />
                      </div>
                      <span className="font-tajawal">ابدأ المغامرة</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* DOTS PAGINATION */}
          <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4 z-20">
            {stories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "h-1.5 md:h-2 rounded-full transition-all duration-500",
                  idx === currentIndex 
                    ? "w-8 md:w-12 bg-[#5de3ba]" 
                    : "w-1.5 md:w-2 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* SIDE NAVIGATION (PC ONLY) - Always Visible */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-24 h-full pointer-events-none z-20">
            <button 
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all pointer-events-auto hover:bg-[#5de3ba] hover:text-black hover:border-transparent hover:scale-110 active:scale-95 shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="hidden md:block absolute inset-y-0 right-0 w-24 h-full pointer-events-none z-20">
            <button 
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all pointer-events-auto hover:bg-[#5de3ba] hover:text-black hover:border-transparent hover:scale-110 active:scale-95 shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCarousel;
