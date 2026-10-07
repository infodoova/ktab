import React, { memo, useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  User,
  Layers,
  FileDown,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Ban,
  Loader2,
  Check,
  Type,
  Languages,
  Compass,
  Palette,
  MapPin,
  Pencil,
  X,
  Edit3,
  ZoomIn,
} from "lucide-react";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { storyBooksService } from "../../services/storyBooksService";
import { useStoryPageRegeneration } from "../../hooks/useStoryPageRegeneration";
import {
  getStoryStatusConfig,
  LANGUAGE_VARIETIES,
  TASHKEEL_LEVELS,
  INTERESTS,
  STORY_SETTINGS,
} from "../../constants/storyBooksConstants";
import { AlertToast } from "@/components/myui/AlertToast";
import "./StoryBookDetailsDrawer.css";

const MAX_PAGE_CHARS = 300;
const MAX_TITLE_CHARS = 60;

const PIPELINE_STAGES = [
  { id: "TEXT", label: "صياغة النص" },
  { id: "CHAR", label: "مظهر البطل" },
  { id: "ILLUST", label: "رسم المشاهد" },
  { id: "QA", label: "فحص الجودة" },
  { id: "RENDER", label: "تجهيز الكتاب" },
];

const getStageState = (stageId, currentStatus, isStoryApproved = false) => {
  const statusRanks = {
    DRAFT: 0,
    STORY_READY: isStoryApproved ? 1 : 0.5,
    CHARACTER_READY: 1.5,
    ILLUSTRATING: 2,
    QA: 3,
    RENDERING: 4,
    READY: 5,
    FAILED: -1,
    CANCELLED: -1,
  };
  const stageRanks = {
    TEXT: 0,
    CHAR: 1,
    ILLUST: 2,
    QA: 3,
    RENDER: 4,
  };
  const currentRank = statusRanks[currentStatus] ?? 0;
  const stageRank = stageRanks[stageId] ?? 0;

  if (currentRank > stageRank) return "done";
  if (Math.floor(currentRank) === stageRank) return "current";
  return "pending";
};

const getProgressPercent = (currentStatus, isStoryApproved = false) => {
  switch (currentStatus) {
    case "DRAFT": return 20;
    case "STORY_READY": return isStoryApproved ? 42 : 35;
    case "CHARACTER_READY": return 50;
    case "ILLUSTRATING": return 70;
    case "QA": return 85;
    case "RENDERING": return 95;
    case "READY":
    case "COMPLETED": return 100;
    default: return 10;
  }
};

/**
 * PageCardImage with inline loader and graceful fade-in
 */
const PageCardImage = memo(function PageCardImage({
  src,
  alt,
  isCover = false,
  onPreview = null,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setLoaded(false);
    setError(false);
  }

  if (!src) return null;

  const isClickable = loaded && Boolean(onPreview);

  return (
    <div
      className={`child-story-drawer__story-card-img-wrap ${
        isCover ? "child-story-drawer__story-card-img-wrap--cover" : ""
      } ${isClickable ? "child-story-drawer__story-card-img-wrap--clickable" : ""}`}
      onClick={(e) => {
        if (isClickable) {
          e.stopPropagation();
          onPreview({ src, alt });
        }
      }}
      title={isClickable ? "انقر لعرض الرسمة بملء الشاشة" : undefined}
    >
      {!loaded && !error && (
        <div className="child-story-drawer__page-img-loading">
          <Loader2 size={18} className="child-story-drawer__spinner" />
          <span>جاري تحميل الرسمة...</span>
        </div>
      )}
      {error ? (
        <div className="child-story-drawer__page-img-error">
          <AlertCircle size={16} />
          <span>تعذر تحميل الرسمة</span>
        </div>
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            className={`child-story-drawer__story-card-img ${
              loaded
                ? "child-story-drawer__story-card-img--loaded"
                : "child-story-drawer__story-card-img--loading"
            }`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
          {isClickable && (
            <div className="child-story-drawer__img-zoom-badge" aria-hidden="true">
              <ZoomIn size={13} />
              <span>تكبير</span>
            </div>
          )}
        </>
      )}
    </div>
  );
});

/**
 * Full-screen image preview lightbox for StoryBook details modal.
 */
const StoryImageLightbox = memo(function StoryImageLightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="child-story-drawer__lightbox-overlay"
      onClick={onClose}
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="child-story-drawer__lightbox-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="child-story-drawer__lightbox-header">
          <span className="child-story-drawer__lightbox-title">
            {image.alt || "معاينة الرسمة"}
          </span>
          <button
            type="button"
            className="child-story-drawer__lightbox-close-btn"
            onClick={onClose}
            title="إغلاق (Esc)"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        <div className="child-story-drawer__lightbox-media">
          <img
            src={image.src}
            alt={image.alt || "معاينة الرسمة"}
            className="child-story-drawer__lightbox-img"
          />
        </div>
      </div>
    </div>
  );
});

/**
 * Live Storybook Details Drawer.
 * Fetches real backend StorybookDetail with actions based on status:
 * - READY: Start reading, download PDF, view generated page illustrations.
 * - STORY_READY: Review story text, approve story.
 * - CHARACTER_READY: Review character sheet, approve or regenerate.
 * - ILLUSTRATING / RENDERING / QA: Real-time status polling.
 * - FAILED: Review error and resume generation.
 */
export const StoryBookDetailsDrawer = memo(function StoryBookDetailsDrawer({
  story,
  isOpen = false,
  onClose,
  onStartReading,
  onStatusUpdated,
  onRequestCancel,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // In-line page text editing state
  const [editingPageIndex, setEditingPageIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [savingPage, setSavingPage] = useState(false);

  const storyId = story?.id;

  const fetchDetail = useCallback(async () => {
    if (!storyId) return;
    setFetchError(false);
    try {
      const res = await storyBooksService.getStoryBook(storyId);
      if (res?.success && res.data) {
        setDetail(res.data);
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    }
  }, [storyId]);

  useEffect(() => {
    if (!isOpen || !storyId) {
      setDetail(null);
      setFetchError(false);
      setEditingPageIndex(null);
      setEditingText("");
      setPreviewImage(null);
      return;
    }

    setLoading(true);
    fetchDetail().finally(() => setLoading(false));

    // Auto-poll if book is currently being processed
    let intervalId = null;
    const currentStatus = detail?.status || story?.status;
    const isApproved = Boolean(detail?.storyApproved ?? story?.storyApproved);
    const awaitingCharacter = currentStatus === "STORY_READY" && isApproved;
    const isProcessing =
      ["DRAFT", "ILLUSTRATING", "QA", "RENDERING"].includes(currentStatus) || awaitingCharacter;

    if (isProcessing) {
      intervalId = setInterval(() => {
        fetchDetail();
      }, 4000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, storyId, detail?.status, detail?.storyApproved, story?.status, story?.storyApproved, fetchDetail]);

  const activeData = detail || story;
  const status = activeData?.status || "DRAFT";
  const isStoryApproved = Boolean(detail?.storyApproved ?? story?.storyApproved);
  const isWaitingForCharacter = status === "STORY_READY" && isStoryApproved;
  const statusConfig = isWaitingForCharacter
    ? { label: "جاري إعداد مظهر البطل...", color: "#0f172a", bg: "#ffffff", border: "#94a3b8", canRead: false }
    : getStoryStatusConfig(status);

  // Editing allowed strictly during text generation finish (STORY_READY) and BEFORE submission
  const canEditPages = status === "STORY_READY" && !isStoryApproved;
  const { canRegeneratePages, handleRegeneratePage } = useStoryPageRegeneration({
    storyId,
    status,
    regenerationsLeft: activeData?.pageRegenerationsLeft,
    actionInProgress,
    setActionInProgress,
    fetchDetail,
    onStatusUpdated,
  });

  const handleStartEditPage = (pageIndex, currentText) => {
    if (!canEditPages) return;
    setEditingPageIndex(pageIndex);
    setEditingText(currentText || "");
  };

  const handleCancelEditPage = () => {
    setEditingPageIndex(null);
    setEditingText("");
  };

  const handleSaveEditPage = async (pageIndex) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      AlertToast("لا يمكن أن يكون النص فارغاً", "WARNING");
      return;
    }
    if (savingPage) return;

    const isCover = pageIndex === 0;
    const snapshot = detail;

    // Optimistic update + close editor immediately (no waiting on the server)
    setDetail((prev) => {
      if (!prev) return prev;
      if (isCover) return { ...prev, titleAr: trimmed };
      return {
        ...prev,
        pages: (prev.pages || []).map((p, idx) => {
          const pIdx = Number.isInteger(p.pageIndex) ? p.pageIndex : (p.kind === "COVER" ? 0 : idx + 1);
          return pIdx === pageIndex ? { ...p, textAr: trimmed } : p;
        }),
      };
    });
    setEditingPageIndex(null);
    setEditingText("");
    setSavingPage(true);

    try {
      // Backend: PUT /api/v1/storybook/books/{id}/story — send ONLY what changed
      await storyBooksService.editStory(
        storyId,
        isCover
          ? { titleAr: trimmed }
          : { pages: [{ pageIndex, textAr: trimmed }] }
      );
      AlertToast("تم حفظ التعديل ✓", "SUCCESS");
    } catch (err) {
      setDetail(snapshot);
      AlertToast(err?.message || "تعذر حفظ التعديل على الخادم", "ERROR");
    } finally {
      setSavingPage(false);
    }
  };

  // Approve Story (After submission, no further edits allowed)
  const handleApproveStory = async () => {
    setActionInProgress(true);
    setEditingPageIndex(null);
    try {
      // Edits are already persisted through PUT /story
      const res = await storyBooksService.approveStory(storyId);
      AlertToast(
        res?.message || "تم اعتماد القصة بنجاح وبدأ رسم لوحة الشخصية، وسنرسل لك بريداً إلكترونياً فور جهوزيتها.",
        "SUCCESS"
      );
      await fetchDetail();
      onStatusUpdated?.();
    } catch (err) {
      AlertToast(err?.message || "تعذر اعتماد نص القصة حالياً", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  };

  // Approve Character
  const handleApproveCharacter = async () => {
    setActionInProgress(true);
    try {
      const res = await storyBooksService.approveCharacter(storyId);
      AlertToast(
        res?.message || "تم اعتماد رسم الشخصية بنجاح وبدأ رسم صفحات الكتاب، وسنرسل لك بريداً إلكترونياً فور اكتماله.",
        "SUCCESS"
      );
      await fetchDetail();
      onStatusUpdated?.();
    } catch (err) {
      AlertToast(err?.message || "تعذر اعتماد مظهر البطل حالياً", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  };

  // Regenerate Character
  const handleRegenerateCharacter = async () => {
    setActionInProgress(true);
    try {
      const res = await storyBooksService.regenerateCharacter(storyId);
      AlertToast(res?.message || "جاري إعادة رسم لوحة الشخصية بمظهر جديد.", "SUCCESS");
      await fetchDetail();
      onStatusUpdated?.();
    } catch (err) {
      AlertToast(err?.message || "تعذر إعادة توليد مظهر البطل", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  };

  // Resume Failed Pipeline
  const handleResume = async () => {
    setActionInProgress(true);
    try {
      await storyBooksService.resumeStoryBook(storyId);
      AlertToast("تم استئناف عملية إنشاء القصة بنجاح", "SUCCESS");
      await fetchDetail();
      onStatusUpdated?.();
    } catch {
      AlertToast("تعذر استئناف العملية، يرجى المحاولة لاحقاً", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  };

  // Cancel Story (asks the parent to show a confirmation modal first)
  const handleCancel = () => {
    onRequestCancel?.(activeData);
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await storyBooksService.getStoryBookDownloadUrl(storyId);
      if (res?.success && res.url) {
        window.open(res.url, "_blank");
        AlertToast("تم فتح رابط تحميل نسخة PDF", "SUCCESS");
      } else {
        AlertToast("ملف الـ PDF غير جاهز للتحميل بعد", "WARNING");
      }
    } catch {
      AlertToast("تعذر تحميل ملف الـ PDF حالياً", "ERROR");
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (!story && !detail) return null;

  const title = activeData?.titleAr || activeData?.title || "قصة مخصصة";
  const childName = activeData?.childNameAr || activeData?.childName || "";
  const pageCount = activeData?.pageCount || activeData?.pages?.length || 0;
  const varietyLabel =
    LANGUAGE_VARIETIES.find((v) => v.value === activeData?.variety)?.label || activeData?.variety || "العربية الفصحى";
  const tashkeelLabel =
    TASHKEEL_LEVELS.find((t) => t.value === activeData?.tashkeelLevel)?.label || activeData?.tashkeelLevel;
  const tashkeelShortLabel =
    activeData?.tashkeelLevel === "FULL"
      ? "تشكيل كامل"
      : activeData?.tashkeelLevel === "PARTIAL"
      ? "تشكيل جزئي"
      : activeData?.tashkeelLevel === "NONE"
      ? "بدون تشكيل"
      : tashkeelLabel || "تشكيل كامل";

  const pages = detail?.pages || [];
  const coverUrl =
    pages?.find((p) => p.pageIndex === 0 || p.kind === "COVER")?.imageUrl ||
    detail?.coverImageUrl ||
    detail?.coverUrl ||
    activeData?.coverImageUrl ||
    activeData?.coverUrl ||
    activeData?.cover;

  const displayPages = pages.length > 0 ? [...pages].sort((a, b) => (a.pageIndex ?? 0) - (b.pageIndex ?? 0)) : [];
  const storyPagesCount = displayPages.filter((p) => p.kind === "STORY" || (p.pageIndex > 0 && p.textAr)).length || pageCount;

  // Editorial action footer
  const footer = (
    <div className="child-story-drawer__footer" dir="rtl">
      {(status === "READY" || status === "COMPLETED") && (
        <div className="child-story-drawer__footer-stack">
          <button
            type="button"
            className="child-story-drawer__btn-primary"
            onClick={() => onStartReading?.(activeData)}
          >
            <BookOpen size={16} strokeWidth={2.4} />
            <span>ابدأ القراءة التفاعلية</span>
          </button>
          <button
            type="button"
            className="child-story-drawer__btn-secondary"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            title="تحميل نسخة PDF"
          >
            {downloadingPdf ? <Loader2 size={16} className="child-story-drawer__spinner" /> : <FileDown size={16} />}
            <span>{downloadingPdf ? "جاري التجهيز..." : "تحميل PDF"}</span>
          </button>
        </div>
      )}

      {status === "STORY_READY" && (
        <div className="child-story-drawer__footer-stack">
          {isStoryApproved ? (
            <>
              <div className="child-story-drawer__status-pill-generating">
                <Loader2 size={16} className="child-story-drawer__spinner" />
                <span>تم اعتماد نص القصة بنجاح! جاري رسم مظهر البطل...</span>
              </div>
              <button
                type="button"
                className="child-story-drawer__btn-secondary child-story-drawer__btn-secondary--danger"
                onClick={handleCancel}
                disabled={actionInProgress}
                title="إلغاء القصة"
              >
                <Ban size={14} />
                <span>إلغاء القصة</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="child-story-drawer__btn-primary child-story-drawer__btn-primary--approve"
                onClick={handleApproveStory}
                disabled={actionInProgress}
              >
                {actionInProgress ? (
                  <Loader2 size={16} className="child-story-drawer__spinner" />
                ) : (
                  <CheckCircle2 size={17} strokeWidth={2.4} />
                )}
                <span>اعتماد نص الحكاية والبدء بالرسم</span>
              </button>
              <button
                type="button"
                className="child-story-drawer__btn-secondary child-story-drawer__btn-secondary--danger"
                onClick={handleCancel}
                disabled={actionInProgress}
                title="إلغاء القصة"
              >
                <Ban size={14} />
                <span>إلغاء القصة</span>
              </button>
            </>
          )}
        </div>
      )}

      {status === "CHARACTER_READY" && (
        <div className="child-story-drawer__footer-stack">
          <button
            type="button"
            className="child-story-drawer__btn-primary"
            onClick={handleApproveCharacter}
            disabled={actionInProgress}
          >
            {actionInProgress ? <Loader2 size={16} className="child-story-drawer__spinner" /> : <CheckCircle2 size={16} />}
            <span>اعتماد مظهر البطل</span>
          </button>
          {(detail?.lookRegenerationsLeft ?? 1) > 0 && (
            <button
              type="button"
              className="child-story-drawer__btn-secondary"
              onClick={handleRegenerateCharacter}
              disabled={actionInProgress}
            >
              <RefreshCw size={14} />
              <span>إعادة توليد ({detail?.lookRegenerationsLeft} متبقية)</span>
            </button>
          )}
        </div>
      )}

      {status === "FAILED" && (
        <div className="child-story-drawer__footer-stack">
          <button
            type="button"
            className="child-story-drawer__btn-primary"
            onClick={handleResume}
            disabled={actionInProgress}
          >
            {actionInProgress ? <Loader2 size={16} className="child-story-drawer__spinner" /> : <RefreshCw size={16} />}
            <span>إعادة المحاولة والاستئناف</span>
          </button>
        </div>
      )}

      {["DRAFT", "ILLUSTRATING", "QA", "RENDERING"].includes(status) && (
        <div className="child-story-drawer__footer-stack">
          <button
            type="button"
            className="child-story-drawer__btn-secondary child-story-drawer__btn-secondary--danger"
            onClick={handleCancel}
            disabled={actionInProgress}
          >
            <Ban size={14} />
            <span>إلغاء إنشاء القصة</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DetailsDrawer
        isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={childName ? `بطل الحكاية: ${childName}` : "تفاصيل الحكاية"}
      footer={footer}
      width="520px"
      className="child-story-details-drawer"
    >
      <div className="child-story-drawer__content" dir="rtl">
        {/* ===================================================================
            SECTION 1: مراقبة الإنتاج وخط الأنابيب (Pipeline Progress on TOP)
            =================================================================== */}
        {status !== "FAILED" && status !== "CANCELLED" && (
          <section className="child-story-drawer__section child-story-drawer__section--pipeline">
            <div className="child-story-drawer__section-header">
              <div className="child-story-drawer__section-header-title">
                <Layers size={16} />
                <h4>مراحل إعداد القصة</h4>
              </div>
            </div>

            <div className="child-story-drawer__pipeline-card">
              <div className="child-story-drawer__pipeline-meta-row">
                <div
                  className="child-story-drawer__badge-status-inline"
                  style={{
                    color: statusConfig.color || "#0f172a",
                    backgroundColor: statusConfig.bg || "#ffffff",
                    borderColor: statusConfig.border || statusConfig.color || "#0f172a",
                  }}
                >
                  <span>{statusConfig.label}</span>
                </div>
                <span className="child-story-drawer__section-percent">{getProgressPercent(status, isStoryApproved)}%</span>
              </div>

              {(detail?.statusMessage || statusConfig.description) && (
                <p
                  className="child-story-drawer__status-desc"
                  style={{ fontSize: "0.85rem", color: "#475569", margin: "4px 0 10px", lineHeight: "1.5" }}
                >
                  {detail?.statusMessage || statusConfig.description}
                </p>
              )}

              <div className="child-story-drawer__pipeline-track">
                <div
                  className={`child-story-drawer__pipeline-bar ${["DRAFT", "ILLUSTRATING", "QA", "RENDERING"].includes(status) || isWaitingForCharacter ? "child-story-drawer__pipeline-bar--animated" : ""}`}
                  style={{ width: `${getProgressPercent(status, isStoryApproved)}%` }}
                />
              </div>

              <div className="child-story-drawer__pipeline-steps">
                {PIPELINE_STAGES.map((stg) => {
                  const state = getStageState(stg.id, status, isStoryApproved);
                  const isCurrentGenerating =
                    (state === "current" && ["DRAFT", "ILLUSTRATING", "QA", "RENDERING"].includes(status)) ||
                    (stg.id === "CHAR" && isWaitingForCharacter);
                  return (
                    <div
                      key={stg.id}
                      className={`child-story-drawer__pipeline-step child-story-drawer__pipeline-step--${state}`}
                    >
                      <div className="child-story-drawer__pipeline-dot">
                        {state === "done" && <Check size={11} strokeWidth={3} />}
                        {isCurrentGenerating && (
                          <span className="child-story-drawer__dot-loader" />
                        )}
                        {state === "current" && !isCurrentGenerating && <span className="child-story-drawer__dot-inner" />}
                      </div>
                      <span className="child-story-drawer__pipeline-step-label">{stg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {status === "FAILED" && (
          <div className="child-story-drawer__banner child-story-drawer__banner--danger">
            <div className="child-story-drawer__banner-icon-wrap">
              <AlertCircle size={20} className="child-story-drawer__banner-icon" />
            </div>
            <div className="child-story-drawer__banner-body">
              <h5 className="child-story-drawer__banner-title">تعذر إكمال توليد القصة</h5>
              <p className="child-story-drawer__banner-desc">
                {detail?.failureReason || "حدث انقطاع أثناء معالجة القصة. يمكنك النقر على «إعادة المحاولة» للمتابعة."}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================
            SECTION 2: بيانات ومواصفات القصة (Static / Never-changed specs)
            =================================================================== */}
        <section className="child-story-drawer__section child-story-drawer__section--overview">
          <div className="child-story-drawer__section-header">
            <div className="child-story-drawer__section-header-title">
              <BookOpen size={16} />
              <h4>بيانات ومواصفات القصة</h4>
            </div>
            <span className="child-story-drawer__section-tag">معلومات أساسية</span>
          </div>

          <div className="child-story-drawer__specs-grid">
            <div className="child-story-drawer__spec-tile">
              <span className="child-story-drawer__spec-icon"><User size={15} /></span>
              <div className="child-story-drawer__spec-meta">
                <span className="child-story-drawer__spec-label">البطل الصغير</span>
                <span className="child-story-drawer__spec-value">{childName || "مخصص"}</span>
              </div>
            </div>

            <div className="child-story-drawer__spec-tile">
              <span className="child-story-drawer__spec-icon"><Layers size={15} /></span>
              <div className="child-story-drawer__spec-meta">
                <span className="child-story-drawer__spec-label">عدد الصفحات</span>
                <span className="child-story-drawer__spec-value">{pageCount > 0 ? `${pageCount} صفحة` : "—"}</span>
              </div>
            </div>

            <div className="child-story-drawer__spec-tile">
              <span className="child-story-drawer__spec-icon"><MapPin size={15} /></span>
              <div className="child-story-drawer__spec-meta">
                <span className="child-story-drawer__spec-label">المكان والبيئة</span>
                <span className="child-story-drawer__spec-value">
                  {(() => {
                    const settingVal = detail?.setting || detail?.settings;
                    const settingObj = STORY_SETTINGS.find((s) => s.value === settingVal);
                    const settingName = settingObj?.label || settingVal || "";
                    if (detail?.place) {
                      return settingName ? `${settingName} (${detail.place})` : detail.place;
                    }
                    return settingName || "عمّان";
                  })()}
                </span>
              </div>
            </div>

            <div className="child-story-drawer__spec-tile">
              <span className="child-story-drawer__spec-icon"><Compass size={15} /></span>
              <div className="child-story-drawer__spec-meta">
                <span className="child-story-drawer__spec-label">السمة والهدف</span>
                <span className="child-story-drawer__spec-value">{detail?.theme || "الصداقة والتعاون"}</span>
              </div>
            </div>

            <div className="child-story-drawer__spec-tile">
              <span className="child-story-drawer__spec-icon"><Palette size={15} /></span>
              <div className="child-story-drawer__spec-meta">
                <span className="child-story-drawer__spec-label">نبرة الحكاية</span>
                <span className="child-story-drawer__spec-value">{detail?.storyTone || "مغامرة وتشويق"}</span>
              </div>
            </div>

            <div className="child-story-drawer__spec-tile">
              <span className="child-story-drawer__spec-icon"><Languages size={15} /></span>
              <div className="child-story-drawer__spec-meta">
                <span className="child-story-drawer__spec-label">اللغة واللهجة</span>
                <span className="child-story-drawer__spec-value">{varietyLabel || "العربية الفصحى"}</span>
              </div>
            </div>

            <div className="child-story-drawer__spec-tile">
              <span className="child-story-drawer__spec-icon"><Type size={15} /></span>
              <div className="child-story-drawer__spec-meta">
                <span className="child-story-drawer__spec-label">مستوى التشكيل</span>
                <span className="child-story-drawer__spec-value" title={tashkeelLabel}>{tashkeelShortLabel}</span>
              </div>
            </div>
          </div>

          {((Array.isArray(detail?.interests) && detail.interests.length > 0) || (Array.isArray(activeData?.interests) && activeData.interests.length > 0)) && (
            <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#64748b" }}>اهتمامات الطفل:</span>
              {(detail?.interests || activeData?.interests || []).map((code) => {
                const interestObj = INTERESTS.find((i) => i.value === code);
                const label = interestObj ? interestObj.label : code;
                return (
                  <span
                    key={code}
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: "600",
                      padding: "2px 7px",
                      borderRadius: "9999px",
                      backgroundColor: "var(--bg-secondary, #f8fafc)",
                      color: "var(--brand-black, #0f172a)",
                      border: "1px solid var(--border-subtle, #e2e8f0)",
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          {detail?.dedication && (
            <div className="child-story-drawer__info-dedication">
              <span className="child-story-drawer__dedication-title">إهداء القصة:</span>
              <p className="child-story-drawer__dedication-text">«{detail.dedication}»</p>
            </div>
          )}
        </section>

        {/* ===================================================================
            SECTION 3: اعتماد مظهر البطل (Only visible during Character Review)
            =================================================================== */}
        {status === "CHARACTER_READY" && detail?.characterSheetUrl && (
          <section className="child-story-drawer__section child-story-drawer__section--character">
            <div className="child-story-drawer__section-header">
              <div className="child-story-drawer__section-header-title">
                <Palette size={16} />
                <h4>مظهر البطل المقترح</h4>
              </div>
              <span className="child-story-drawer__section-tag child-story-drawer__section-tag--info">
                بانتظار اعتمادك
              </span>
            </div>
            <div className="child-story-drawer__char-sheet-box">
              <PageCardImage
                src={detail.characterSheetUrl}
                alt="مظهر البطل المقترح"
                onPreview={setPreviewImage}
              />
            </div>
          </section>
        )}

        {/* ===================================================================
            SECTION 4: فصول الحكاية والرسومات (Each Image in its Page Text)
            =================================================================== */}
        <section className="child-story-drawer__section child-story-drawer__section--pages">
          <div className="child-story-drawer__section-header">
            <div className="child-story-drawer__section-header-title">
              <BookOpen size={16} />
              <h4>
                {status === "STORY_READY"
                  ? (isStoryApproved ? `فصول الحكاية المعتمدة (${storyPagesCount})` : "مراجعة وتعديل فصول الحكاية")
                  : `فصول الحكاية (${storyPagesCount})`}
              </h4>
            </div>
            {canEditPages && (
              <span className="child-story-drawer__edit-hint-badge">
                <Pencil size={11} />
                <span>انقر على أي صفحة لتعديل نصها</span>
              </span>
            )}
            {status === "STORY_READY" && !isStoryApproved && !canEditPages && (
              <span className="child-story-drawer__section-tag child-story-drawer__section-tag--warning">
                بانتظار اعتمادك
              </span>
            )}
            {isWaitingForCharacter && (
              <span className="child-story-drawer__section-tag child-story-drawer__section-tag--info">
                معتمد للرسم
              </span>
            )}
            {status === "READY" && (
              <span className="child-story-drawer__section-tag child-story-drawer__section-tag--success">
                مكتمل ومصور
              </span>
            )}
          </div>

          {(loading && !detail) ? (
            <div className="child-story-drawer__skeleton-list">
              {[1, 2, 3].map((s) => (
                <div key={s} className="child-story-drawer__skeleton-card">
                  <div className="child-story-drawer__skeleton-badge" />
                  <div className="child-story-drawer__skeleton-line child-story-drawer__skeleton-line--full" />
                  <div className="child-story-drawer__skeleton-line child-story-drawer__skeleton-line--short" />
                </div>
              ))}
            </div>
          ) : status === "DRAFT" && displayPages.length === 0 ? (
            <div className="child-story-drawer__draft-processing-box">
              <div className="child-story-drawer__draft-processing-header">
                <Loader2 size={18} className="child-story-drawer__spinner" />
                <div>
                  <h5>جاري صياغة وتدقيق فصول القصة...</h5>
                  <p>
                    يقوم النظام الآن بمراجعة التراكيب اللغوية، وضبط التشكيل، وملاءمة المفردات لعمر الطفل.
                    سيصبح النص متاحاً للاعتماد والتعديل فور اكتمال هذه المراجعة التلقائية.
                  </p>
                </div>
              </div>
            </div>
          ) : fetchError && !detail ? (
            <div className="child-story-drawer__error-box">
              <p>تعذر تحميل نص الحكاية من الخادم</p>
              <button
                type="button"
                className="child-story-drawer__retry-btn"
                onClick={() => {
                  setLoading(true);
                  fetchDetail().finally(() => setLoading(false));
                }}
              >
                <RefreshCw size={14} />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          ) : displayPages.length > 0 ? (
            <div className="child-story-drawer__story-cards-list">
              {displayPages.map((p, idx) => {
                const isCover = p.kind === "COVER" || p.pageIndex === 0;
                const pageKey = isCover ? 0 : (Number.isInteger(p.pageIndex) ? p.pageIndex : idx + 1);
                const pageTitle = isCover ? "غلاف القصة" : `الصفحة ${p.pageIndex ?? idx + 1}`;
                const imgUrl = p.imageUrl || (isCover ? coverUrl : null);
                const isGeneratingImg = !imgUrl && ["ILLUSTRATING", "QA", "RENDERING"].includes(status);
                const pageText = p.textAr || (isCover && title !== "قصة مخصصة" ? title : null);
                const isTopText = p.textZone === "TOP";
                const isEditing = editingPageIndex === pageKey;
                const currentLimit = isCover ? MAX_TITLE_CHARS : MAX_PAGE_CHARS;

                const renderPageTextBlock = (positionClass) => {
                  if (isEditing) {
                    return (
                      <div
                        className={`child-story-drawer__story-editor-wrap child-story-drawer__story-card-body--${positionClass}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <textarea
                          className="child-story-drawer__story-editor-textarea"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          maxLength={currentLimit}
                          rows={3}
                          dir="rtl"
                          placeholder={isCover ? "اكتب عنوان القصة هنا..." : "اكتب نص الصفحة هنا..."}
                          autoFocus
                        />
                        <div className="child-story-drawer__story-editor-footer">
                          <span
                            className={`child-story-drawer__char-counter ${
                              editingText.length >= currentLimit ? "child-story-drawer__char-counter--limit" : ""
                            }`}
                          >
                            {editingText.length} / {currentLimit} حرف
                          </span>
                          <div className="child-story-drawer__story-editor-actions">
                            <button
                              type="button"
                              className="child-story-drawer__btn-save-edit"
                              onClick={() => handleSaveEditPage(pageKey)}
                              disabled={savingPage || !editingText.trim()}
                              title="حفظ التعديل"
                            >
                              {savingPage ? <Loader2 size={13} className="child-story-drawer__spinner" /> : <Check size={13} />}
                              <span>حفظ</span>
                            </button>
                            <button
                              type="button"
                              className="child-story-drawer__btn-cancel-edit"
                              onClick={handleCancelEditPage}
                              disabled={savingPage}
                              title="إلغاء التعديل"
                            >
                              <X size={13} />
                              <span>إلغاء</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (!pageText && !canEditPages) return null;

                  return (
                    <div
                      className={`child-story-drawer__story-card-body child-story-drawer__story-card-body--${positionClass} ${
                        canEditPages ? "child-story-drawer__story-card-body--clickable" : ""
                      }`}
                      onClick={() => {
                        if (canEditPages) {
                          handleStartEditPage(pageKey, pageText);
                        }
                      }}
                      title={canEditPages ? "انقر لتعديل نص الصفحة" : undefined}
                    >
                      <p className="child-story-drawer__story-text" dir="rtl">
                        {pageText || (canEditPages ? "انقر لإضافة نص لهذه الصفحة..." : "")}
                      </p>
                      {canEditPages && (
                        <span className="child-story-drawer__click-to-edit-hint">
                          <Pencil size={11} /> انقر للتعديل (الحد: {currentLimit} حرف)
                        </span>
                      )}
                    </div>
                  );
                };

                return (
                  <div
                    key={pageKey}
                    className={`child-story-drawer__story-card ${isCover ? "child-story-drawer__story-card--cover" : ""} ${
                      canEditPages ? "child-story-drawer__story-card--editable" : ""
                    }`}
                  >
                    <div className="child-story-drawer__story-card-header">
                      <span className={`child-story-drawer__story-page-pill ${isCover ? "child-story-drawer__story-page-pill--cover" : ""}`}>
                        {pageTitle}
                      </span>

                      {/* Edit button: only visible during STORY_READY step before submission */}
                      {canEditPages && !isEditing && (
                        <button
                          type="button"
                          className="child-story-drawer__btn-edit-page"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditPage(pageKey, pageText);
                          }}
                          title={isCover ? "تعديل عنوان القصة" : "تعديل نص هذه الصفحة"}
                        >
                          <Pencil size={11} />
                          <span>{isCover ? "تعديل العنوان" : "تعديل النص"}</span>
                        </button>
                      )}

                      {imgUrl ? (
                        <>
                          <span className="child-story-drawer__story-illus-badge">
                            تم تجهيز الرسمة ✓
                          </span>
                          {canRegeneratePages && (
                            <button
                              type="button"
                              className="child-story-drawer__btn-mini-regen"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRegeneratePage(pageKey);
                              }}
                              disabled={actionInProgress}
                              title={isCover ? "إعادة رسم غلاف القصة" : "إعادة رسم هذه الصفحة"}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "2px 8px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                color: "#0f172a",
                                backgroundColor: "#f1f5f9",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                cursor: "pointer",
                                marginRight: "auto",
                              }}
                            >
                              <RefreshCw size={11} className={actionInProgress ? "child-story-drawer__spinner" : ""} />
                              <span>
                                {isCover ? "إعادة رسم الغلاف" : "إعادة رسم"}
                                {typeof detail?.pageRegenerationsLeft === "number" ? ` (${detail.pageRegenerationsLeft})` : ""}
                              </span>
                            </button>
                          )}
                        </>
                      ) : isGeneratingImg ? (
                        <span className="child-story-drawer__story-illus-generating-badge">
                          <Loader2 size={12} className="child-story-drawer__spinner" />
                          جاري الرسم...
                        </span>
                      ) : null}
                    </div>

                    {/* If textZone is TOP, render text above image */}
                    {isTopText && renderPageTextBlock("top")}

                    {/* Page Image: Loaded in its page card */}
                    {imgUrl ? (
                      <PageCardImage
                        src={imgUrl}
                        alt={isCover ? `غلاف: ${title}` : `مشهد الصفحة ${p.pageIndex ?? idx + 1}`}
                        isCover={isCover}
                        onPreview={setPreviewImage}
                      />
                    ) : isGeneratingImg ? (
                      <div className="child-story-drawer__story-card-img-wrap child-story-drawer__story-card-img-wrap--generating">
                        <div className="child-story-drawer__page-img-generating">
                          <Loader2 size={20} className="child-story-drawer__spinner" />
                          <span>جاري رسم وتجهيز هذا المشهد...</span>
                        </div>
                      </div>
                    ) : null}

                    {/* If textZone is not TOP (e.g. BOTTOM or default), render text below image */}
                    {!isTopText && renderPageTextBlock("bottom")}
                  </div>
                );
              })}
            </div>
          ) : coverUrl ? (
            <div className="child-story-drawer__story-cards-list">
              <div className="child-story-drawer__story-card child-story-drawer__story-card--cover">
                <div className="child-story-drawer__story-card-header">
                  <span className="child-story-drawer__story-page-pill child-story-drawer__story-page-pill--cover">
                    غلاف القصة
                  </span>
                  <span className="child-story-drawer__story-illus-badge">
                    تم تجهيز الرسمة ✓
                  </span>
                  {canRegeneratePages && (
                    <button
                      type="button"
                      className="child-story-drawer__btn-mini-regen"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegeneratePage(0);
                      }}
                      disabled={actionInProgress}
                      title="إعادة رسم غلاف القصة"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#0f172a",
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginRight: "auto",
                      }}
                    >
                      <RefreshCw size={11} className={actionInProgress ? "child-story-drawer__spinner" : ""} />
                      <span>
                        إعادة رسم الغلاف
                        {typeof detail?.pageRegenerationsLeft === "number" ? ` (${detail.pageRegenerationsLeft})` : ""}
                      </span>
                    </button>
                  )}
                </div>
                <PageCardImage
                  src={coverUrl}
                  alt={title || "غلاف القصة"}
                  isCover={true}
                  onPreview={setPreviewImage}
                />
              </div>
            </div>
          ) : (
            <div className="child-story-drawer__empty-pages">
              <p>
                {status === "DRAFT"
                  ? "جاري إعداد وصياغة فصول الحكاية... يرجى الانتظار"
                  : "لا توجد فصول للعرض حالياً."}
              </p>
            </div>
          )}
        </section>
      </div>
    </DetailsDrawer>

    {/* Full-Screen Image Lightbox Modal */}
    <StoryImageLightbox
      image={previewImage}
      onClose={() => setPreviewImage(null)}
    />
  </>
  );
});

export default StoryBookDetailsDrawer;
