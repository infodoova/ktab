import React, { useState, useEffect, useCallback } from "react";
import { Play, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FeaturedCarousel({ stories = [], onStoryClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  }, [stories.length]);

  useEffect(() => {
    if (!isAutoPlaying || stories.length === 0) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, stories.length]);

  if (stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const nextStory = stories[(currentIndex + 1) % stories.length];

  return (
    <div className="relative w-full py-4 lg:py-10" dir="rtl">
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto lg:px-8">
        <div className="relative w-full flex flex-col lg:flex-row-reverse items-center lg:min-h-[600px] 
                        lg:rounded-[4rem] lg:overflow-hidden lg:border lg:border-black/5 lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
          
          {/* --- CHANGES STARTED HERE --- */}
          {/* ATMOSPHERIC BACKGROUND (Modified for clearer blurred image) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden lg:rounded-[4rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
              >
                {/* 1. The Image itself */}
                <img 
                  src={currentStory.coverImageUrl} 
                  // Changed: Reduced scale, significantly reduced blur (from 80px to 24px/3xl), removed saturation boost.
                  className="w-full h-full object-cover scale-110 blur-3xl" 
                  alt="" 
                />

                {/* 2. Dark Overlays for readability */}
                {/* Replaced white overlays with dark ones so white text pops against the image */}
                <div className="absolute inset-0 bg-black/20" /> 
                
                {/* Gradients to darken edges, especially where text lives */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
                
                {/* Subtle texture (kept this, it's nice) */}
                <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* --- CHANGES ENDED HERE --- */}


          {/* SHARED CONTENT WRAPPER */}
          <div className="relative z-10 w-full flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-24 
                          px-4 lg:px-16 py-6 lg:py-20">
            
            {/* IMAGE SECTION */}
            <div className="relative w-full sm:w-3/4 lg:w-[45%] group shrink-0">
              <div className="relative aspect-square w-full rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden shadow-xl lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-black/5 lg:border-white/50 bg-slate-50">
                <AnimatePresence mode="wait">
                    <motion.img
                      key={currentStory.id}
                      src={currentStory.coverImageUrl}
                      initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={currentStory.title}
                    />
                </AnimatePresence>
              </div>

              {/* NEXT SLIDE TEASER (Hidden on most mobile/tablets) */}
              <motion.div 
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="absolute -bottom-6 -left-6 hidden xl:flex w-44 h-44 rounded-[3rem] overflow-hidden border-[6px] border-white shadow-3xl cursor-pointer transition-transform duration-500 z-20"
              >
                <img 
                  src={nextStory.coverImageUrl} 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" 
                  alt="Next Story"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-100 hover:opacity-0 transition-opacity duration-500">
                    <ChevronLeft className="text-white w-6 h-6 animate-pulse" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest mt-2">تشويق التالي</span>
                </div>
              </motion.div>
            </div>

            {/* CONTENT SECTION */}
            <div className="flex-1 space-y-6 lg:space-y-10 text-right w-full lg:pr-6">
              <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 lg:space-y-10"
                  >
                    {/* Genre Badge (Desktop Only for height) */}
                    <span className="hidden lg:inline-block text-[11px] font-black uppercase tracking-[0.2em] text-[#5de3ba] px-6 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm">
                        {currentStory.genre || "خيال تفاعلي"}
                    </span>

                    {/* Title */}
                    {/* Added text-white/90 for better contrast on dark backgrounds, fallback to black if needed */}
                    <h2 className="text-3xl sm:text-4xl lg:text-7xl font-black text-black lg:text-white/90 leading-tight lg:leading-[1.1] tracking-tighter">
                        {currentStory.title}
                    </h2>

                    {/* Description (Desktop Only for height) */}
                    {/* Changed text color to white/70 for contrast */}
                    <p className="hidden lg:block text-base lg:text-xl text-black/60 lg:text-white/70 font-bold leading-relaxed max-w-2xl line-clamp-3 italic">
                        {currentStory.description || (currentStory.constitution ? 
                          `${currentStory.constitution.coreTheme || ""} ${currentStory.constitution.settingPlace ? `في ${currentStory.constitution.settingPlace}.` : ""} ${currentStory.constitution.tone ? `تمتاز هذه القصة بأسلوب ${currentStory.constitution.tone}.` : ""}`.trim() : 
                          "ادخل في أعماق هذه القصة التفاعلية واتخذ قراراتك التي ستغير مجرى الأحداث.")
                        }
                    </p>

                    {/* CTA Button */}
                    <div className="pt-2 flex justify-center lg:justify-start">
                        <button
                          onClick={() => onStoryClick?.(currentStory)}
                          className="btn-premium w-full sm:w-auto px-8 lg:px-16 py-4 lg:py-8 rounded-2xl lg:rounded-[2.5rem] text-white font-black text-[10px] lg:text-sm uppercase tracking-[0.2em] shadow-lg lg:shadow-[0_30px_60px_-15px_rgba(93,227,186,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 lg:gap-6"
                        >
                          <span>ابدأ مغامرتك</span>
                          <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Play size={10} className="fill-current translate-x-[1px]" />
                          </div>
                        </button>
                    </div>
                  </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCarousel;
