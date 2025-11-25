import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="w-full space-y-14 animate-pulse rtl">
      
      {/* 1. Header & Greeting Skeleton */}
      <div className="space-y-4 text-right">
        <div className="h-10 w-48 bg-gray-200 rounded-lg ms-auto"></div>
        <div className="h-5 w-80 bg-gray-200 rounded-lg ms-auto opacity-60"></div>
      </div>

      {/* 2. Stats Grid Skeleton (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-3xl border border-gray-300/50"></div>
        ))}
      </div>

      {/* 3. Books Section Skeleton */}
      <div className="space-y-6">
        {/* Section Title */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>

        {/* Books List (Grid on mobile, List on desktop) */}
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="flex flex-col md:flex-row gap-4 p-3 bg-white border border-gray-100 rounded-xl h-auto md:h-36"
            >
              {/* Image Placeholder */}
              <div className="w-full md:w-32 h-32 md:h-full bg-gray-200 rounded-lg shrink-0"></div>
              
              {/* Content Placeholder */}
              <div className="flex-1 flex flex-col justify-between space-y-3 md:py-2">
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 rounded opacity-60"></div>
                </div>
                <div className="flex gap-2 mt-auto">
                   <div className="h-8 flex-1 bg-gray-200 rounded-lg"></div>
                   <div className="h-8 flex-1 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}