import React from "react";
import { X, Layers, Sparkles, BookOpen, Compass } from "lucide-react";

export function StoryEditorModal({ isOpen, onClose, story }) {
  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-lg bg-white h-full p-8 md:p-10 shadow-2xl overflow-y-auto space-y-8 animate-in slide-in-from-left duration-300"
        dir="rtl"
      >
        <div className="flex items-center justify-between border-b border-black/5 pb-6">
          <h2 className="text-xl font-black text-slate-900">تفاصيل القصة التفاعلية</h2>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <img
            src={story.coverImageUrl || story.cover}
            alt={story.title}
            className="w-24 h-36 object-cover rounded-2xl shadow-md border border-black/5"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">{story.title}</h3>
            <p className="text-xs font-bold text-slate-400">{story.genre || "مغامرة"}</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#5de3ba]/20 text-black text-[10px] font-black uppercase rounded-full">
                {story.lens || "المخاطب"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-black/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5de3ba]/20 text-[#5de3ba] flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 block uppercase">عدد المشاهد</span>
              <span className="text-sm font-black text-slate-800">{story.maxScenes || 0}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-black/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5de3ba]/20 text-[#5de3ba] flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 block uppercase">النمط البصري</span>
              <span className="text-sm font-black text-slate-800">{story.visualStyle || "سينمائي"}</span>
            </div>
          </div>
        </div>

        {/* Constitution / Narrative Setup */}
        {story.constitution && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">تمهيد وحبكة القصة</h4>
            <p className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-black/5">
              {story.constitution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryEditorModal;
