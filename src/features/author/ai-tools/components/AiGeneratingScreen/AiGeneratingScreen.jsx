import React from "react";
import { Sparkles } from "lucide-react";
import "./AiGeneratingScreen.css";

/**
 * Pure presentation component showing animated AI generation progress.
 */
export function AiGeneratingScreen() {
  return (
    <div
      className="ktab-ai-generating"
      role="status"
      aria-live="polite"
      aria-label="جاري التحليل والتوليد بالذكاء الاصطناعي"
    >
      <div className="ktab-ai-generating__beacon">
        <div className="ktab-ai-generating__icon-box">
          <Sparkles size={32} strokeWidth={2} />
        </div>
        <div className="ktab-ai-generating__glow-ring" aria-hidden="true" />
      </div>

      <div className="ktab-ai-generating__text-group">
        <h4 className="ktab-ai-generating__title">جاري قراءة وتحليل ملف الكتاب...</h4>
        <p className="ktab-ai-generating__desc">
          يقوم نموذج الذكاء الاصطناعي باستخراج سياق الأحداث وصياغة خاتمة مقترحة
          وفق الأسلوب والفئة المحددة.
        </p>
      </div>
    </div>
  );
}

export default AiGeneratingScreen;
