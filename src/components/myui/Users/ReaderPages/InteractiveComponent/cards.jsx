import React from "react";

function Cards({ stories = [], onStoryClick }) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
    >
      {stories.map((story) => (
        <button
          key={story.id}
          type="button"
          onClick={() => onStoryClick?.(story)}
          className="group text-right bg-white/85 backdrop-blur rounded-2xl shadow-sm border border-white/70 overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--earth-brown)]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--earth-brown)]/50"
        >
          <div className="relative">
            <img
              src={story.cover || "https://picsum.photos/400/300?blur=3"}
              alt={story.title}
              className="h-28 sm:h-40 lg:h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-90" />

            {story.genre ? (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--earth-brown)] shadow-sm border border-white/60">
                  {story.genre}
                </span>
              </div>
            ) : null}
          </div>

          <div className="p-3 sm:p-4">
            <h3 className="text-sm sm:text-lg font-bold text-gray-800 mt-0.5 line-clamp-2">
              {story.title}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
}

export default Cards;
