import React from "react";
import { Star, Users, MessageSquare } from "lucide-react";

export function RatingsSummaryCard({ stats, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-sm space-y-6 animate-pulse" dir="rtl">
        <div className="h-6 bg-slate-100 rounded-xl w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-black/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-6 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const avg = typeof stats?.averageRating === "number" ? stats.averageRating.toFixed(2) : (stats?.averageRating || 0);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-sm space-y-6" dir="rtl">
      <h3 className="text-xl font-black text-slate-900 tracking-tight">ملخص التقييمات والمراجعات</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
            <Star size={24} className="fill-yellow-500" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">متوسط التقييم</span>
            <span className="text-2xl font-black text-slate-900">{avg} / 5</span>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#5de3ba]/20 text-black flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">إجمالي التقييمات</span>
            <span className="text-2xl font-black text-slate-900">{stats?.totalReviews ?? 0}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">إجمالي القراءات</span>
            <span className="text-2xl font-black text-slate-900">{stats?.totalReads ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RatingsSummaryCard;
