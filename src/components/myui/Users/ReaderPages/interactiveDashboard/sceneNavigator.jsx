import React from "react";

const SceneNavigator = ({
  sceneHistory,
  currentScene,
  handleGoToScene,
  isDarkMode,
  sceneSelectorRef,
  type = "desktop",
}) => {
  const isMobile = type === "mobile";

  if (isMobile) {
    return (
      <div className="glass-panel rounded-2xl p-4 lg:hidden mb-2">
        <div className="flex items-center justify-between mb-3" dir="rtl">
          <span
            className={`font-extrabold text-[10px] uppercase tracking-widest ${
              isDarkMode ? "text-white/40" : "text-[var(--earth-brown)]/60"
            }`}
          >
            تاريخ الرحلة
          </span>
          <span className="text-[var(--earth-olive)] font-extrabold text-[10px]">
            المشهد {currentScene?.sceneNumber} / {sceneHistory.length}
          </span>
        </div>
        <div
          ref={sceneSelectorRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x py-1"
          dir="rtl"
        >
          {sceneHistory.map((scene, index) => (
            <button
              key={scene.sceneId}
              data-active={currentScene?.sceneId === scene.sceneId}
              onClick={() => handleGoToScene(index)}
              className={`w-12 h-12 flex-shrink-0 rounded-lg text-xs font-black transition-all snap-center flex items-center justify-center border-2 relative overflow-hidden group/nav ${
                currentScene?.sceneId === scene.sceneId
                  ? "border-[var(--earth-olive)] shadow-[0_0_25px_rgba(106,128,88,0.5)] scale-110"
                  : isDarkMode
                    ? "border-white/5 hover:border-white/20 hover:bg-white/10"
                    : "border-[var(--earth-sand)]/20 hover:border-[var(--earth-sand)]/40 hover:shadow-md"
              }`}
              style={{
                backgroundImage: `url(${scene.sceneImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  currentScene?.sceneId === scene.sceneId
                    ? "bg-[var(--earth-olive)]/60"
                    : "bg-black/50 group-hover/nav:bg-black/30"
                }`}
              />
              <span className="relative z-10 text-white drop-shadow-md">
                {index}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Version
  return (
    <div className="hidden lg:block glass-panel rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4" dir="rtl">
        <span
          className={`font-extrabold text-sm uppercase tracking-widest ${
            isDarkMode ? "text-white/40" : "text-[var(--earth-brown)]/60"
          }`}
        >
          تاريخ الرحلة
        </span>
        <span className="text-[var(--earth-olive)] font-extrabold text-sm">
          المشهد {currentScene?.sceneNumber} / {sceneHistory.length}
        </span>
      </div>
      <div
        className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x py-2"
        dir="rtl"
      >
        {sceneHistory.map((scene, index) => (
          <button
            key={scene.sceneId}
            data-active={currentScene?.sceneId === scene.sceneId}
            onClick={() => handleGoToScene(index)}
            className={`w-16 h-16 flex-shrink-0 rounded-2xl text-base font-black transition-all snap-center flex items-center justify-center border-2 relative overflow-hidden group/nav ${
              currentScene?.sceneId === scene.sceneId
                ? "border-[var(--earth-olive)] shadow-[0_0_25px_rgba(106,128,88,0.5)] scale-110"
                : isDarkMode
                  ? "border-white/5 hover:border-white/20 hover:bg-white/10"
                  : "border-[var(--earth-sand)]/20 hover:border-[var(--earth-sand)]/40 hover:shadow-md"
            }`}
            style={{
              backgroundImage: `url(${scene.sceneImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className={`absolute inset-0 transition-all duration-300 ${
                currentScene?.sceneId === scene.sceneId
                  ? "bg-[var(--earth-olive)]/60"
                  : "bg-black/50 group-hover/nav:bg-black/30"
              }`}
            />
            <span className="relative z-10 text-white drop-shadow-md">
              {index + 1}
            </span>
          </button>
        ))}

        {/* Placeholder for visual balance if only one scene */}
        {sceneHistory.length === 1 && (
          <div className="w-16 h-16 flex-shrink-0 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center opacity-20">
            <span className="text-xs">?</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneNavigator;
