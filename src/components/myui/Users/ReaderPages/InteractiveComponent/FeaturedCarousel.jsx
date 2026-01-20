import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

function FeaturedCarousel({ stories = [], onStoryClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isAutoPlaying || stories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, stories.length]);

  if (stories.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // For RTL: swipe right = next, swipe left = previous
    if (isRightSwipe) {
      nextSlide();
    }
    if (isLeftSwipe) {
      prevSlide();
    }
  };

  const currentStory = stories[currentIndex];

  return (
    <div className="relative w-full mb-8 md:mb-12" dir="rtl">
      <div className="relative group">
        {/* Carousel Container */}
        <div 
          ref={carouselRef}
          className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-[28px] overflow-hidden bg-[var(--earth-cream)] touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            {currentStory.cover ? (
              <img
                src={currentStory.cover}
                alt={currentStory.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--earth-brown)] opacity-10">
                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12 lg:p-16">
            <div className="max-w-3xl space-y-3 sm:space-y-4 md:space-y-6">
              {/* Genre Badge */}
              {currentStory.genre && (
                <div className="inline-flex">
                  <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide">
                    {currentStory.genre}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                {currentStory.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed line-clamp-2 md:line-clamp-3 max-w-2xl">
                {currentStory.description || (currentStory.constitution ? 
                  `${currentStory.constitution.coreTheme || ""} ${currentStory.constitution.settingPlace ? `في ${currentStory.constitution.settingPlace}.` : ""}`.trim() : 
                  "")}
              </p>

              {/* CTA Button */}
              <button
                onClick={() => onStoryClick?.(currentStory)}
                className="
                  inline-flex items-center justify-center gap-2
                  h-10 sm:h-11 md:h-12 px-6 sm:px-7 md:px-8
                  bg-white text-black rounded-full 
                  font-semibold text-sm sm:text-[15px]
                  hover:bg-white/90
                  transition-all duration-200 
                  active:scale-95
                  shadow-2xl
                "
              >
                <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-black" />
                <span>ابدأ القراءة</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows - Desktop Only */}
          <button
            onClick={nextSlide}
            className="
              hidden md:block
              absolute left-6 top-1/2 -translate-y-1/2
              h-11 w-11 rounded-full bg-black/30 backdrop-blur-md
              border border-white/10 text-white
              hover:bg-black/50 transition-all duration-200
              opacity-0 group-hover:opacity-100
              active:scale-95
            "
            aria-label="Next"
          >
            <ChevronLeft className="h-5 w-5 mx-auto" strokeWidth={2.5} />
          </button>
          <button
            onClick={prevSlide}
            className="
              hidden md:block
              absolute right-6 top-1/2 -translate-y-1/2
              h-11 w-11 rounded-full bg-black/30 backdrop-blur-md
              border border-white/10 text-white
              hover:bg-black/50 transition-all duration-200
              opacity-0 group-hover:opacity-100
              active:scale-95
            "
            aria-label="Previous"
          >
            <ChevronRight className="h-5 w-5 mx-auto" strokeWidth={2.5} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1.5 mt-4 sm:mt-5 md:mt-6">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${
                  index === currentIndex
                    ? "w-6 bg-[var(--earth-brown)]"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedCarousel;
