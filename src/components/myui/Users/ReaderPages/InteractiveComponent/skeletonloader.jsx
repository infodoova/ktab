import React from "react";

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl shadow-md overflow-hidden">
      <div className="h-48 w-full bg-white/10 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonLoader({ count = 8 }) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

export default SkeletonLoader;