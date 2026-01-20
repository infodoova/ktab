import React from "react";

/**
 * StoryLine Component
 * Displays the current progress of the adventure.
 */
const StoryLine = ({ currentScene, storyMetadata, isDarkMode }) => {
  const totalScenes = storyMetadata?.totalScenes;
  const currentSceneNumber = currentScene?.sceneNumber;
  const progressPercentage = Math.round(((currentSceneNumber + 1) / totalScenes) * 100);
  const barWidth = Math.min(100, ((currentSceneNumber + 1) / totalScenes) * 100);

  return (
    <div
      className={`hidden lg:block glass-panel rounded-3xl p-6 ${
        isDarkMode ? "shadow-2xl" : "shadow-md"
      }`}
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-4">
        <span
          className={`font-extrabold text-xs uppercase tracking-widest ${
            isDarkMode ? "text-white/40" : "text-[var(--earth-brown)]/60"
          }`}
        >
          تقدم المغامرة
        </span>
        <span className="text-[var(--earth-olive)] font-black text-sm">
          {progressPercentage}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-[var(--earth-olive)] shadow-[0_0_20px_rgba(106,128,88,0.8)] transition-all duration-1000 relative"
          style={{
            width: `${barWidth}%`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default StoryLine;
