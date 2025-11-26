export default function SkeletonBookLoader() {
  return (
    <div className="animate-pulse rounded-xl border border-[var(--earth-sand)] bg-[var(--earth-paper)] shadow overflow-hidden flex flex-col h-full">
      {/* COVER IMAGE SKELETON */}
      <div className="aspect-[2/3] w-full bg-gradient-to-br from-[var(--earth-sand)] to-[var(--earth-sand)]/60"></div>

      {/* CARD CONTENT SKELETON */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* TITLE SKELETON */}
        <div className="h-4 bg-[var(--earth-sand)] rounded w-3/4"></div>
        <div className="h-3 bg-[var(--earth-sand)] rounded w-1/2"></div>

        {/* INFO GRID SKELETON */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--earth-sand)]/20 p-2 rounded-lg h-12"></div>
          <div className="bg-[var(--earth-sand)]/20 p-2 rounded-lg h-12"></div>
          <div className="col-span-2 bg-[var(--earth-sand)]/20 p-2 rounded-lg h-12"></div>
        </div>

        {/* FOOTER SKELETON */}
        <div className="border-t border-[var(--earth-sand)]/30 pt-2 flex items-center justify-between">
          <div className="h-3 bg-[var(--earth-sand)] rounded w-12"></div>
          <div className="h-3 bg-[var(--earth-sand)] rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}
