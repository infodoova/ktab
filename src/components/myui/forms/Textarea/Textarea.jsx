import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import "./Textarea.css";

/**
 * Editorial Apple Inset Floating Label Textarea Component.
 * - Idle: label sits at top-right inside the multiline box.
 * - Focused or Has Content: label glides into mini header position inside the container.
 * - Retains subtle background depth, crisp focus ring, and character counter.
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
    rows = 4,
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
  const localTextareaRef = useRef(null);

  useImperativeHandle(ref, () => localTextareaRef.current);

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
      className={`myui-textarea-wrap ${label ? "has-label" : ""} ${
        error ? "has-error" : ""
      } ${isFocused ? "is-focused" : ""} ${className}`}
      dir="rtl"
    >
      <div
        className={`myui-textarea-field-wrap ${disabled ? "is-disabled" : ""}`}
        onClick={() => localTextareaRef.current?.focus()}
      >
        {label && (
          <div className="myui-textarea-header">
            <label htmlFor={inputId} className="myui-textarea-header-label">
              <span className="myui-textarea-label-text">{label}</span>
              {required ? (
                <span className="myui-textarea-required">*</span>
              ) : (
                <span className="myui-textarea-optional">(اختياري)</span>
              )}
            </label>
            {labelExtra && <span className="myui-textarea-extra">{labelExtra}</span>}
          </div>
        )}

        <textarea
          ref={localTextareaRef}
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
          placeholder={placeholder}
          className={`myui-textarea ${error ? "has-error" : ""} ${textareaClassName}`}
          {...props}
        />
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
            {currentLength} / {maxLength} حرف
          </span>
        )}
      </div>
    </div>
  );
}

export const Textarea = forwardRef(TextareaComponent);
export default Textarea;
