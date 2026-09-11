import React, { forwardRef } from "react";
import "./Textarea.css";

/**
 * Editorial Apple / Eleven Reader Textarea Component
 */
export function TextareaComponent(
  {
    label,
    error,
    helperText,
    required = false,
    className = "",
    textareaClassName = "",
    disabled = false,
    id,
    rows = 4,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `textarea-${label.replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={`myui-textarea-wrap ${className}`} dir="rtl">
      {label && (
        <label htmlFor={inputId} className="myui-textarea-label">
          <span>{label}</span>
          {required && <span className="myui-textarea-required">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`myui-textarea ${error ? "has-error" : ""} ${textareaClassName}`}
        {...props}
      />

      {error ? (
        <p className="myui-textarea-error">{error}</p>
      ) : helperText ? (
        <p className="myui-textarea-helper">{helperText}</p>
      ) : null}
    </div>
  );
}

export const Textarea = forwardRef(TextareaComponent);
export default Textarea;
