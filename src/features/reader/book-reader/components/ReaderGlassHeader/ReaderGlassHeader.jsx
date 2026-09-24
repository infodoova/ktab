import React from "react";
import {
  ChevronLeft,
  Play,
  Pause,
  Headphones,
  Sparkles,
  Type,
  Palette,
  Compass,
  Lock,
  Unlock,
  Check,
  Volume2,
  Menu,
  X,
  VolumeX,
  CloudRain,
  Wind,
  TreePalm,
  Maximize,
  Minimize,
} from "lucide-react";
import { THEMES_LIST, VOICES_LIST, AMBIENT_EFFECTS } from "../../constants/readerConstants";
import { useReaderGlassHeader } from "../../hooks/useReaderGlassHeader";
import "./ReaderGlassHeader.css";

const AMBIENT_ICON_MAP = {
  none: VolumeX,
  rain: CloudRain,
  wind: Wind,
  nature: TreePalm,
};

/**
 * Apple visionOS / iOS 18 Liquid Glass Floating Dock & Controls.
 * - Mobile: Displays a single elegant launcher button that smoothly animates open
 *   to reveal all tools with an X close button, preventing screen clutter.
 * - Desktop: Full horizontal liquid glass floating dock.
 * - Root-level popovers with touch isolation to guarantee smooth scrolling on mobile.
 */
export function ReaderGlassHeader(props) {
  const {
    onBack,
    isPlaying = false,
    onTogglePlay,
    voice,
    onSelectVoice,
    effect = "none",
    onSelectEffect,
    fontSize = 18,
    onFontSizeChange,
    theme = "pure-white",
    onSelectTheme,
    activePopover = null,
    onTogglePopover,
    onOpenFastTravel,
    isLocked = false,
    onToggleLock,
    isFullscreen = false,
    onToggleFullscreen,
    isControlsVisible = true,
  } = props;

  const {
    isMobileMenuOpen,
    isClosing,
    openMobileMenu,
    closeMobileMenu,
    fontPercent,
    isHidden,
    handleActionClick,
  } = useReaderGlassHeader({
    fontSize,
    isControlsVisible,
    isLocked,
  });

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
        } ${isMobileMenuOpen && !isClosing ? "ktab-reader-back-anchor--hidden-mobile" : ""}`}
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

      {/* 3. Backdrop overlay for dismissing popovers or mobile expanded menu cleanly */}
      {activePopover && (
        <div
          className="ktab-glass-popover-backdrop"
          onClick={() => onTogglePopover?.(null)}
          aria-hidden="true"
        />
      )}
      {isMobileMenuOpen && !activePopover && (
        <div
          className={`ktab-mobile-dock-backdrop ${
            isClosing ? "ktab-mobile-dock-backdrop--closing" : ""
          }`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* 4. Top-Level Liquid Glass Popovers (Rendered outside dock to avoid overflow clipping and touch interference) */}
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
                    {isSelected && <Check size={16} strokeWidth={2.8} className="text-teal-500" />}
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
                      {React.createElement(AMBIENT_ICON_MAP[eff.id] || Sparkles, { size: 16 })}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="ktab-ambient-label">{eff.label}</span>
                      <span className="ktab-ambient-desc">{eff.desc}</span>
                    </div>
                  </div>
                  {isSelected && <Check size={16} strokeWidth={2.8} className="text-teal-500" />}
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

          {/* Live Font Sample Preview */}
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

      {/* 5. Apple Liquid Glass Dock on Maximum Right */}
      <div
        className={`ktab-reader-dock-anchor ktab-reader-header--theme-${theme} ${
          isHidden ? "ktab-reader-controls--hidden" : ""
        } ${isMobileMenuOpen ? "ktab-reader-dock-anchor--expanded" : ""} ${
          isClosing ? "ktab-reader-dock-anchor--closing" : ""
        }`}
      >
        <div
          className={`ktab-reader-dock ktab-reader-dock--theme-${theme} ${
            isMobileMenuOpen
              ? "ktab-reader-dock--expanded"
              : "ktab-reader-dock--collapsed"
          } ${isClosing ? "ktab-reader-dock--closing" : ""}`}
          role="toolbar"
          aria-label="أدوات القارئ"
        >
          {/* Mobile Launcher Button: Visible on mobile when collapsed */}
          <button
            type="button"
            className="ktab-glass-circle-btn ktab-mobile-launcher-btn"
            onClick={openMobileMenu}
            aria-label="أدوات وخيارات القارئ"
            title="الأدوات"
          >
            <Menu size={18} strokeWidth={2.4} />
          </button>

          {/* Mobile Close Button & Divider: Visible when expanded on mobile */}
          <div className="ktab-mobile-close-group">
            <button
              type="button"
              className="ktab-glass-circle-btn ktab-mobile-close-btn"
              onClick={closeMobileMenu}
              aria-label="إغلاق قائمة الأدوات"
              title="إغلاق"
            >
              <X size={16} strokeWidth={2.4} />
            </button>
            <div className="ktab-mobile-divider" aria-hidden="true" />
          </div>

          {/* Tools Container (1 row on desktop flex, 2 rows of 4 on mobile grid) */}
          <div className="ktab-reader-dock__tools">
            {/* Action 1: Play / Pause TTS */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  isPlaying ? "ktab-glass-circle-btn--playing" : ""
                }`}
                onClick={(e) => handleActionClick(e, onTogglePlay)}
                aria-label={isPlaying ? "إيقاف القراءة الصوتية" : "بدء الاستماع"}
              >
                {isPlaying ? (
                  <Pause size={18} strokeWidth={2.4} />
                ) : (
                  <Play size={18} strokeWidth={2.4} />
                )}
              </button>
              <span className="ktab-glass-tooltip" role="tooltip">
                {isPlaying ? "إيقاف مؤقت" : "بدء الاستماع"}
              </span>
            </div>

            {/* Action 2: Voices Selector */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  activePopover === "voices" ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("voices"))}
                aria-label="اختيار صوت القارئ"
              >
                <Headphones size={18} strokeWidth={2.2} />
              </button>
              {activePopover !== "voices" && (
                <span className="ktab-glass-tooltip" role="tooltip">
                  أصوات القراء
                </span>
              )}
            </div>

            {/* Action 3: Ambient Background Sound */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  effect !== "none" ? "ktab-glass-circle-btn--ambient-on" : ""
                } ${activePopover === "ambient" ? "ktab-glass-circle-btn--active" : ""}`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("ambient"))}
                aria-label="المؤثرات الصوتية وأصوات الخلفية"
              >
                {effect === "none" ? (
                  <Volume2 size={18} strokeWidth={2.2} />
                ) : (
                  React.createElement(AMBIENT_ICON_MAP[effect] || CloudRain, { size: 18, strokeWidth: 2.2 })
                )}
              </button>
              {activePopover !== "ambient" && (
                <span className="ktab-glass-tooltip" role="tooltip">
                  أصوات الخلفية
                </span>
              )}
            </div>

            {/* Action 4: Font Size Stepper */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  activePopover === "font" ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("font"))}
                aria-label="تكبير وتصغير حجم الخط"
              >
                <Type size={18} strokeWidth={2.2} />
              </button>
              {activePopover !== "font" && (
                <span className="ktab-glass-tooltip" role="tooltip">
                  حجم الخط ({fontPercent}%)
                </span>
              )}
            </div>

            {/* Action 5: Theme Colors & Background */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  activePopover === "theme" ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, () => onTogglePopover?.("theme"))}
                aria-label="ألوان وخلفية القراءة"
              >
                <Palette size={18} strokeWidth={2.2} />
              </button>
              {activePopover !== "theme" && (
                <span className="ktab-glass-tooltip" role="tooltip">
                  المظهر والألوان
                </span>
              )}
            </div>

            {/* Action 6: Fast Travel */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className="ktab-glass-circle-btn"
                onClick={(e) => handleActionClick(e, onOpenFastTravel)}
                aria-label="فهرس الصفحات والتنقل السريع"
              >
                <Compass size={18} strokeWidth={2.2} />
              </button>
              <span className="ktab-glass-tooltip" role="tooltip">
                فهرس الصفحات
              </span>
            </div>

            {/* Action 7: True Fullscreen Toggle */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className={`ktab-glass-circle-btn ${
                  isFullscreen ? "ktab-glass-circle-btn--active" : ""
                }`}
                onClick={(e) => handleActionClick(e, onToggleFullscreen)}
                aria-label={isFullscreen ? "الخروج من وضع ملء الشاشة" : "وضع ملء الشاشة الكامل"}
                title={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
              >
                {isFullscreen ? (
                  <Minimize size={18} strokeWidth={2.2} />
                ) : (
                  <Maximize size={18} strokeWidth={2.2} />
                )}
              </button>
              <span className="ktab-glass-tooltip" role="tooltip">
                {isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              </span>
            </div>

            {/* Action 8: Focus Lock */}
            <div className="ktab-glass-btn-anchor">
              <button
                type="button"
                className="ktab-glass-circle-btn"
                onClick={(e) => handleActionClick(e, onToggleLock)}
                aria-label="قفل الشاشة وإخفاء الأدوات للتركيز"
              >
                <Lock size={18} strokeWidth={2.2} />
              </button>
              <span className="ktab-glass-tooltip" role="tooltip">
                قفل الشاشة
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReaderGlassHeader;
