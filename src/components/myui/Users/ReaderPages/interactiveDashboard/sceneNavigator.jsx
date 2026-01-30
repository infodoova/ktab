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
  const internalDesktopRef = React.useRef(null);
  const activeRef = isMobile ? sceneSelectorRef : internalDesktopRef;
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [showIndicator, setShowIndicator] = React.useState(false);


  React.useEffect(() => {
    const el = activeRef?.current;
    if (!el) return;

    const handleWheelListener = (e) => {
      if (e.deltaY !== 0) {
        // Prevent default vertical scroll to handle horizontal scroll manually
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheelListener, { passive: false });
    return () => el.removeEventListener("wheel", handleWheelListener);
  }, [activeRef, sceneHistory.length]);



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
          <span className="text-[var(--primary-button)] font-black text-[10px] uppercase tracking-tighter">
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
                  ? "border-[var(--primary-button)] scale-110"
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
                    ? "bg-[var(--primary-button)]/40"
                    : "bg-black/50 group-hover/nav:bg-black/30"
                }`}
              />
              <span className="relative z-10 text-white drop-shadow-md">
                {index + 1}
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
            isDarkMode ? "text-white/40" : "text-black/40"
          }`}
        >
          تاريخ الرحلة
        </span>
        <span className="text-[var(--primary-button)] font-black text-sm uppercase tracking-tighter">
          المشهد {currentScene?.sceneNumber} / {sceneHistory.length}
        </span>
      </div>
      <div
        ref={internalDesktopRef}
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
                ? "border-[var(--primary-button)] scale-110"
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
                  ? "bg-[var(--primary-button)]/40"
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

export default function WrappedSceneNavigator(props) {
  const scrollbarCss = `
    .custom-scene-scrollbar::-webkit-scrollbar {
      height: 6px;
    }
    .custom-scene-scrollbar::-webkit-scrollbar-track {
      background: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      border-radius: 10px;
    }
    .custom-scene-scrollbar::-webkit-scrollbar-thumb {
      background: var(--primary-button);
      border-radius: 10px;
    }
    .custom-scene-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #4ade80;
    }
    /* Firefox */
    .custom-scene-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: var(--primary-button) ${props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    }
  `;

  return (
    <>
      <style>{scrollbarCss}</style>
      <SceneNavigator {...props} />
    </>
  );
}
