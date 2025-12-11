export default function SkeletonBookLoader() {
  return (
    <div className="relative flex flex-col gap-3 cursor-pointer animate-pulse rounded-xl border border-[var(--earth-sand)] bg-[var(--earth-paper)] shadow overflow-hidden">
      {/* MENU BUTTON SKELETON */}
      <div className="absolute top-2 left-2 z-20 book-menu-area">
        <button className="p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow text-[var(--earth-brown)] hover:bg-[var(--earth-cream)]">
          <div className="w-4 h-4 bg-[var(--earth-sand)] rounded-full"></div>
        </button>
      </div>

      {/* COVER IMAGE SKELETON */}
      <div className="aspect-[1/1] w-full bg-gradient-to-br from-[var(--earth-sand)] to-[var(--earth-sand)]/60"></div>

      {/* CARD CONTENT SKELETON */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* TITLE SKELETON */}
        <div className="h-4 bg-[var(--earth-sand)] rounded w-3/4"></div>

     

        {/* FOOTER SKELETON */}
        <div className="border-t border-[var(--earth-sand)]/30 pt-2 flex items-center justify-between">
          <div className="h-3 bg-[var(--earth-sand)] rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}
