import React from "react";
import { Check } from "lucide-react";
import "./StoryStepper.css";

const STEPS = [
  { id: 1, label: "الهوية والغلاف", desc: "العنوان والتصنيف" },
  { id: 2, label: "دستور العالم", desc: "قوانين وأركان القصة الـ 8" },
  { id: 3, label: "المنظور والإطلاق", desc: "النمط البصري والمراجعة" },
];

/**
 * Editorial Apple-inspired Multi-Step Progress Stepper.
 * Pure presentational component highlighting active, completed, and upcoming stages.
 */
export function StoryStepper({ currentStep = 1, onStepClick }) {
  return (
    <nav className="story-stepper" aria-label="مراحل إنشاء القصة">
      <div className="story-stepper__track">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isClickable = step.id <= currentStep;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div
                  className={`story-stepper__line ${
                    currentStep >= step.id ? "story-stepper__line--filled" : ""
                  }`}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                data-step={step.id}
                onClick={onStepClick}
                disabled={!isClickable}
                className={`story-stepper__item ${
                  isActive ? "story-stepper__item--active" : ""
                } ${isCompleted ? "story-stepper__item--completed" : ""}`}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="story-stepper__circle">
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="story-stepper__meta">
                  <span className="story-stepper__label">{step.label}</span>
                  <span className="story-stepper__desc">{step.desc}</span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

export default StoryStepper;
