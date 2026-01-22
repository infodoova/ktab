import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Cards({ stories = [], onStoryClick, isDark = false }) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
    >
      {stories.map((story) => (
        <button
          key={story.id}
          type="button"
          onClick={() => onStoryClick?.(story)}
          className="group relative flex flex-col gap-4 text-right transition-all duration-500 hover:-translate-y-2 outline-none"
        >
          {/* Image Section */}
          <div className={cn(
            "relative aspect-square w-full rounded-[2.5rem] overflow-hidden border transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#5de3ba]/10",
            isDark 
              ? "bg-white/5 border-white/5 shadow-none" 
              : "border-black/5 bg-slate-50 shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
          )}>
            {story.coverImageUrl ? (
              <img
                src={story.coverImageUrl}
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className={cn(
                "w-full h-full flex items-center justify-center transition-colors",
                isDark ? "text-white/10" : "text-black/10"
              )}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
            
            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Genre Badge */}
            {story.genre && (
              <div className="absolute top-4 right-4">
                <span className={cn(
                  "px-3 py-1.5 rounded-xl border backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-[#5de3ba] shadow-sm transition-colors",
                  isDark ? "bg-black/40 border-white/10" : "bg-white/90 border-white"
                )}>
                  {story.genre}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="px-2 space-y-2">
            <h3 className={cn(
               "text-lg font-black leading-tight line-clamp-2 tracking-tight group-hover:text-[#5de3ba] transition-colors duration-300",
               isDark ? "text-white" : "text-black"
            )}>
              {story.title}
            </h3>
            <div className={cn(
              "flex items-center gap-2 group-hover:text-[#5de3ba]/30 transition-colors",
              isDark ? "text-white/20" : "text-black/20"
            )}>
               <div className="h-0.5 w-8 bg-current rounded-full" />
               <span className="text-[9px] font-black uppercase tracking-widest">عرض التفاصيل</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default Cards;
