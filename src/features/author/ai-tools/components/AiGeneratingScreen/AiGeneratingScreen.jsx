import React from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { useAiGeneratingScreen } from "./useAiGeneratingScreen";
import "./AiGeneratingScreen.css";

/**
 * Presentation view showing live AI progress, cycling thinking phases,
 * and high-precision animated progress bar.
 */
export function AiGeneratingScreen() {
  const { progress, currentPhrase, steps } = useAiGeneratingScreen();

  return (
    <div
      className="ktab-ai-generating"
      role="status"
      aria-live="polite"
      aria-label="جاري التحليل والتوليد بالذكاء الاصطناعي"
    >
      {/* Animated Glowing Beacon */}
      <div className="ktab-ai-generating__beacon">
        <div className="ktab-ai-generating__icon-box">
          <Sparkles size={28} strokeWidth={2} />
        </div>
        <div className="ktab-ai-generating__glow-ring" aria-hidden="true" />
      </div>

      {/* Title & Dynamic Thinking Indicator */}
      <div className="ktab-ai-generating__text-group">
        <h4 className="ktab-ai-generating__title">جاري تحليل مسودة الكتاب وصياغة الخاتمة</h4>
        <div className="ktab-ai-generating__thinking-box">
          <span className="ktab-ai-generating__thinking-pulse" aria-hidden="true" />
          <p className="ktab-ai-generating__desc">{currentPhrase}</p>
        </div>
      </div>

      {/* Progress Bar & Percentage Metric */}
      <div className="ktab-ai-generating__progress-card">
        <div className="ktab-ai-generating__progress-meta">
          <span className="ktab-ai-generating__progress-label">تقدم المعالجة</span>
          <span className="ktab-ai-generating__progress-val">{progress}%</span>
        </div>
        <div className="ktab-ai-generating__track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="ktab-ai-generating__bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dynamic Multi-Step Phase Checklist */}
      <div className="ktab-ai-generating__steps">
        {steps.map((step, index) => {
          const isCompleted = progress >= step.threshold;
          const prevThreshold = index > 0 ? steps[index - 1].threshold : 0;
          const isActive = !isCompleted && progress >= prevThreshold;

          let stepClass = "ktab-ai-generating__step";
          if (isCompleted) {
            stepClass += " ktab-ai-generating__step--completed";
          } else if (isActive) {
            stepClass += " ktab-ai-generating__step--active";
          }

          return (
            <div key={step.id} className={stepClass}>
              <div className="ktab-ai-generating__step-icon">
                {isCompleted ? (
                  <Check size={12} strokeWidth={3} />
                ) : isActive ? (
                  <Loader2 size={12} className="ktab-step-spin" />
                ) : (
                  <span className="ktab-ai-generating__step-dot" />
                )}
              </div>
              <span className="ktab-ai-generating__step-text">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AiGeneratingScreen;
