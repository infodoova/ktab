import React, { useState, useRef, useEffect } from "react";
import { RotateCcw, ArrowLeft, ChevronDown } from "lucide-react";
import { SceneTimeline } from "../SceneTimeline/SceneTimeline";
import "./PlayHeader.css";

/**
 * Unified Dark Glassmorphism Top Bar for the Interactive Story Player.
 * Right (in RTL): Story title (pressable dropdown on mobile/tap for quick restart/exit)
 * Center: Scrollable timeline with all scene balls (and locks)
 * Left: Action controls (hidden on mobile to prioritize timeline spacing)
 */
export function PlayHeader({
  title,
  onBack,
  /* onRestart, */
  sceneHistory,
  currentScene,
  onGoToScene,
  totalScenes,
  isGenerating,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 640;
    }
    return false;
  });
  const titleSlotRef = useRef(null);

  /* Responsive detection: strictly disable dropdown on big screens */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setMenuOpen(false);
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  /* Close dropdown menu when clicking outside or tapping away */
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (titleSlotRef.current && !titleSlotRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  /*
  const handleRestartClick = () => {
    setMenuOpen(false);
    onRestart?.();
  };
  */

  const handleBackClick = () => {
    setMenuOpen(false);
    onBack?.();
  };

  return (
    <header className="play-header" dir="rtl">
      {/* Right Column (in RTL): Story Title (Static on big screens, dropdown on small mobile) */}
      <div className="play-header__title-slot" ref={titleSlotRef}>
        {!isMobile ? (
          /* Big screens (PC, laptop, iPad): purely static text, no chevron, no menu */
          <h1 className="play-header__title play-header__title--desktop" title={title || "قصة تفاعلية"}>
            {title || "قصة تفاعلية"}
          </h1>
        ) : (
          /* Small mobile screens only (< 640px) */
          <>
            <button
              type="button"
              className={`play-header__title-btn play-header__title-btn--mobile ${menuOpen ? "play-header__title-btn--open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              title="خيارات القصة"
            >
              <span className="play-header__title">{title || "قصة تفاعلية"}</span>
              <ChevronDown
                size={14}
                className={`play-header__title-chevron ${menuOpen ? "play-header__title-chevron--open" : ""}`}
                aria-hidden="true"
              />
            </button>

            {menuOpen && (
              <div className="play-header__dropdown-menu" role="menu">
                {/* <button
                  type="button"
                  className="play-header__dropdown-item"
                  role="menuitem"
                  onClick={handleRestartClick}
                >
                  <RotateCcw size={15} />
                  <span>إعادة بدء القصة</span>
                </button>
                <div className="play-header__dropdown-divider" role="separator" /> */}
                <button
                  type="button"
                  className="play-header__dropdown-item play-header__dropdown-item--exit"
                  role="menuitem"
                  onClick={handleBackClick}
                >
                  <ArrowLeft size={15} />
                  <span>الخروج من القصة</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Center Column: Scrollable scene track with all scenes and lock indicators */}
      <div className="play-header__center-slot">
        <SceneTimeline
          sceneHistory={sceneHistory}
          currentScene={currentScene}
          onGoToScene={onGoToScene}
          totalScenes={totalScenes}
          isGenerating={isGenerating}
        />
      </div>

      {/* Left Column (in RTL): Action buttons (Desktop only; hidden on mobile to give timeline maximum space) */}
      <div className="play-header__actions-slot">
        {/* <button
          type="button"
          className="play-header__action-btn"
          onClick={onRestart}
          title="إعادة بدء القصة من المشهد الأول"
          aria-label="إعادة بدء القصة"
        >
          <RotateCcw size={14} />
          <span className="play-header__action-label">إعادة</span>
        </button> */}

        <button
          type="button"
          className="play-header__action-btn play-header__action-btn--exit"
          onClick={onBack}
          title="الخروج من القصة"
          aria-label="الخروج من القصة"
        >
          <span className="play-header__action-label">خروج</span>
          <ArrowLeft size={14} />
        </button>
      </div>
    </header>
  );
}

export default PlayHeader;
