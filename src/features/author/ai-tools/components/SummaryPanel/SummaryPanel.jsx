import React from "react";
import { Copy, Check, Sparkles, FileText, BookOpen } from "lucide-react";
import { AiGeneratingScreen } from "../AiGeneratingScreen";
import { useSummaryPanel } from "./useSummaryPanel";
import "./SummaryPanel.css";

/**
 * Pure presentation panel rendering AI-generated book endings,
 * with automatic script direction detection, copy actions,
 * and editorial reading metrics.
 */
export function SummaryPanel({
  loading = false,
  summary = "",
  onOpenMobileForm,
}) {
  const {
    copied,
    wordCount,
    textDirection,
    handleCopy,
  } = useSummaryPanel({ summary });

  return (
    <section
      className="ktab-summary-panel"
      dir="rtl"
      aria-label="نتائج التوليد والتحليل"
    >
      {/* Header Toolbar */}
      <div className="ktab-summary-panel__header">
        <div className="ktab-summary-panel__title-meta">
          <div className="ktab-summary-panel__icon-badge" aria-hidden="true">
            <BookOpen size={18} strokeWidth={2} />
          </div>
          <div className="ktab-summary-panel__titles">
            <h3 className="ktab-summary-panel__title">الخاتمة المقترحة</h3>
            <span className="ktab-summary-panel__subtitle">
              صياغة أدبية ذكية مستخلصة من سياق الكتاب
            </span>
          </div>
        </div>

        {/* Action Controls & Metrics */}
        <div className="ktab-summary-panel__actions">
          {summary && !loading && (
            <>
              {/* Word Count Metric */}
              <div className="ktab-summary-panel__metrics">
                <span className="ktab-summary-panel__metric-pill">
                  <FileText size={12} strokeWidth={2} />
                  <span>{wordCount} كلمة</span>
                </span>
              </div>

              {/* Copy Action */}
              <button
                type="button"
                onClick={handleCopy}
                className={`ktab-summary-panel__copy-btn ${copied ? "ktab-summary-panel__copy-btn--copied" : ""
                  }`}
                aria-label="نسخ الخاتمة المقترحة"
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={2} />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="ktab-summary-panel__body">
        {loading ? (
          <AiGeneratingScreen />
        ) : summary ? (
          <div
            className={`ktab-summary-panel__manuscript-paper ktab-summary-paper--${textDirection}`}
            dir={textDirection}
          >
            <div
              className={`ktab-summary-panel__result-box ktab-summary-text--${textDirection}`}
              tabIndex={0}
              dir={textDirection}
            >
              {summary}
            </div>
          </div>
        ) : (
          <div className="ktab-summary-panel__empty-studio">
            <div className="ktab-summary-panel__empty-sheet">
              <div className="ktab-summary-panel__empty-icon-wrap" aria-hidden="true">
                <Sparkles size={24} strokeWidth={2} />
              </div>

              <div className="ktab-summary-panel__empty-text">
                <h4 className="ktab-summary-panel__empty-title">
                  استوديو صياغة النهايات الأدبية
                </h4>
                <p className="ktab-summary-panel__empty-desc">
                  ارفع مسودة الكتاب وحدد الشريحة المستهدفة لبدء
                  تحليل الحبكة وتوليد خاتمة متماسكة متسقة مع شخصيات الرواية وأسلوبك
                  السردي.
                </p>
              </div>

              {/* Mobile Direct Action in Empty State */}
              {onOpenMobileForm && (
                <button
                  type="button"
                  onClick={onOpenMobileForm}
                  className="ktab-summary-panel__empty-mobile-btn"
                >
                  <Sparkles size={16} strokeWidth={2} />
                  <span>فتح إعدادات الرفع والتوليد</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SummaryPanel;
