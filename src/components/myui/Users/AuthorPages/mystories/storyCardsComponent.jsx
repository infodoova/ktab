import React, { useState } from "react";
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

const StoryCard = ({ story, onClick, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const GenreIcon = GENRE_ICONS[story.genre?.toLowerCase()]?.icon || Sparkles;
  const LensIcon = LENS_ICONS[story.lens] || Target;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div 
      className="group relative flex flex-col gap-4 cursor-pointer" 
      onClick={() => onClick(story)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.03)] group-hover:shadow-2xl group-hover:shadow-[#5de3ba]/10 transition-all duration-500">
        <ResponsiveImageSkeleton
          src={story.coverImageUrl}
          alt={story.title}
          className="w-full h-full"
          imgClassName="object-cover transition-transform duration-700 group-hover:scale-110"
          rounded="rounded-none"
        />
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Menu Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={toggleMenu}
            className="w-10 h-10 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 flex items-center justify-center text-black hover:bg-[#5de3ba] hover:text-white transition-all duration-300"
          >
            <MoreVertical size={18} />
          </button>
          
          {showMenu && (
            <div className="absolute top-12 left-0 w-36 bg-white/90 backdrop-blur-2xl border border-black/5 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200 z-20">
              <button 
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#5de3ba]/10 text-black/70 hover:text-[#5de3ba] transition-all text-sm font-bold"
                onClick={(e) => { e.stopPropagation(); onEdit(story); }}
              >
                <span>تعديل</span>
                <Edit2 size={14} />
              </button>
              <button 
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-500 transition-all text-sm font-bold"
                onClick={(e) => { e.stopPropagation(); onDelete(story); }}
              >
                <span>حذف</span>
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Badge - Scene Count */}
        <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5de3ba] shadow-[0_0_8px_#5de3ba]" />
            {story.sceneCount} مشاهد
        </div>
      </div>

      {/* Details */}
      <div className="px-2 space-y-2 text-right" dir="rtl">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#5de3ba]">
             {story.genre || "خيال"}
          </span>
        </div>
        <h3 className="text-xl font-black text-black leading-tight line-clamp-1 group-hover:text-[#5de3ba] transition-colors">
          {story.title}
        </h3>
      </div>
    </div>
  );
};

export default function StoryCardsComponent({ stories, onStoryClick, onDeleteStory, onEditStory }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 w-full">
      {stories.map((story) => (
        <StoryCard 
          key={story.id} 
          story={story} 
          onClick={onStoryClick} 
          onDelete={onDeleteStory}
          onEdit={onEditStory}
        />
      ))}
    </div>
  );
}