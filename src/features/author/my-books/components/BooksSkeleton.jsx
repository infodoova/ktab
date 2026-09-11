import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function BooksSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-[2rem] p-4 border border-black/5 space-y-4">
          <Skeleton className="w-full aspect-[1/1.4] rounded-2xl bg-slate-100" />
          <Skeleton className="h-5 w-3/4 bg-slate-100 rounded-lg" />
          <Skeleton className="h-4 w-1/2 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default BooksSkeleton;
