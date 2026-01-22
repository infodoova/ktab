import React from "react";

const SkeletonCard = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="aspect-[2/3] w-full rounded-[2.5rem] bg-black/5" />
    <div className="space-y-2 px-2">
      <div className="h-5 w-3/4 bg-black/5 rounded-full" />
      <div className="h-3 w-1/2 bg-black/5 rounded-full" />
    </div>
  </div>
);

export default function StorySkeletonLoader({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}