import React from "react";
import { Badge } from "@/components/ui/badge";

function Cards({ stories = [], onStoryClick }) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {stories.map((story) => (
        <button
          key={story.id}
          type="button"
          onClick={() => onStoryClick?.(story)}
          className="group text-right bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
        >
          {/* Image Section */}
          <div className="relative overflow-hidden aspect-[3/4] bg-[var(--earth-cream)]">
            {story.cover ? (
              <img
                src={story.cover}
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--earth-brown)] opacity-20">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Genre Badge */}
            {story.genre && (
              <div className="absolute top-2 right-2">
                <Badge 
                  variant="secondary" 
                  className="bg-white/95 backdrop-blur-sm text-black border-0 text-[11px] font-semibold px-2.5 py-0.5 shadow-lg"
                >
                  {story.genre}
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
              {story.title}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
}

export default Cards;
