import React, { forwardRef, useState } from "react";
import "./Textarea.css";

/**
 * Editorial Apple / Eleven Reader Modern Floating Label Textarea Component.
 * Features animated floating label on press/focus, default max limit validation,
 * live character counter, and labelExtra slot.
 */
export function TextareaComponent(
  {
    label,
    labelExtra,
    error,
    helperText,
    required = false,
    className = "",
    textareaClassName = "",
    disabled = false,
    id,
    rows = 3,
    maxLength = 300,
    showCount = true,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value ?? "") : internalValue;
  const currentLength = String(currentValue).length;
  const hasValue = currentLength > 0;
  const isFloating = Boolean(label) && (isFocused || hasValue);

  const inputId = id || (label ? `textarea-${label.replace(/\s+/g, "-")}` : undefined);

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const hasLimit = typeof maxLength === "number" && maxLength > 0;
  const isLimitReached = hasLimit && currentLength >= maxLength;

  return (
    <div
      className={`myui-textarea-wrap ${label ? "myui-textarea-wrap--floating" : ""} ${
        error ? "has-error" : ""
      } ${isFocused ? "is-focused" : ""} ${className}`}
      dir="rtl"
    >
      <div className={`myui-textarea-field-wrap ${label ? "myui-textarea-field-wrap--floating" : ""}`}>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          placeholder={label ? (isFloating ? placeholder : "") : placeholder}
          className={`myui-textarea ${label ? "myui-textarea--floating" : ""} ${
            error ? "has-error" : ""
          } ${textareaClassName}`}
          {...props}
        />

        {label && (
          <label
            htmlFor={inputId}
            className={`myui-textarea-floating-label ${
              isFloating ? "is-floating" : ""
            } ${isFocused ? "is-focused" : ""}`}
          >
            <span>{label}</span>
            {required ? (
              <span className="myui-textarea-required">*</span>
            ) : (
              <span className="myui-textarea-optional">(اختياري)</span>
            )}
            {labelExtra && (
              <span className="myui-textarea-extra-inline">{labelExtra}</span>
            )}
          </label>
        )}
      </div>

      <div className="myui-textarea-footer">
        <div className="myui-textarea-message">
          {error ? (
            <p className="myui-textarea-error">{error}</p>
          ) : helperText ? (
            <p className="myui-textarea-helper">{helperText}</p>
          ) : null}
        </div>

        {showCount && hasLimit && (
          <span
            className={`myui-textarea-char-count ${
              isLimitReached ? "is-limit-reached" : ""
            }`}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export const Textarea = forwardRef(TextareaComponent);
export default Textarea;
