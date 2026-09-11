import React from "react";

/**
 * Skeleton placeholder for book cards.
 */
export function SkeletonBookLoader() {
  return (
    <div className="relative flex flex-col gap-3 cursor-pointer animate-pulse rounded-[1.5rem] border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* Cover Skeleton */}
      <div className="aspect-[3/4] w-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
        <div className="w-12 h-16 bg-gray-200/50 rounded-lg" />
      </div>

      {/* Card Content Skeleton */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        <div className="border-t border-black/10 pt-3 flex items-center justify-between">
          <div className="h-3 bg-gray-100 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonBookLoader;
