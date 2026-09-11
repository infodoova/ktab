import React from "react";

/**
 * StorylineProgress Component
 * Visual bar of interactive journey progression.
 */
export function StorylineProgress({ currentScene, storyMetadata, isDarkMode = true }) {
  const totalScenes = storyMetadata?.storyScenes || 10;
  const currentSceneNumber = currentScene?.sceneNumber || 1;
  const progressPercentage = Math.round((currentSceneNumber / totalScenes) * 100);
  const barWidth = Math.min(100, (currentSceneNumber / totalScenes) * 100);

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
            isDarkMode ? "text-white/40" : "text-black/40"
          }`}
        >
          تقدم المغامرة
        </span>
        <span className="font-black text-sm text-[#5de3ba] transition-colors duration-700">
          {progressPercentage}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100/10 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full transition-all duration-1000 relative bg-gradient-to-r from-[#5de3ba] to-[#76debf]"
          style={{
            width: `${barWidth}%`,
            boxShadow: `0 0 15px rgba(93,227,186,0.3)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}

export default StorylineProgress;
