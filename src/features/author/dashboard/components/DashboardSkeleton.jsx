import React from "react";
import { Skeleton } from "@/components/myui";

/**
 * Custom Liquid Glass Dashboard Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.2rem] p-6 md:p-7 border border-white/[0.12] flex flex-col justify-between h-44 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24 rounded-xl" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[380px] w-full rounded-[2.5rem]" />
        <Skeleton className="h-[380px] w-full rounded-[2.5rem]" />
      </div>

      {/* Table Skeleton */}
      <Skeleton className="h-96 w-full rounded-[2.5rem]" />
    </div>
  );
}

export default DashboardSkeleton;
