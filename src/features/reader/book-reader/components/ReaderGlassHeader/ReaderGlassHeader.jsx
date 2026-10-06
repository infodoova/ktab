import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Loader2,
  Headphones,
  Paintbrush,
  Type,
  Palette,
  BookMarked,
  Lock,
  Unlock,
  Check,
  Volume2,
  SlidersHorizontal,
  X,
  VolumeX,
  CloudRain,
  Wind,
  TreePalm,
  Maximize,
  Minimize,
  BookOpen,
  MoveUp,
  ArrowLeft,
} from "lucide-react";
import {
  THEMES_LIST,
  VOICES_LIST,
  AMBIENT_EFFECTS,
  TRANSITION_MODES,
  ALLOW_RIGHT_CLICK,
} from "../../constants/readerConstants";
import { useReaderGlassHeader } from "../../hooks/useReaderGlassHeader";
import { TransitionModeIcon } from "../TransitionModeIcon/TransitionModeIcon";
import "./ReaderGlassHeader.css";

const AMBIENT_ICON_MAP = {
  none: VolumeX,
  rain: CloudRain,
  wind: Wind,
  nature: TreePalm,
};

/**
 * Editorial Liquid Glass Reader Controls.
 * - Header: Single elegant launcher button in top-right corner on both PC and mobile.
 * - PC: Pressing the launcher reveals a dedicated right-side panel filled with 1:1 square
 *   tools with text underneath, balancing the left-side mode selector and filling side space.
 *   Re-pressing collapses the panel smoothly.
 * - Mobile: Pressing expands the compact floating dock.
 */
export function ReaderGlassHeader(props) {
  const {
    bookTitle = "",
    onBack,
    isPlaying = false,
    isTTSLoading = false,
    onTogglePlay,
    voice,
    onSelectVoice,
    effect = "none",
    onSelectEffect,
    fontSize = 18,
    onFontSizeChange,
    theme = "pure-white",
    onSelectTheme,
    transitionMode = "curl",
    onSelectTransitionMode,
    activePopover = null,
    onTogglePopover,
    onOpenFastTravel,
    onOpenImageGen,
    onOpenNavigator,
    isLocked = false,
    onToggleLock,
    isFullscreen = false,
    onToggleFullscreen,
    isControlsVisible = true,
  } = props;

  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (isLocked || !isControlsVisible) {
      setIsLeftDrawerOpen(false);
    }
  }, [isLocked, isControlsVisible]);

  const {
    isToolsOpen,
    isClosing,
    toggleTools,
    closeTools,
    fontPercent,
    isHidden,
    handleActionClick,
  } = useReaderGlassHeader({
    fontSize,
    isControlsVisible,
    isLocked,
  });

  // PC 1:1 Square Tools Grid configuration (Symmetrical, high-contrast Apple style)
  const pcTools = [
    {
      id: "play",
      label: "قراءة صوتية",
      sub: isTTSLoading
        ? "جاري التحميل…"
        : isPlaying
        ? "إيقاف مؤقت"
        : "بدء الاستماع",
      icon: isTTSLoading ? Loader2 : isPlaying ? Pause : Play,
      iconClass: isTTSLoading ? "ktab-spin-fast" : "",
      isActive: isPlaying,
      isLoading: isTTSLoading,
      onClick: (e) => handleActionClick(e, onTogglePlay),
    },
    {
      id: "voices",
      label: "صوت القارئ",
      sub: VOICES_LIST.find((v) => v.id === voice)?.label || "الأصوات",
      icon: Headphones,
      isActive: activePopover === "voices",
      onClick: (e) => handleActionClick(e, () => onTogglePopover?.("voices")),
    },
    {
      id: "ambient",
      label: "أصوات هادئة",
      sub: AMBIENT_EFFECTS.find((eff) => eff.id === effect)?.label || "الخلفية",
      icon: effect !== "none" ? (AMBIENT_ICON_MAP[effect] || CloudRain) : Volume2,
      isActive: effect !== "none" || activePopover === "ambient",
      onClick: (e) => handleActionClick(e, () => onTogglePopover?.("ambient")),
    },
    {
      id: "font",
      label: "حجم الخط",
      sub: `${fontPercent}% (${fontSize}px)`,
      icon: Type,
      isActive: activePopover === "font",
      onClick: (e) => handleActionClick(e, () => onTogglePopover?.("font")),
    },
    {
      id: "theme",
      label: "المظهر والألوان",
      sub: THEMES_LIST.find((t) => t.id === theme)?.name || "السمات",
      icon: Palette,
      isActive: activePopover === "theme",
      onClick: (e) => handleActionClick(e, () => onTogglePopover?.("theme")),
    },
    {
      id: "modes",
      label: "تقليب الصفحات",
      sub: TRANSITION_MODES.find((m) => m.id === transitionMode)?.shortTitle || "حركة الصفحات",
      icon: BookOpen,
      isActive: activePopover === "modes",
      onClick: (e) => handleActionClick(e, () => onTogglePopover?.("modes")),
    },
    {
      id: "fastTravel",
      label: "فهرس الصفحات",
      sub: "انتقال سريع",
      icon: BookMarked,
      isActive: false,
      onClick: (e) => handleActionClick(e, onOpenFastTravel),
    },
    {
      id: "imageGen",
      label: "صورة الصفحة",
      sub: "توليد بالذكاء الاصطناعي",
      icon: Paintbrush,
      isActive: false,
      onClick: (e) => handleActionClick(e, onOpenImageGen),
    },
    {
      id: "fullscreen",
      label: "ملء الشاشة",
      sub: isFullscreen ? "إنهاء العرض" : "عرض كامل",
      icon: isFullscreen ? Minimize : Maximize,
      isActive: isFullscreen,
      onClick: (e) => handleActionClick(e, onToggleFullscreen),
    },
    {
      id: "lock",
      label: "قفل الشاشة",
      sub: "وضع التركيز",
      icon: Lock,
      isActive: isLocked,
      onClick: (e) => handleActionClick(e, onToggleLock),
    },
  ];

  return (
    <>
      {/* 1. Corner Unlock Button (Only visible when locked) */}
      {isLocked && (
        <div className={`ktab-reader-unlock-anchor ktab-reader-header--theme-${theme}`}>
          <div className="ktab-glass-btn-anchor">
            <button
              type="button"
              className="ktab-glass-circle-btn"
              onClick={(e) => handleActionClick(e, onToggleLock)}
              aria-label="إلغاء قفل الشاشة"
            >
              <Unlock size={18} strokeWidth={2.4} />
            </button>
            <span className="ktab-glass-tooltip" role="tooltip">
              إلغاء القفل
            </span>
          </div>
        </div>
      )}

      {/* 2. Isolated Back Button on Maximum Left */}
      <div
        className={`ktab-reader-back-anchor ktab-reader-header--theme-${theme} ${
          isHidden ? "ktab-reader-controls--hidden" : ""
        } ${isToolsOpen && !isClosing ? "ktab-reader-back-anchor--hidden-mobile" : ""}`}
      >
        <div className="ktab-glass-btn-anchor">
          <button
            type="button"
            className="ktab-glass-circle-btn"
            onClick={(e) => handleActionClick(e, onBack)}
            aria-label="الرجوع إلى الصفحة السابقة"
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
          <span className="ktab-glass-tooltip" role="tooltip">
            الرجوع
          </span>
        </div>
      </div>

      {/* 2.5 Top Book Title (Clean typography, completely non-selectable and copy-protected) */}
      {bookTitle && (
        <div
          className={`ktab-reader-title-anchor ktab-reader-header--theme-${theme} ${
            isHidden ? "ktab-reader-controls--hidden" : ""
          } ${isToolsOpen ? "ktab-reader-title-anchor--tools-open" : ""}`}
          aria-label={`عنوان الكتاب: ${bookTitle}`}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => {
            if (!ALLOW_RIGHT_CLICK) e.preventDefault();
          }}
        >
          <span
            className="ktab-reader-title-text"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => {
              if (!ALLOW_RIGHT_CLICK) e.preventDefault();
            }}
          >
            {bookTitle}
          </span>
        </div>
      )}

      {/* 3. Backdrop overlay for dismissing popovers or tools menu cleanly */}
      {activePopover && (
        <div
          className="ktab-glass-popover-backdrop"
          onClick={() => onTogglePopover?.(null)}
          aria-hidden="true"
        />
      )}
      {isToolsOpen && !activePopover && (
        <div
          className={`ktab-tools-backdrop ${
            isClosing ? "ktab-tools-backdrop--closing" : ""
          }`}
          onClick={closeTools}
          aria-hidden="true"
        />
      )}

      {/* 4. Top-Level Liquid Glass Popovers */}
      {activePopover === "voices" && (
        <div
          className={`ktab-glass-popover ktab-voices-popover ktab-glass-popover--theme-${theme}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <div className="ktab-popover-header">
            <div className="flex items-center justify-between w-full">
              <span className="ktab-popover-title">أصوات القراء بالذكاء الاصطناعي</span>
              <button
                type="button"
                className="ktab-popover-close-btn"
                onClick={() => onTogglePopover?.(null)}
                aria-label="إغلاق"
              >
                <X size={15} />
              </button>
            </div>
            <span className="ktab-popover-subtitle">اختر الصوت المناسب لطبيعة الكتاب</span>
          </div>
          <div className="ktab-voices-popover-list">
            {VOICES_LIST.map((v) => {
              const isSelected = voice === v.id;
              const isMale = v.gender === "male";
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`ktab-voice-popover-item ${
                    isSelected ? "ktab-voice-popover-item--active" : ""
                  }`}
                  onClick={() => {
                    onSelectVoice?.(v.id);
                    onTogglePopover?.(null);
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="ktab-voice-neutral-badge">
                      <Volume2 size={15} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="ktab-voice-popover-label">{v.label}</span>
                      <span className="ktab-voice-popover-desc">{v.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isSelected && <Check size={16} strokeWidth={2.8} />}
                    <span className="ktab-voice-popover-tag">
                      {isMale ? "قارئ" : "قارئة"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activePopover === "ambient" && (
        <div
          className={`ktab-glass-popover ktab-ambient-popover ktab-glass-popover--theme-${theme}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <div className="ktab-popover-header">
            <div className="flex items-center justify-between w-full">
              <span className="ktab-popover-title">أصوات الخلفية والتركيز</span>
              <button
                type="button"
                className="ktab-popover-close-btn"
                onClick={() => onTogglePopover?.(null)}
                aria-label="إغلاق"
              >
                <X size={15} />
              </button>
            </div>
            <span className="ktab-popover-subtitle">مؤثرات طبيعية هادئة لمرافقة قراءتك</span>
          </div>
          <div className="ktab-ambient-popover-list">
            {AMBIENT_EFFECTS.map((eff) => {
              const isSelected = effect === eff.id;
              return (
                <button
                  key={eff.id}
                  type="button"
                  className={`ktab-ambient-popover-item ${
                    isSelected ? "ktab-ambient-popover-item--active" : ""
                  }`}
                  onClick={() => {
                    onSelectEffect?.(eff.id);
                    onTogglePopover?.(null);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="ktab-ambient-icon-badge">
                      {React.createElement(AMBIENT_ICON_MAP[eff.id] || Volume2, { size: 16 })}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="ktab-ambient-label">{eff.label}</span>
                      <span className="ktab-ambient-desc">{eff.desc}</span>
                    </div>
                  </div>
                  {isSelected && <Check size={16} strokeWidth={2.8} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activePopover === "font" && (
        <div
          className={`ktab-glass-popover ktab-font-popover ktab-glass-popover--theme-${theme}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <div className="ktab-popover-header">
            <div className="flex items-center justify-between w-full">
              <span className="ktab-popover-title">حجم خط القراءة</span>
              <button
                type="button"
                className="ktab-popover-close-btn"
                onClick={() => onTogglePopover?.(null)}
                aria-label="إغلاق"
              >
                <X size={15} />
              </button>
            </div>
            <span className="ktab-popover-subtitle">اضبط مقاس النص لقراءة مريحة لعينيك</span>
          </div>

          <div className="ktab-font-stepper-wrap">
            <button
              type="button"
              className="ktab-font-stepper-btn"
              onClick={() => onFontSizeChange?.(Math.max(14, fontSize - 2))}
              disabled={fontSize <= 14}
              aria-label="تصغير الخط A-"
            >
              A-
            </button>
            <div className="ktab-font-stepper-metric">
              <span className="ktab-font-stepper-percent">{fontPercent}%</span>
              <span className="ktab-font-stepper-px">{fontSize}px</span>
            </div>
            <button
              type="button"
              className="ktab-font-stepper-btn"
              onClick={() => onFontSizeChange?.(Math.min(22, fontSize + 2))}
              disabled={fontSize >= 22}
              aria-label="تكبير الخط A+"
            >
              A+
            </button>
          </div>

          <div className="ktab-font-preview-box">
            <span style={{ fontSize: `${fontSize}px` }}>
              أبجد هوز حطي كلمن • كتاب يروي الفكر
            </span>
          </div>
        </div>
      )}

      {activePopover === "theme" && (
        <div
          className={`ktab-glass-popover ktab-theme-popover ktab-glass-popover--theme-${theme}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <div className="ktab-popover-header">
            <div className="flex items-center justify-between w-full">
              <span className="ktab-popover-title">لون وخلفية الصفحات</span>
              <button
                type="button"
                className="ktab-popover-close-btn"
                onClick={() => onTogglePopover?.(null)}
                aria-label="إغلاق"
              >
                <X size={15} />
              </button>
            </div>
            <span className="ktab-popover-subtitle">اختر التنسيق الأنسب لإضاءة المكان من حولك</span>
          </div>

          <div className="ktab-theme-cards-grid">
            {THEMES_LIST.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`ktab-theme-card-option ${
                    isSelected ? "ktab-theme-card-option--active" : ""
                  }`}
                  onClick={() => {
                    onSelectTheme?.(t.id);
                    onTogglePopover?.(null);
                  }}
                  title={t.name}
                >
                  <div
                    className="ktab-theme-mini-page"
                    style={{
                      backgroundColor: t.bgPreview,
                      borderColor: t.borderPreview,
                      color: t.textPreview,
                    }}
                  >
                    <div
                      className="ktab-theme-mini-line ktab-theme-mini-line--header"
                      style={{ backgroundColor: t.textPreview }}
                    />
                    <div
                      className="ktab-theme-mini-line"
                      style={{ backgroundColor: t.textPreview }}
                    />
                    <div
                      className="ktab-theme-mini-line ktab-theme-mini-line--short"
                      style={{ backgroundColor: t.textPreview }}
                    />
                    {isSelected && (
                      <div className="ktab-theme-check-badge">
                        <Check size={12} strokeWidth={3.5} />
                      </div>
                    )}
                  </div>
                  <span className="ktab-theme-card-name">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Flip Animation Mode Popover (Mobile & Tablet) */}
      {activePopover === "modes" && (
        <div
          className={`ktab-glass-popover ktab-modes-popover ktab-glass-popover--theme-${theme}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <div className="ktab-popover-header">
            <div className="flex items-center justify-between w-full">
              <span className="ktab-popover-title">تقليب الصفحات</span>
              <button
                type="button"
                className="ktab-popover-close-btn"
                onClick={() => onTogglePopover?.(null)}
                aria-label="إغلاق"
              >
                <X size={15} />
              </button>
            </div>
            <span className="ktab-popover-subtitle">
              اختر أسلوب الحركة والانتقال بين صفحات الكتاب
            </span>
          </div>

          <div className="ktab-modes-cards-grid">
            {TRANSITION_MODES.map((m) => {
              const isSelected = transitionMode === m.id;
              const activeThemeObj = THEMES_LIST.find((t) => t.id === theme) || THEMES_LIST[0];

              return (
                <button
                  key={m.id}
                  type="button"
                  className={`ktab-mode-card-option ${
                    isSelected ? "ktab-mode-card-option--active" : ""
                  }`}
                  onClick={() => {
                    onSelectTransitionMode?.(m.id);
                    onTogglePopover?.(null);
                  }}
                  title={m.desc}
                >
                  <div
                    className="ktab-mode-mini-page"
                    style={{
                      backgroundColor: activeThemeObj.bgPreview,
                      borderColor: isSelected ? undefined : activeThemeObj.borderPreview,
                      color: activeThemeObj.textPreview,
                    }}
                  >
                    <TransitionModeIcon mode={m.id} size={44} />

                    {isSelected && (
                      <div className="ktab-mode-check-badge">
                        <Check size={12} strokeWidth={3.5} />
                      </div>
                    )}
                  </div>

                  <span className="ktab-mode-card-name">
                    {m.id === "curl"
                      ? "ورق واقعي"
                      : m.id === "flip3d"
                      ? "تقليب رأسي"
                      : "انزلاق أفقي"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Universal Single Launcher Button in Top-Right Corner */}
      <div
        className={`ktab-reader-dock-anchor ktab-reader-header--theme-${theme} ${
          isHidden ? "ktab-reader-controls--hidden" : ""
        } ${isToolsOpen ? "ktab-reader-dock-anchor--expanded" : ""} ${
          isClosing ? "ktab-reader-dock-anchor--closing" : ""
        }`}
      >
        {/* Top-Right Circular Launcher Button */}
        <div className="ktab-glass-btn-anchor">
          <button
            type="button"
            className={`ktab-glass-circle-btn ${
              isToolsOpen ? "ktab-glass-circle-btn--active" : ""
            }`}
            onClick={(e) => handleActionClick(e, toggleTools)}
            aria-label={isToolsOpen ? "إغلاق قائمة الأدوات" : "أدوات وخيارات القارئ"}
            title={isToolsOpen ? "إغلاق" : "الأدوات"}
          >
            {isToolsOpen ? (
              <X size={18} strokeWidth={2.4} />
            ) : (
              <SlidersHorizontal size={18} strokeWidth={2.2} />
            )}
          </button>
          {!isToolsOpen && (
            <span className="ktab-glass-tooltip" role="tooltip">
              أدوات القارئ
            </span>
          )}
        </div>

        {/* Mobile-Only Expanded Floating Dock */}
        <div
          className={`ktab-reader-dock ktab-reader-dock--theme-${theme} ${
            isToolsOpen
              ? "ktab-reader-dock--expanded"
              : "ktab-reader-dock--collapsed"
          } ${isClosing ? "ktab-reader-dock--closing" : ""}`}
          role="toolbar"
          aria-label="أدوات القارئ للجوال"
        >
          <div className="ktab-mobile-close-group">
            <button
              type="button"
              className="ktab-glass-circle-btn ktab-mobile-close-btn"
              onClick={closeTools}
              aria-label="إغلاق قائمة الأدوات"
              title="إغلاق"
            >
              <X size={16} strokeWidth={2.4} />
            </button>
            <div className="ktab-mobile-divider" aria-hidden="true" />
          </div>

          <div className="ktab-reader-dock__tools">
            {/* Play/Pause */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  isPlaying ? "ktab-glass-circle-btn--playing" : ""
                } ${isTTSLoading ? "ktab-glass-circle-btn--loading" : ""}`}
                onClick={(e) => handleActionClick(e, onTogglePlay)}
                aria-label={isTTSLoading ? "جاري التحميل" : isPlaying ? "إيقاف القراءة" : "بدء الاستماع"}
                title={isTTSLoading ? "جاري التحميل…" : isPlaying ? "إيقاف مؤقت" : "بدء الاستماع"}
              >
                {isTTSLoading ? (
                  <Loader2 size={17} strokeWidth={2.4} className="ktab-spin-fast" />
                ) : isPlaying ? (
                  <Pause size={17} strokeWidth={2.4} />
                ) : (
                  <Play size={17} strokeWidth={2.4} />
                )}
              </button>
            </div>

            {/* Voices */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  activePopover === "voices" ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("voices"))}
                aria-label="أصوات القراء"
              >
                <Headphones size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Ambient */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  effect !== "none" ? "ktab-glass-circle-btn--ambient-on" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("ambient"))}
                aria-label="المؤثرات الصوتية"
              >
                {effect === "none" ? (
                  <Volume2 size={17} strokeWidth={2.2} />
                ) : (
                  React.createElement(AMBIENT_ICON_MAP[effect] || CloudRain, { size: 17, strokeWidth: 2.2 })
                )}
              </button>
            </div>

            {/* Font */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  activePopover === "font" ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("font"))}
                aria-label="حجم الخط"
              >
                <Type size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Theme */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  activePopover === "theme" ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("theme"))}
                aria-label="المظهر والألوان"
              >
                <Palette size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Transition Modes (Mobile Popover Trigger) */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  activePopover === "modes" ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("modes"))}
                aria-label="تقليب الصفحات"
                title="تقليب الصفحات"
              >
                <BookOpen size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Fast Travel */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className="ktab-glass-circle-btn"
                onClick={(e) => handleActionClick(e, onOpenFastTravel)}
                aria-label="فهرس الصفحات"
              >
                <BookMarked size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* AI Image Generation */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className="ktab-glass-circle-btn"
                onClick={(e) => handleActionClick(e, onOpenImageGen)}
                aria-label="توليد صورة الصفحة بالذكاء الاصطناعي"
                title="صورة الصفحة"
              >
                <Paintbrush size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Fullscreen */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  isFullscreen ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, onToggleFullscreen)}
                aria-label="ملء الشاشة"
              >
                {isFullscreen ? <Minimize size={17} strokeWidth={2.2} /> : <Maximize size={17} strokeWidth={2.2} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. PC Desktop Right-Side Revealed Panel (2-Column Grid of 1:1 Squares) */}
      {isToolsOpen && (
        <aside
          className={`ktab-reader-pc-drawer ktab-reader-pc-drawer--theme-${theme} ${
            isClosing ? "ktab-reader-pc-drawer--closing" : ""
          }`}
          aria-label="أدوات القارئ والتحكم"
          dir="rtl"
        >
          <div className="ktab-reader-pc-drawer__grid">
            {pcTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  className={`ktab-pc-tool-square ${
                    tool.isActive ? "ktab-pc-tool-square--active" : ""
                  } ${tool.isLoading ? "ktab-pc-tool-square--loading" : ""}`}
                  onClick={tool.onClick}
                  aria-label={tool.label}
                  title={`${tool.label} - ${tool.sub}`}
                >
                  <div className={`ktab-pc-tool-square__icon ${tool.iconClass || ""}`}>
                    <IconComp size={22} strokeWidth={2.2} />
                  </div>
                  <div className="ktab-pc-tool-square__label">
                    <span className="ktab-pc-tool-square__title">{tool.label}</span>
                    <span className="ktab-pc-tool-square__sub">{tool.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* 8. Mobile & Tablet Floating Action Stack (Bottom-Left) */}
      <div
        className={`ktab-mobile-dock-stack ktab-mobile-dock-stack--theme-${theme} ${
          !isControlsVisible && !isLocked ? "ktab-mobile-dock-stack--hidden" : ""
        } ${isLocked ? "ktab-mobile-dock-stack--locked" : ""}`}
        dir="rtl"
      >
        {isLocked ? (
          /* When locked: ONLY the Unlock button is visible. Appendix, TTS, and Tools are completely hidden. */
          <button
            type="button"
            className="ktab-mobile-stack-btn ktab-mobile-stack-btn--unlock"
            onClick={(e) => handleActionClick(e, onToggleLock)}
            aria-label="إلغاء قفل الشاشة"
            title="إلغاء قفل الشاشة"
          >
            <Unlock size={19} strokeWidth={2.4} />
          </button>
        ) : (
          <>
            {/* 1st (bottom) in visual column-reverse: Appendix button (fihris) */}
            <button
              type="button"
              className="ktab-mobile-stack-btn ktab-mobile-stack-btn--appendix"
              onClick={(e) => handleActionClick(e, onOpenNavigator)}
              aria-label="فهرس الكتاب"
              title="فهرس الكتاب"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </button>

            {/* 2nd in visual column-reverse: Lock Screen button directly above appendix */}
            <button
              type="button"
              className="ktab-mobile-stack-btn ktab-mobile-stack-btn--lock"
              onClick={(e) => handleActionClick(e, onToggleLock)}
              aria-label="قفل الشاشة"
              title="قفل الشاشة"
            >
              <Lock size={18} strokeWidth={2.4} />
            </button>

            {/* 3rd (top) in visual column-reverse: TTS Pause / Start directly above lock */}
            <button
              type="button"
              className={`ktab-mobile-stack-btn ktab-mobile-stack-btn--tts ${
                isPlaying ? "ktab-mobile-stack-btn--playing" : ""
              } ${isTTSLoading ? "ktab-mobile-stack-btn--loading" : ""}`}
              onClick={(e) => handleActionClick(e, onTogglePlay)}
              aria-label={isTTSLoading ? "جاري التحميل" : isPlaying ? "إيقاف مؤقت" : "بدء الاستماع"}
              title={isTTSLoading ? "جاري التحميل…" : isPlaying ? "إيقاف مؤقت" : "بدء الاستماع"}
            >
              {isTTSLoading ? (
                <Loader2 size={18} strokeWidth={2.4} className="ktab-spin-fast" />
              ) : isPlaying ? (
                <Pause size={18} strokeWidth={2.4} />
              ) : (
                <Play size={18} strokeWidth={2.4} />
              )}
            </button>
          </>
        )}
      </div>

      {/* 9. Mobile & Tablet Left Edge Slider Collapse (with authentic '}' handle tab) */}
      {!isLocked && (
        <>
          {/* Backdrop overlay when slider is expanded */}
          {isLeftDrawerOpen && (
            <div
              className="ktab-mobile-slider-backdrop"
              onClick={() => setIsLeftDrawerOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Collapsible Drawer with '}' Handle */}
          <aside
            className={`ktab-mobile-slider-drawer ktab-mobile-slider-drawer--theme-${theme} ${
              isLeftDrawerOpen ? "ktab-mobile-slider-drawer--open" : ""
            } ${!isControlsVisible && !isLeftDrawerOpen ? "ktab-mobile-slider-drawer--hidden" : ""}`}
            dir="rtl"
            aria-label="شريط أدوات القارئ الجانبي"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ultra-Clean Edge Slider Handle Tab */}
            <button
              type="button"
              className={`ktab-mobile-slider-handle ${
                isLeftDrawerOpen ? "ktab-mobile-slider-handle--open" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsLeftDrawerOpen((prev) => !prev);
              }}
              aria-label={isLeftDrawerOpen ? "طي شريط الأدوات" : "فتح شريط الأدوات"}
              title={isLeftDrawerOpen ? "طي الأدوات" : "أدوات القارئ"}
            >
              <span className="ktab-mobile-slider-handle__chevron">
                {isLeftDrawerOpen ? (
                  <ChevronLeft size={14} strokeWidth={2.6} />
                ) : (
                  <ChevronRight size={14} strokeWidth={2.6} />
                )}
              </span>
            </button>

            {/* Header with Close Icon inside drawer */}
            <div className="ktab-mobile-slider-drawer__header">
              <button
                type="button"
                className="ktab-mobile-slider-drawer__close"
                onClick={() => setIsLeftDrawerOpen(false)}
                aria-label="إغلاق"
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            {/* Scrollable vertical column - All reader icons inside, 1 icon per row */}
            <div className="ktab-mobile-slider-drawer__scroll">
              {/* 1. Play / Pause TTS */}
              <button
                type="button"
                className={`ktab-left-drawer-icon-btn ${
                  isPlaying ? "ktab-left-drawer-icon-btn--playing" : ""
                } ${isTTSLoading ? "ktab-left-drawer-icon-btn--loading" : ""}`}
                onClick={(e) => handleActionClick(e, onTogglePlay)}
                aria-label={isTTSLoading ? "جاري التحميل" : isPlaying ? "إيقاف مؤقت" : "بدء الاستماع"}
                title={isTTSLoading ? "جاري التحميل…" : isPlaying ? "إيقاف مؤقت" : "بدء الاستماع"}
              >
                {isTTSLoading ? (
                  <Loader2 size={19} strokeWidth={2.4} className="ktab-spin-fast" />
                ) : isPlaying ? (
                  <Pause size={19} strokeWidth={2.4} />
                ) : (
                  <Play size={19} strokeWidth={2.4} />
                )}
              </button>

              {/* 2. Reader Voice */}
              <button
                type="button"
                className={`ktab-left-drawer-icon-btn ${
                  activePopover === "voices" ? "ktab-left-drawer-icon-btn--active" : ""
                }`}
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onTogglePopover?.("voices");
                  });
                }}
                aria-label="صوت القارئ"
                title="صوت القارئ"
              >
                <Headphones size={19} strokeWidth={2.2} />
              </button>

              {/* 3. Ambient Sounds */}
              <button
                type="button"
                className={`ktab-left-drawer-icon-btn ${
                  effect !== "none" || activePopover === "ambient"
                    ? "ktab-left-drawer-icon-btn--active"
                    : ""
                }`}
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onTogglePopover?.("ambient");
                  });
                }}
                aria-label="المؤثرات الصوتية"
                title="المؤثرات الصوتية"
              >
                {effect === "none" ? (
                  <Volume2 size={19} strokeWidth={2.2} />
                ) : (
                  React.createElement(AMBIENT_ICON_MAP[effect] || CloudRain, {
                    size: 19,
                    strokeWidth: 2.2,
                  })
                )}
              </button>

              {/* 4. Font Size */}
              <button
                type="button"
                className={`ktab-left-drawer-icon-btn ${
                  activePopover === "font" ? "ktab-left-drawer-icon-btn--active" : ""
                }`}
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onTogglePopover?.("font");
                  });
                }}
                aria-label="حجم الخط"
                title="حجم الخط"
              >
                <Type size={19} strokeWidth={2.2} />
              </button>

              {/* 5. Theme */}
              <button
                type="button"
                className={`ktab-left-drawer-icon-btn ${
                  activePopover === "theme" ? "ktab-left-drawer-icon-btn--active" : ""
                }`}
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onTogglePopover?.("theme");
                  });
                }}
                aria-label="المظهر والألوان"
                title="المظهر والألوان"
              >
                <Palette size={19} strokeWidth={2.2} />
              </button>

              {/* 6. Transition Mode */}
              <button
                type="button"
                className={`ktab-left-drawer-icon-btn ${
                  activePopover === "modes" ? "ktab-left-drawer-icon-btn--active" : ""
                }`}
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onTogglePopover?.("modes");
                  });
                }}
                aria-label="تقليب الصفحات"
                title="تقليب الصفحات"
              >
                <BookOpen size={19} strokeWidth={2.2} />
              </button>

              {/* 7. AI Image Generation */}
              <button
                type="button"
                className="ktab-left-drawer-icon-btn"
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onOpenImageGen?.();
                  });
                }}
                aria-label="صورة الصفحة بالذكاء الاصطناعي"
                title="صورة الصفحة"
              >
                <Paintbrush size={19} strokeWidth={2.2} />
              </button>

              {/* 8. Fast Travel */}
              <button
                type="button"
                className="ktab-left-drawer-icon-btn"
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onOpenFastTravel?.();
                  });
                }}
                aria-label="فهرس الصفحات السريع"
                title="انتقال سريع"
              >
                <BookMarked size={19} strokeWidth={2.2} />
              </button>

              {/* 9. Appendix / Chapters */}
              <button
                type="button"
                className="ktab-left-drawer-icon-btn"
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onOpenNavigator?.();
                  });
                }}
                aria-label="فهرس ودليل الكتاب"
                title="فهرس الكتاب"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </button>

              {/* 10. Lock Screen */}
              <button
                type="button"
                className="ktab-left-drawer-icon-btn"
                onClick={(e) => {
                  handleActionClick(e, () => {
                    setIsLeftDrawerOpen(false);
                    onToggleLock?.();
                  });
                }}
                aria-label="قفل الشاشة"
                title="قفل الشاشة"
              >
                <Lock size={19} strokeWidth={2.4} />
              </button>

              {/* 11. Fullscreen */}
              <button
                type="button"
                className={`ktab-left-drawer-icon-btn ${
                  isFullscreen ? "ktab-left-drawer-icon-btn--active" : ""
                }`}
                onClick={(e) => {
                  handleActionClick(e, onToggleFullscreen);
                }}
                aria-label="ملء الشاشة"
                title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              >
                {isFullscreen ? (
                  <Minimize size={19} strokeWidth={2.2} />
                ) : (
                  <Maximize size={19} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export default ReaderGlassHeader;

