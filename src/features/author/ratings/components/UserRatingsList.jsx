import React from "react";
import { Star, User } from "lucide-react";

export function UserRatingsList({ reviews = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-sm space-y-6 animate-pulse" dir="rtl">
        <div className="h-6 bg-slate-100 rounded-xl w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-black/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200" />
                <div className="h-4 bg-slate-200 rounded w-32" />
              </div>
              <div className="h-3 bg-slate-200 rounded w-3/4 mr-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {

    return (
      <div className="bg-white rounded-[2.5rem] p-12 border border-black/5 text-center" dir="rtl">
        <p className="text-slate-400 font-bold text-sm">
          لا توجد مراجعات أو تقييمات مكتوبة حتى الآن.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-sm space-y-6" dir="rtl">
      <h3 className="text-xl font-black text-slate-900 tracking-tight">آراء ومراجعات القراء</h3>

      <div className="space-y-4">
        {reviews.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-slate-50 border border-black/5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#5de3ba]/20 text-black flex items-center justify-center font-bold text-xs">
                  {item.userName ? item.userName.charAt(0) : <User size={16} />}
                </div>
                <span className="font-bold text-sm text-slate-900">{item.userName || "قارئ كِتَاب"}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-xl">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                <span>{item.rating}</span>
              </div>
            </div>

            {item.comment && (
              <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed pr-12">
                {item.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserRatingsList;
