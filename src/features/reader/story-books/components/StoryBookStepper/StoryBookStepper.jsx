import React from "react";
import { Check } from "lucide-react";
import "./StoryBookStepper.css";

const STEPS = [
  { id: 1, label: "هوية الحكاية", desc: "العنوان والبطل الصغير" },
  { id: 2, label: "عالم المغامرة", desc: "البيئة والنمط البصري" },
  { id: 3, label: "القرارات التفاعلية", desc: "المشهد الأول والخيارات" },
  { id: 4, label: "المعاينة والإطلاق", desc: "المراجعة وحفظ القصة" },
];

/**
 * Editorial Apple-inspired Multi-Step Progress Stepper for Children Story Creation.
 */
export function StoryBookStepper({ currentStep = 1, onStepClick }) {
  return (
    <nav className="child-stepper" aria-label="مراحل ابتكار القصة">
      <div className="child-stepper__track">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isClickable = step.id <= currentStep;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div
                  className={`child-stepper__line ${
                    currentStep >= step.id ? "child-stepper__line--filled" : ""
                  }`}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                data-step={step.id}
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`child-stepper__item ${
                  isActive ? "child-stepper__item--active" : ""
                } ${isCompleted ? "child-stepper__item--completed" : ""}`}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="child-stepper__circle">
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="child-stepper__meta">
                  <span className="child-stepper__label">{step.label}</span>
                  <span className="child-stepper__desc">{step.desc}</span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

export default StoryBookStepper;
