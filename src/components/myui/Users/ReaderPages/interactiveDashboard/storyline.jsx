import React from "react";

/**
 * StoryLine Component
 * Displays the current progress of the adventure.
 */
const StoryLine = ({ currentScene, storyMetadata, isDarkMode }) => {
  const totalScenes = storyMetadata?.storyScenes || 10; // Default to 10 if unknown
  const currentSceneNumber = currentScene?.sceneNumber || 1;
  const progressPercentage = Math.round(
    (currentSceneNumber / totalScenes) * 100,
  );
  const barWidth = Math.min(
    100,
    (currentSceneNumber / totalScenes) * 100,
  );

  const activeColor = "#5de3ba"; // Use a single brand color for text accents if needed

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
            isDarkMode ? "text-white/40" : "text-[var(--primary-text)]/40"
          }`}
        >
          تقدم المغامرة
        </span>
        <span 
          style={{ color: activeColor }}
          className="font-black text-sm transition-colors duration-700"
        >
          {progressPercentage}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-black/10">
        <div
          className="h-full transition-all duration-1000 relative bg-gradient-to-r from-[#5de3ba] to-[#76debf]"
          style={{
            width: `${barWidth}%`,
            boxShadow: `0 0 15px rgba(93,227,186,0.3)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default StoryLine;
