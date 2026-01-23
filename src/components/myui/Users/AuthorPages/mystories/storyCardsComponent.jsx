import React from "react";
import { MoreVertical, Trash2, Edit2, Sparkles, Compass, Ghost, Search as SearchIcon, Heart, Rocket, Baby, GraduationCap, Target, Eye } from "lucide-react";
import ResponsiveImageSkeleton from "../../../imageSkeletonLoaderCP";

const GENRE_ICONS = {
  fantasy: { icon: Sparkles, color: "text-amber-500" },
  adventure: { icon: Compass, color: "text-blue-500" },
  horror: { icon: Ghost, color: "text-purple-700" },
  mystery: { icon: SearchIcon, color: "text-indigo-600" },
  romance: { icon: Heart, color: "text-rose-500" },
  scifi: { icon: Rocket, color: "text-cyan-500" },
  kids: { icon: Baby, color: "text-orange-400" },
  educational: { icon: GraduationCap, color: "text-emerald-500" },
};

const LENS_ICONS = {
  POLITICAL: Target,
  PSYCHOLOGICAL: Heart,
  SURVIVAL: Rocket,
  MORAL: Sparkles,
};

const StoryCard = React.memo(({ story, onClick, onDelete, onEdit, openMenuId, setOpenMenuId }) => {
  const isOpen = openMenuId === story.id;
  const GenreIcon = GENRE_ICONS[story.genre?.toLowerCase()]?.icon || Sparkles;
  const LensIcon = LENS_ICONS[story.lens] || Target;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isOpen ? null : story.id);
  };

  return (
    <div 
      className="group relative flex flex-col gap-3 cursor-pointer transform-gpu will-change-transform" 
      onClick={() => onClick(story)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full rounded-[20px] md:rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#5de3ba]/10">
        <ResponsiveImageSkeleton
          src={story.coverImageUrl}
          alt={story.title}
          className="w-full h-full"
          imgClassName="object-cover transition-transform duration-700 group-hover:scale-110"
          rounded="rounded-none"
        />
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Menu Button */}
        <div className="absolute top-2 left-2 z-20 book-menu-area">
          <button
            onClick={toggleMenu}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white md:bg-white/80 md:backdrop-blur-md shadow-sm border border-black/5 flex items-center justify-center text-black/60 hover:bg-[#5de3ba] hover:text-white transition-all duration-300"
          >
            <MoreVertical size={16} />
          </button>
          
          {isOpen && (
            <div className="absolute top-10 left-0 w-36 bg-white shadow-xl border border-black/5 rounded-xl p-1.5 animate-in fade-in zoom-in-95 duration-200 z-30">
              <button 
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/5 text-black/70 transition-all text-xs font-black uppercase tracking-tight"
                onClick={(e) => { e.stopPropagation(); onEdit(story); setOpenMenuId(null); }}
              >
                <span>تعديل</span>
                <Edit2 size={12} />
              </button>
              <button 
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition-all text-xs font-black uppercase tracking-tight"
                onClick={(e) => { e.stopPropagation(); onDelete(story); setOpenMenuId(null); }}
              >
                <span>حذف</span>
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Badge - Scene Count */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/50 md:backdrop-blur-md border border-white/10 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5de3ba] shadow-[0_0_8px_#5de3ba]" />
            {story.sceneCount} مشاهد
        </div>
      </div>

      {/* Details */}
      <div className="px-1 mt-1 space-y-1 text-right" dir="rtl">
        <h3 className="text-[13px] md:text-lg lg:text-xl font-black text-black leading-tight line-clamp-1 group-hover:text-[#5de3ba] transition-colors">
          {story.title}
        </h3>
      </div>
    </div>
  );
});

export default function StoryCardsComponent({ stories, onStoryClick, onDeleteStory, onEditStory, openMenuId, setOpenMenuId }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8 w-full">
      {stories.map((story) => (
        <StoryCard 
          key={story.id} 
          story={story} 
          onClick={onStoryClick} 
          onDelete={onDeleteStory}
          onEdit={onEditStory}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />
      ))}
    </div>
  );
}
