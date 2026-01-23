import React from "react";
import {
  X,
  Sparkles,
  Target,
  Layers,
  Info,
  Calendar,
  Palette,
} from "lucide-react";
import ResponsiveImageSkeleton from "../../../imageSkeletonLoaderCP";
/* eslint-disable  */
const DetailRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-black/[0.03] hover:border-[#5de3ba]/30 transition-colors text-right">
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5de3ba] shrink-0 shadow-sm border border-black/[0.05]">
      <Icon size={18} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30 mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-black/80 truncate">
        {value || "غير محدد"}
      </p>
    </div>
  </div>
);

export default function StoryModal({ story, onClose }) {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 md:backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        dir="rtl"
        className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]"
      >
        {/* Close Button - Floating */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-white md:bg-white/80 md:backdrop-blur-md border border-black/5 flex items-center justify-center text-black/40 hover:text-black transition-all hover:scale-110"
        >
          <X size={20} />
        </button>

        {/* 1:1 Image Section */}
        <div className="w-full md:w-[50%] lg:w-[45%] aspect-square relative shrink-0 bg-slate-100">
          <ResponsiveImageSkeleton
            src={story.coverImageUrl}
            alt={story.title}
            className="w-full h-full"
            imgClassName="object-cover"
            rounded="rounded-none"
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-10 right-10 left-10 text-right">
            <div className="flex flex-wrap justify-start gap-2 mb-4">
              <span className="px-3 py-1 rounded-lg bg-[#5de3ba] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#5de3ba]/20">
                {story.genre}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                {story.lens}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {story.title}
            </h2>
          </div>
        </div>

        {/* Content Side - Spacious and Non-stacked */}
        <div
          className="flex-1 p-8 md:p-12 lg:p-14 overflow-y-auto no-scrollbar text-right"
        >
          <div className="max-w-3xl mx-auto space-y-12">
            {/* Overview Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#5de3ba]">
                <Sparkles size={16} />
                نظرة عامة
              </div>
            </section>

            {/* Constitution Grid - 2 Columns (not stacked) */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-black/20">
                <Layers size={16} />
                دستور العالم
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DetailRow
                  label="الزمان"
                  value={story.constitution?.settingTime}
                  icon={Calendar}
                />
                <DetailRow
                  label="المكان"
                  value={story.constitution?.settingPlace}
                  icon={Target}
                />
                <DetailRow
                  label="الفكرة المحورية"
                  value={story.constitution?.coreTheme}
                  icon={Sparkles}
                />
                <DetailRow
                  label="النبرة"
                  value={story.constitution?.tone}
                  icon={Info}
                />
                <DetailRow
                  label="الفلسفة"
                  value={story.constitution?.philosophy}
                  icon={Info}
                />
                <DetailRow
                  label="الصراع الأساسي"
                  value={story.constitution?.mainConflict}
                  icon={Target}
                />
              </div>
            </section>

            {/* Visual Style - Wide Horizontal Design */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-black/20">
                <Palette size={16} />
                الهوية البصرية
              </div>
              <div className="group p-8 rounded-[2rem] bg-slate-50 border border-black/[0.03] transition-all hover:bg-[#5de3ba]/5">
                <p className="text-2xl font-black text-black mb-3 group-hover:text-[#5de3ba] transition-colors">
                  {story.visualStyle || "سينمائي"}
                </p>
                <p className="text-base font-bold text-black/40 leading-relaxed">
                  {story.visualStyleNotes ||
                    "نمط بصري متناغم يعزز تجربة القراءة والتفاعل."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
