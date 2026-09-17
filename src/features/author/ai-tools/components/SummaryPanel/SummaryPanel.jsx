import React from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { AiGeneratingScreen } from "../AiGeneratingScreen";
import { useSummaryPanel } from "./useSummaryPanel";
import "./SummaryPanel.css";

/**
 * Pure presentation panel rendering AI-generated book endings,
 * with copy actions and state transitions.
 */
export function SummaryPanel({ loading = false, summary = "" }) {
  const { copied, handleCopy } = useSummaryPanel({ summary });

  return (
    <section
      className="ktab-summary-panel"
      dir="rtl"
      aria-label="نتائج التوليد والتحليل"
    >
      {/* Header */}
      <div className="ktab-summary-panel__header">
        <div className="ktab-summary-panel__title-meta">
          <div className="ktab-summary-panel__icon-badge" aria-hidden="true">
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <div className="ktab-summary-panel__titles">
            <h3 className="ktab-summary-panel__title">الخاتمة المقترحة</h3>
            <span className="ktab-summary-panel__subtitle">
              صياغة ذكية مستخلصة من أحداث الكتاب
            </span>
          </div>
        </div>

        {summary && !loading && (
          <button
            type="button"
            onClick={handleCopy}
            className={`ktab-summary-panel__copy-btn ${
              copied ? "ktab-summary-panel__copy-btn--copied" : ""
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
        )}
      </div>

      {/* Body */}
      <div className="ktab-summary-panel__body">
        {loading ? (
          <AiGeneratingScreen />
        ) : summary ? (
          <div className="ktab-summary-panel__result-box" tabIndex={0}>
            {summary}
          </div>
        ) : (
          <div className="ktab-summary-panel__empty">
            <div className="ktab-summary-panel__empty-icon" aria-hidden="true">
              <Sparkles size={26} strokeWidth={1.8} />
            </div>
            <h4 className="ktab-summary-panel__empty-title">بانتظار توليد الخاتمة</h4>
            <p className="ktab-summary-panel__empty-desc">
              قم برفع ملف الكتاب من النموذج الجانبي واضغط على زر التوليد لصياغة
              الخاتمة المقترحة وتحليل الأحداث هنا.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SummaryPanel;
