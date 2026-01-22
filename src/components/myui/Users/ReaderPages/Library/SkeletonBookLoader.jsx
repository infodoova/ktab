export default function SkeletonBookLoader() {
  return (
    <div className="relative flex flex-col gap-3 cursor-pointer animate-pulse rounded-[1.5rem] border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* MENU BUTTON SKELETON */}
      <div className="absolute top-2 left-2 z-20 book-menu-area">
        <button className="p-1.5 rounded-full bg-gray-50/50 backdrop-blur-md shadow-sm border border-black/10">
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
        </button>
      </div>

      {/* COVER IMAGE SKELETON */}
      <div className="aspect-[3/4] w-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
         <div className="w-12 h-16 bg-gray-200/50 rounded-lg"></div>
      </div>

      {/* CARD CONTENT SKELETON */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* TITLE SKELETON */}
        <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>

        {/* FOOTER SKELETON */}
        <div className="border-t border-black/10 pt-3 flex items-center justify-between">
          <div className="h-3 bg-gray-100 rounded-full w-12"></div>
        </div>
      </div>
    </div>
  );
}
