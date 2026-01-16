import React from "react";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-48 w-full bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
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