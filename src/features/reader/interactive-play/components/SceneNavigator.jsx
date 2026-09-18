import React from "react";

export function SceneNavigator({
  sceneHistory = [],
  currentScene,
  handleGoToScene,
  isDarkMode = true,
  sceneSelectorRef,
  type = "desktop",
}) {
  const isMobile = type === "mobile";
  const internalDesktopRef = React.useRef(null);
  const containerRef = sceneSelectorRef || internalDesktopRef;


  if (isMobile) {
    return (
      <div className="glass-panel rounded-2xl p-4 lg:hidden mb-2">
        <div className="flex items-center justify-between mb-3" dir="rtl">
          <span
            className={`font-extrabold text-[10px] uppercase tracking-widest ${
              isDarkMode ? "text-white/40" : "text-black/40"
            }`}
          >
            تاريخ الرحلة
          </span>
          <span className="text-[#5de3ba] font-black text-[10px] uppercase tracking-tighter">
            المشهد {currentScene?.sceneNumber} / {sceneHistory.length}
          </span>
        </div>
        <div
          ref={sceneSelectorRef}
          className="flex items-center gap-2 overflow-x-auto custom-scene-scrollbar scroll-smooth snap-x py-2 pb-4"
          dir="rtl"
        >
          {sceneHistory.map((scene, index) => (
            <button
              key={scene.sceneId}
              data-active={currentScene?.sceneId === scene.sceneId}
              onClick={() => handleGoToScene(index)}
              className={`w-12 h-12 flex-shrink-0 rounded-lg text-xs font-black transition-all snap-center flex items-center justify-center border-2 relative overflow-hidden group/nav ${
                currentScene?.sceneId === scene.sceneId
                  ? "border-[#5de3ba] scale-110"
                  : isDarkMode
                  ? "border-white/5 hover:border-white/20 hover:bg-white/10"
                  : "border-black/10 hover:border-black/20 hover:bg-black/5"
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
                    ? "bg-[#5de3ba]/40"
                    : "bg-black/50 group-hover/nav:bg-black/30"
                }`}
              />
              <span className="relative z-10 text-white drop-shadow-md">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block glass-panel rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4" dir="rtl">
        <span
          className={`font-extrabold text-sm uppercase tracking-widest ${
            isDarkMode ? "text-white/40" : "text-black/40"
          }`}
        >
          تاريخ الرحلة
        </span>
        <span className="text-[#5de3ba] font-black text-sm uppercase tracking-tighter">
          المشهد {currentScene?.sceneNumber} / {sceneHistory.length}
        </span>
      </div>
      <div
        ref={containerRef}
        className="flex items-center gap-4 overflow-x-auto custom-scene-scrollbar scroll-smooth snap-x py-2 pb-6"
        dir="rtl"
      >

        {sceneHistory.map((scene, index) => (
          <button
            key={scene.sceneId}
            data-active={currentScene?.sceneId === scene.sceneId}
            onClick={() => handleGoToScene(index)}
            className={`w-16 h-16 flex-shrink-0 rounded-2xl text-base font-black transition-all snap-center flex items-center justify-center border-2 relative overflow-hidden group/nav ${
              currentScene?.sceneId === scene.sceneId
                ? "border-[#5de3ba] scale-110"
                : isDarkMode
                ? "border-white/5 hover:border-white/20 hover:bg-white/10"
                : "border-black/10 hover:border-black/20 hover:bg-black/5"
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
                  ? "bg-[#5de3ba]/40"
                  : "bg-black/50 group-hover/nav:bg-black/30"
              }`}
            />
            <span className="relative z-10 text-white drop-shadow-md">{index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SceneNavigator;
