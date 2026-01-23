export default function SkeletonBookLoader() {
  return (
    <div className="relative flex flex-col gap-3 animate-pulse rounded-[20px] bg-black/5 overflow-hidden">
      {/* COVER IMAGE SKELETON */}
      <div className="aspect-[2/3] w-full bg-black/10"></div>

      {/* CARD CONTENT SKELETON */}
      <div className="px-1 mt-2 flex flex-col gap-2">
        {/* TITLE SKELETON */}
        <div className="h-4 bg-black/10 rounded-full w-3/4"></div>
        <div className="h-3 bg-black/5 rounded-full w-1/2"></div>
      </div>
    </div>
  );
}
