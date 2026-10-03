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
  Sparkles,
  Palette,
} from "lucide-react";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { storyBooksService } from "../../services/storyBooksService";
import {
  getStoryStatusConfig,
  LANGUAGE_VARIETIES,
  TASHKEEL_LEVELS,
} from "../../constants/storyBooksConstants";
import { AlertToast } from "@/components/myui/AlertToast";
import "./StoryBookDetailsDrawer.css";

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
    case "READY": return 100;
    default: return 10;
  }
};

/**
 * PageCardImage with inline loader and graceful fade-in
 */
const PageCardImage = memo(function PageCardImage({ src, alt, isCover = false }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  if (!src) return null;

  return (
    <div
      className={`child-story-drawer__story-card-img-wrap ${
        isCover ? "child-story-drawer__story-card-img-wrap--cover" : ""
      }`}
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
      )}
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

  // Approve Story
  const handleApproveStory = async () => {
    setActionInProgress(true);
    try {
      await storyBooksService.approveStory(storyId);
      AlertToast("تم اعتماد نص القصة بنجاح، جاري بدء التوليد البصري", "SUCCESS");
      await fetchDetail();
      onStatusUpdated?.();
    } catch {
      AlertToast("تعذر اعتماد نص القصة حالياً", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  };

  // Regenerate Story Text
  const handleRegenerateStory = async () => {
    setActionInProgress(true);
    try {
      await storyBooksService.regenerateStory(storyId);
      AlertToast("تم طلب إعادة تأليف نص جديد للقصة...", "SUCCESS");
      await fetchDetail();
      onStatusUpdated?.();
    } catch {
      AlertToast("تعذر إعادة تأليف القصة حالياً، يرجى المحاولة لاحقاً", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  };

  // Approve Character
  const handleApproveCharacter = async () => {
    setActionInProgress(true);
    try {
      await storyBooksService.approveCharacter(storyId);
      AlertToast("تم اعتماد مظهر البطل، جاري رسم صفحات القصة", "SUCCESS");
      await fetchDetail();
      onStatusUpdated?.();
    } catch {
      AlertToast("تعذر اعتماد مظهر البطل حالياً", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  };

  // Regenerate Character
  const handleRegenerateCharacter = async () => {
    setActionInProgress(true);
    try {
      await storyBooksService.regenerateCharacter(storyId);
      AlertToast("تم طلب إعادة توليد مظهر البطل بنجاح", "SUCCESS");
      await fetchDetail();
      onStatusUpdated?.();
    } catch {
      AlertToast("تعذر إعادة توليد مظهر البطل", "ERROR");
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
  const coverUrl = pages?.find((p) => p.pageIndex === 0 || p.kind === "COVER")?.imageUrl || activeData?.coverUrl || activeData?.cover;

  const displayPages = pages.length > 0 ? [...pages].sort((a, b) => (a.pageIndex ?? 0) - (b.pageIndex ?? 0)) : [];
  const storyPagesCount = displayPages.filter((p) => p.kind === "STORY" || (p.pageIndex > 0 && p.textAr)).length || pageCount;

  // Editorial action footer
  const footer = (
    <div className="child-story-drawer__footer" dir="rtl">
      {status === "READY" && (
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
              <div className="child-story-drawer__footer-sub-row">
                <button
                  type="button"
                  className="child-story-drawer__btn-secondary"
                  onClick={handleRegenerateStory}
                  disabled={actionInProgress}
                  title="توليد مسودة نصية جديدة"
                >
                  <RefreshCw size={14} />
                  <span>إعادة تأليف نص آخر</span>
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
              </div>
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
                  <span
                    className={`child-story-drawer__status-dot ${["DRAFT", "ILLUSTRATING", "QA", "RENDERING"].includes(status) || isWaitingForCharacter ? "child-story-drawer__status-dot--pulsing" : ""}`}
                    style={{ backgroundColor: statusConfig.color || "#0f172a" }}
                  />
                  <span>{statusConfig.label}</span>
                </div>
                <span className="child-story-drawer__section-percent">{getProgressPercent(status, isStoryApproved)}%</span>
              </div>

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
                alt="مظهر البطل"
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
                  ? (isStoryApproved ? `فصول الحكاية المعتمدة (${storyPagesCount})` : "مراجعة فصول الحكاية")
                  : `فصول الحكاية (${storyPagesCount})`}
              </h4>
            </div>
            {status === "STORY_READY" && !isStoryApproved && (
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
                    سيصبح النص متاحاً للاعتماد فور اكتمال هذه المراجعة التلقائية.
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
                const pageTitle = isCover ? "غلاف القصة" : `الصفحة ${p.pageIndex ?? idx + 1}`;
                const imgUrl = p.imageUrl || (isCover ? coverUrl : null);
                const isGeneratingImg = !imgUrl && ["ILLUSTRATING", "QA", "RENDERING"].includes(status);
                const pageText = p.textAr || (isCover && title !== "قصة مخصصة" ? title : null);
                const isTopText = p.textZone === "TOP";

                return (
                  <div
                    key={p.pageIndex ?? idx}
                    className={`child-story-drawer__story-card ${isCover ? "child-story-drawer__story-card--cover" : ""}`}
                  >
                    <div className="child-story-drawer__story-card-header">
                      <span className={`child-story-drawer__story-page-pill ${isCover ? "child-story-drawer__story-page-pill--cover" : ""}`}>
                        {pageTitle}
                      </span>
                      {imgUrl ? (
                        <span className="child-story-drawer__story-illus-badge">
                          تم تجهيز الرسمة ✓
                        </span>
                      ) : isGeneratingImg ? (
                        <span className="child-story-drawer__story-illus-generating-badge">
                          <Loader2 size={12} className="child-story-drawer__spinner" />
                          جاري الرسم...
                        </span>
                      ) : null}
                    </div>

                    {/* If textZone is TOP, render text above image */}
                    {isTopText && pageText && (
                      <div className="child-story-drawer__story-card-body child-story-drawer__story-card-body--top">
                        <p className="child-story-drawer__story-text" dir="rtl">
                          {pageText}
                        </p>
                      </div>
                    )}

                    {/* Page Image: Loaded in its page card */}
                    {imgUrl ? (
                      <PageCardImage
                        src={imgUrl}
                        alt={isCover ? `غلاف: ${title}` : `مشهد الصفحة ${p.pageIndex ?? idx + 1}`}
                        isCover={isCover}
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
                    {!isTopText && pageText && (
                      <div className="child-story-drawer__story-card-body child-story-drawer__story-card-body--bottom">
                        <p className="child-story-drawer__story-text" dir="rtl">
                          {pageText}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
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
  );
});

export default StoryBookDetailsDrawer;
