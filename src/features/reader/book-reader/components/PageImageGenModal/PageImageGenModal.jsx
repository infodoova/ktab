import {
  Paintbrush,
  Camera,
  Palette,
  Brush,
  PenTool,
  Pencil,
  Layers,
  Grid,
  Wand2,
  Sparkle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Loader2,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { ShareMenu } from "@/components/common";
import { usePageImageGen } from "../../hooks/usePageImageGen";
import "./PageImageGenModal.css";

/**
 * Returns a distinctive artistic icon for each art style theme.
 */
function renderThemeIcon(themeVal) {
  const v = String(themeVal || "").toUpperCase();
  if (v.includes("REALISTIC") || v.includes("PHOTO")) {
    return <Camera size={14} strokeWidth={2} />;
  }
  if (v.includes("OIL")) {
    return <Palette size={14} strokeWidth={2} />;
  }
  if (v.includes("WATERCOLOR")) {
    return <Brush size={14} strokeWidth={2} />;
  }
  if (v.includes("PENCIL") || v.includes("SKETCH")) {
    return <Pencil size={14} strokeWidth={2} />;
  }
  if (v.includes("FLAT")) {
    return <Layers size={14} strokeWidth={2} />;
  }
  if (v.includes("PIXEL")) {
    return <Grid size={14} strokeWidth={2} />;
  }
  if (v.includes("FANTASY") || v.includes("EPIC")) {
    return <Wand2 size={14} strokeWidth={2} />;
  }
  if (v.includes("ANIME")) {
    return <Sparkle size={14} strokeWidth={2} />;
  }
  if (v.includes("CARTOON")) {
    return <PenTool size={14} strokeWidth={2} />;
  }
  return <Paintbrush size={14} strokeWidth={2} />;
}

/**
 * Returns a clean proportional SVG icon representing the aspect ratio.
 */
function renderRatioIcon(ratioStr) {
  const r = String(ratioStr || "");
  if (r === "1:1") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    );
  }
  if (r === "3:4" || r === "2:3") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" />
      </svg>
    );
  }
  if (r === "9:16") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="6" y="1" width="12" height="22" rx="2" />
      </svg>
    );
  }
  if (r === "4:3") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
      </svg>
    );
  }
  if (r === "16:9") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="5" width="22" height="14" rx="2" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

/**
 * Editorial scene illustration modal built on standard DetailsDrawer.
 * Allows user to highlight text directly from the 3-page sheet displayed beside the modal.
 * Strictly prevents direct manual prompt typing and clipboard copying.
 */
export function PageImageGenModal(props) {
  const {
    isOpen,
    onClose,
    bookId,
    bookTitle = "",
    currentPage = 1,
    totalPages = 1,
    bookRef,
    theme = "pure-white",
  } = props;

  const {
    themes,
    aspectRatios,
    loadingFilters,
    contextText,
    charCount,
    maxChars,
    isUserSelected,
    minPage,
    maxPage,
    selectedTheme,
    setSelectedTheme,
    selectedAspectRatio,
    setSelectedAspectRatio,
    currentRatioCss,
    isGenerating,
    activeJob,
    downloading,
    isCollapsed,
    setIsCollapsed,
    toggleCollapse,
    handleGenerate,
    handleResetSelection,
    handleResetJob,
    handleDownloadImage,
  } = usePageImageGen({
    bookId,
    bookTitle,
    currentPage,
    totalPages,
    bookRef,
    isOpen,
  });

  const isCompleted = activeJob?.status === "COMPLETED" && Boolean(activeJob?.imageUrl);
  const isProcessing = isGenerating && activeJob && activeJob.status !== "COMPLETED";

  const subtitle =
    minPage === maxPage
      ? `${bookTitle ? `${bookTitle} • ` : ""}الصفحة ${currentPage}`
      : `${bookTitle ? `${bookTitle} • ` : ""}الصفحات ${minPage}–${maxPage}`;

  const footer = (
    <div className="ktab-img-drawer__footer-inner">
      <button
        type="button"
        className="ktab-img-gen-btn"
        onClick={handleGenerate}
        disabled={isGenerating || !contextText.trim() || loadingFilters}
        id="btn-generate-page-image"
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>جارٍ التوليد...</span>
          </>
        ) : (
          <>
            <Paintbrush size={18} strokeWidth={2.2} />
            <span>{isCompleted ? "إعادة التوليد" : "توليد صورة المشهد"}</span>
          </>
        )}
      </button>
    </div>
  );

  const collapseButton = (
    <button
      type="button"
      className="ktab-img-collapse-toggle-btn"
      onClick={() => setIsCollapsed(true)}
      title="طي النافذة لعرض النص والتحديد بحرية"
      aria-label="طي النافذة لعرض النص والتحديد بحرية"
    >
      <ChevronDown size={17} strokeWidth={2.4} />
      <span>عرض النص</span>
    </button>
  );

  return (
    <>
      <DetailsDrawer
        isOpen={isOpen && !isCollapsed}
        onClose={onClose}
        onBackdropClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setIsCollapsed(true);
          }
        }}
        headerActions={collapseButton}
        title="توليد صورة المشهد"
        subtitle={subtitle}
        footer={footer}
        width="460px"
        className={`ktab-page-image-gen-drawer ktab-page-image-gen-drawer--${theme}`}
      >
      {/* ── State 1: Generating / Loading -> Pure Color Gradient Style Loader ── */}
      {isProcessing && (
        <div className="ktab-img-gradient-card">
          <div
            className="ktab-img-gradient-canvas"
            style={{ "--img-ratio": currentRatioCss }}
          >
            <div className="ktab-img-gradient-mesh" />
            <div className="ktab-img-gradient-glow-orb ktab-img-gradient-glow-orb--1" />
            <div className="ktab-img-gradient-glow-orb ktab-img-gradient-glow-orb--2" />
            <div className="ktab-img-gradient-glow-orb ktab-img-gradient-glow-orb--3" />
            <div className="ktab-img-gradient-shimmer" />
            <div className="ktab-img-gradient-caption">
              <span className="ktab-img-gradient-caption__text">
                {activeJob?.status === "QUEUED"
                  ? "بانتظار بدء المعالجة..."
                  : "جارٍ رسم المشهد بالذكاء الاصطناعي..."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── State 2: Completed -> Generated Image Result Card ────── */}
      {isCompleted && (
        <div className="ktab-img-result">
          <div
            className="ktab-img-result__frame"
            style={{ "--img-ratio": currentRatioCss }}
          >
            <img
              src={activeJob.imageUrl}
              alt="المشهد المُنتَج"
              className="ktab-img-result__image"
            />
          </div>
          <div className="ktab-img-result__bar">
            <ShareMenu
              url={activeJob.imageUrl}
              title={bookTitle ? `لوحة من: ${bookTitle}` : "لوحة كتاب"}
              text={`لوحة فنية مُولّدة لكتاب "${bookTitle || "كِتَاب"}"`}
              align="right"
              direction="up"
            >
              <button
                type="button"
                className="ktab-img-result__btn"
              >
                <Share2 size={15} />
                <span>مشاركة</span>
              </button>
            </ShareMenu>
            <button
              type="button"
              className="ktab-img-result__btn"
              onClick={() => handleDownloadImage(activeJob.imageUrl)}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Download size={15} />
              )}
              <span>{downloading ? "جارٍ التنزيل..." : "تنزيل"}</span>
            </button>
            <button
              type="button"
              className="ktab-img-result__btn ktab-img-result__btn--ghost"
              onClick={handleResetJob}
              title="تعديل الأسلوب والخيارات"
            >
              <SlidersHorizontal size={15} />
              <span>الخيارات</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Selected Text Preview (Kept underneath placeholder/image) ── */}
      <div className="ktab-img-section">
        <div className="ktab-img-section__head">
          <div className="ktab-img-section__title-wrap">
            <span className="ktab-img-section__label">النص المختار لتوليد المشهد</span>
            {!isProcessing && (
              <span
                className={`ktab-img-char-count ${
                  charCount > 0 ? "ktab-img-char-count--active" : ""
                }`}
              >
                {charCount.toLocaleString()} / {maxChars.toLocaleString()} حرف
              </span>
            )}
          </div>
          {!isProcessing && isUserSelected && contextText && (
            <button
              type="button"
              className="ktab-img-clear-btn"
              onClick={handleResetSelection}
              title="إلغاء التحديد"
              aria-label="إلغاء التحديد"
            >
              <X size={13} />
              <span>إلغاء</span>
            </button>
          )}
        </div>
        <div
          className={`ktab-img-selected-box ${
            !contextText ? "ktab-img-selected-box--empty" : ""
          }`}
        >
          {contextText ? (
            <p className="ktab-img-selected-text">{contextText}</p>
          ) : (
            <p className="ktab-img-selected-placeholder">
              حدد النص المراد رسمه من صفحات الكتاب المعروضة (بحد أقصى {maxChars.toLocaleString()} حرف)...
            </p>
          )}
        </div>
      </div>

      {/* ── Filters (Hidden completely during loading and when image completed) ── */}
      {!isProcessing && !isCompleted && (
        <>
          {/* ── Art Theme Selection (1 Scrollable Row) ─────────── */}
          <div className="ktab-img-section">
            <div className="ktab-img-section__head">
              <span className="ktab-img-section__label">أسلوب الرسم</span>
            </div>
            {loadingFilters ? (
              <div className="ktab-img-loader-row">
                <Loader2 size={14} className="animate-spin" />
                <span>جارٍ تحميل الأساليب...</span>
              </div>
            ) : themes.length > 0 ? (
              <div className="ktab-img-chips-scroll">
                {themes.map((t) => {
                  const sel = selectedTheme === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      className={`ktab-img-chip ${sel ? "ktab-img-chip--on" : ""}`}
                      onClick={() => setSelectedTheme(t.value)}
                      disabled={isGenerating}
                      title={t.description || t.displayName}
                    >
                      <span className="ktab-img-chip__icon" aria-hidden="true">
                        {sel ? <Check size={14} strokeWidth={2.8} /> : renderThemeIcon(t.value)}
                      </span>
                      <span>{t.displayName}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* ── Aspect Ratio Selection (1 Scrollable Row with Icons) */}
          {!loadingFilters && aspectRatios.length > 0 && (
            <div className="ktab-img-section">
              <div className="ktab-img-section__head">
                <span className="ktab-img-section__label">أبعاد الصورة</span>
              </div>
              <div className="ktab-img-chips-scroll">
                {aspectRatios.map((r) => {
                  const sel = selectedAspectRatio === r.value;
                  const ratioDisplay = r.ratio || r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      className={`ktab-img-chip ktab-img-chip--ratio ${sel ? "ktab-img-chip--on" : ""}`}
                      onClick={() => setSelectedAspectRatio(r.value)}
                      disabled={isGenerating}
                    >
                      <span className="ktab-img-chip__icon" aria-hidden="true">
                        {renderRatioIcon(ratioDisplay)}
                      </span>
                      <span>{ratioDisplay}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </DetailsDrawer>

      {/* ── Collapsed Floating Bottom Dock (Mobile & Tablets) ── */}
      <AnimatePresence>
        {isOpen && isCollapsed && (
          <motion.div
            key="ktab-image-gen-collapsed-dock"
            className={`ktab-img-collapsed-dock ktab-img-collapsed-dock--${theme}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            role="region"
            aria-label="شريط خيارات توليد صورة المشهد"
          >
            {/* Status / Selection info pill */}
            <div className="ktab-img-dock__status">
              <span className="ktab-img-dock__status-text">
                {contextText
                  ? `${charCount.toLocaleString()} حرف مختار`
                  : "اختر نصاً للرسم..."}
              </span>
              {contextText && !isProcessing && (
                <button
                  type="button"
                  className="ktab-img-dock__clear-btn"
                  onClick={handleResetSelection}
                  title="إلغاء التحديد"
                  aria-label="إلغاء التحديد"
                >
                  <X size={12} strokeWidth={2.6} />
                </button>
              )}
            </div>

            {/* Action buttons group */}
            <div className="ktab-img-dock__actions">
              {/* Expand filters button */}
              <button
                type="button"
                className="ktab-img-dock__btn ktab-img-dock__btn--filter"
                onClick={() => setIsCollapsed(false)}
                title="تعديل الأسلوب والأبعاد والخيارات"
                aria-label="تعديل الأسلوب والأبعاد والخيارات"
              >
                <ChevronUp size={15} strokeWidth={2.4} />
                <span>الفلاتر</span>
              </button>

              {/* Generate or Result status button */}
              {isProcessing ? (
                <button
                  type="button"
                  className="ktab-img-dock__btn ktab-img-dock__btn--primary ktab-img-dock__btn--loading"
                  onClick={() => setIsCollapsed(false)}
                  title="عرض حالة التوليد"
                >
                  <Loader2 size={15} className="animate-spin" />
                  <span>جارٍ الرسم...</span>
                </button>
              ) : isCompleted ? (
                <button
                  type="button"
                  className="ktab-img-dock__btn ktab-img-dock__btn--primary ktab-img-dock__btn--completed"
                  onClick={() => setIsCollapsed(false)}
                  title="عرض الصورة المنتجة وتنزيلها"
                >
                  <Sparkle size={15} />
                  <span>عرض الصورة</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="ktab-img-dock__btn ktab-img-dock__btn--primary"
                  onClick={handleGenerate}
                  disabled={!contextText.trim() || loadingFilters}
                  title={!contextText.trim() ? "حدد نصاً أولاً من الصفحة" : "توليد صورة المشهد"}
                >
                  <Paintbrush size={15} strokeWidth={2.2} />
                  <span>توليد</span>
                </button>
              )}

              {/* Close session */}
              <button
                type="button"
                className="ktab-img-dock__btn ktab-img-dock__btn--close"
                onClick={onClose}
                title="إغلاق"
                aria-label="إغلاق وضع توليد المشاهد"
              >
                <X size={15} strokeWidth={2.4} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PageImageGenModal;
