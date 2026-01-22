import React from "react";

export default function AchievementsCardsCP({ achievement }) {
  const progressPercent = Math.round(
    (achievement.progress / achievement.total) * 100
  );

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-black tracking-tight group-hover:text-black">
          {achievement.title}
        </h3>

        {achievement.status === "completed" && (
          <span className="bg-black text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            مكتسب 🏆
          </span>
        )}
      </div>

      <p className="text-xs text-black/50 font-medium leading-relaxed mb-6">
        {achievement.description}
      </p>

      {achievement.status !== "completed" && (
        <div className="space-y-3">
          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">
              التقدم
            </span>
            <div className="text-[10px] font-black text-black tracking-widest tabular-nums">
              {achievement.progress}/{achievement.total}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
