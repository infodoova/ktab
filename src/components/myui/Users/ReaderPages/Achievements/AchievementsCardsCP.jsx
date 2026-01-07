import React from "react";

export default function AchievementsCardsCP({ achievement }) {
  const progressPercent = Math.round(
    (achievement.progress / achievement.total) * 100
  );

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--earth-brown)]">
          {achievement.title}
        </h3>

        {achievement.status === "completed" && (
          <span className="text-xs text-[var(--earth-blue)] font-medium">
            مكتسب 🏆
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--earth-brown)]/70">
        {achievement.description}
      </p>

      {achievement.status !== "completed" && (
        <>
          <div className="w-full h-2 bg-[var(--earth-cream)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--earth-olive)] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-xs text-right text-[var(--earth-brown)]/60">
            {achievement.progress}/{achievement.total}
          </div>
        </>
      )}
    </div>
  );
}
