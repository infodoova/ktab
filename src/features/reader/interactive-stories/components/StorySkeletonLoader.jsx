import React from "react";

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-white/10 rounded-full" />
        <div className="h-5 w-3/4 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

export function StorySkeletonLoader({ count = 8 }) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

export default StorySkeletonLoader;
