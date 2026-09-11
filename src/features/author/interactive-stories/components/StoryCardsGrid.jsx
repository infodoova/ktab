import React from "react";
import { MoreVertical, Trash, Eye, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StoryCardsGrid({
  stories = [],
  loading = false,
  loadingMore = false,
  page = 0,
  totalPages = 1,
  openMenuId,
  setOpenMenuId,
  onStoryClick,
  onDeleteClick,
  onLoadMore,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-4 border border-black/5 space-y-4 animate-pulse">
            <Skeleton className="w-full aspect-[1/1.3] rounded-2xl bg-slate-100" />
            <Skeleton className="h-5 w-3/4 bg-slate-100 rounded-lg" />
            <Skeleton className="h-4 w-1/2 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-16 border border-black/5 text-center space-y-3">
        <p className="text-slate-400 font-bold text-sm">
          لا توجد قصص تفاعلية مسجلة حالياً.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stories.map((story) => {
          const isOpen = openMenuId === story.id;

          return (
            <div
              key={story.id}
              onClick={() => onStoryClick(story)}
              className="relative group bg-white rounded-[2rem] p-4 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Menu */}
              <div className="absolute top-4 left-4 z-20 story-menu-area">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(isOpen ? null : story.id);
                  }}
                  className="p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-black/5 hover:bg-black/5 transition-all text-slate-600"
                  title="خيارات"
                >
                  <MoreVertical size={16} />
                </button>

                {isOpen && (
                  <div
                    className="absolute top-10 left-0 w-36 bg-white shadow-2xl rounded-2xl border border-black/5 p-2 text-xs font-bold z-30 story-menu-area animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        onDeleteClick(story);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
                    >
                      <span>حذف</span>
                      <Trash size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div className="relative w-full aspect-[1/1.3] rounded-2xl overflow-hidden mb-4 shadow-sm border border-black/5 bg-slate-100">
                <img
                  src={story.coverImageUrl || story.cover}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                  <Layers size={12} />
                  <span>{story.maxScenes || story.scenesCount || 0} مشهد</span>
                </div>
              </div>

              {/* Story Details */}
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-sm md:text-base line-clamp-1 group-hover:text-[#5de3ba] transition-colors">
                  {story.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 truncate">
                  {story.genre || story.visualStyle || "مغامرة تفاعلية"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {page + 1 < totalPages && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="btn-premium px-10 py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {loadingMore ? "جاري التحميل..." : "عرض المزيد من القصص"}
          </button>
        </div>
      )}
    </div>
  );
}

export default StoryCardsGrid;
