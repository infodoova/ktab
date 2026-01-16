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
          <div className="relative overflow-hidden aspect-[3/4]">
            <img
              src={story.cover || "https://picsum.photos/400/600?blur=3"}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
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
