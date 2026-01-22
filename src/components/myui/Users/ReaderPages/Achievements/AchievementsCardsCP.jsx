import React from "react";

export default function AchievementsCardsCP({ achievement }) {
  const progressPercent = Math.round(
    (achievement.progress / achievement.total) * 100
  );

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-black/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight font-tajawal">
          {achievement.title}
        </h3>

        {achievement.status === "completed" && (
          <span className="bg-[#5de3ba] text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-[#5de3ba]/20">
            مكتسب 🏆
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
        {achievement.description}
      </p>

      {achievement.status !== "completed" ? (
        <div className="space-y-4">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5de3ba] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(93,227,186,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              التقدم المحرز
            </span>
            <div className="text-xs font-black text-slate-900 tracking-widest tabular-nums bg-slate-50 px-3 py-1 rounded-lg">
              {achievement.progress} / {achievement.total}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <div className="w-full h-1 bg-[#5de3ba]/20 rounded-full" />
        </div>
      )}
    </div>
  );
}
