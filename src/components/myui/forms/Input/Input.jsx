import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import "./Input.css";

/**
 * Editorial Apple Inset Floating Label Input Component.
 * - Idle: label sits centered inside the container like a clean placeholder.
 * - Focused or Has Content: label smoothly glides up inside the container with zero border cuts.
 * - Retains subtle background depth, crisp focus ring, and fluid micro-animations.
 */
export function InputComponent(
  {
    label,
    labelExtra,
    error,
    helperText,
    icon,
    iconPosition = "start",
    required = false,
    className = "",
    inputClassName = "",
    disabled = false,
    id,
    type = "text",
    maxLength = 100,
    showCount = true,
    showClear = true,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    onClear,
    placeholder,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [showRaw, setShowRaw] = useState(false);
  const localInputRef = useRef(null);

  useImperativeHandle(ref, () => localInputRef.current);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value ?? "") : internalValue;
  const currentLength = String(currentValue).length;
  const hasValue = currentLength > 0;
  const isFloating = Boolean(label) && (isFocused || hasValue);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (showRaw ? "text" : "password") : type;

  const inputId = id || (label ? `input-${label.replace(/\s+/g, "-")}` : undefined);

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

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isControlled) {
      setInternalValue("");
    }
    const syntheticEvent = {
      target: { name: props.name || "", value: "" },
      currentTarget: { name: props.name || "", value: "" },
    };
    onChange?.(syntheticEvent);
    onClear?.();
    localInputRef.current?.focus();
  };

  const hasLimit = typeof maxLength === "number" && maxLength > 0;
  const isLimitReached = hasLimit && currentLength >= maxLength;

  return (
    <div
      className={`myui-input-wrap ${label ? "has-label" : ""} ${
        error ? "has-error" : ""
      } ${isFocused ? "is-focused" : ""} ${className}`}
      dir="rtl"
    >
      <div
        className={`myui-input-field-wrap ${isFloating ? "is-floating" : ""} ${
          disabled ? "is-disabled" : ""
        }`}
        onClick={() => localInputRef.current?.focus()}
      >
        {icon && iconPosition === "start" && (
          <div className="myui-input-icon myui-input-icon--start">{icon}</div>
        )}

        {label && (
          <label
            htmlFor={inputId}
            className={`myui-input-inset-label ${
              isFloating ? "is-floating" : ""
            } ${isFocused ? "is-focused" : ""}`}
          >
            <span>{label}</span>
            {required ? (
              <span className="myui-input-required">*</span>
            ) : (
              <span className="myui-input-optional">(اختياري)</span>
            )}
            {labelExtra && <span className="myui-input-extra">{labelExtra}</span>}
          </label>
        )}

        <input
          ref={localInputRef}
          id={inputId}
          type={effectiveType}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          placeholder={label ? (isFocused ? placeholder : "") : placeholder}
          className={`myui-input ${label ? "has-inset-label" : ""} ${
            error ? "has-error" : ""
          } ${icon && iconPosition === "start" ? "has-icon-start" : ""} ${
            (icon && iconPosition === "end") || (showClear && hasValue) || isPassword
              ? "has-icon-end"
              : ""
          } ${inputClassName}`}
          {...props}
        />

        {/* Clear button — hidden for password fields since eye toggle occupies the same slot */}
        {showClear && hasValue && !disabled && !isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className="myui-input-clear-btn"
            aria-label="مسح النص"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}

        {/* Password eye toggle — always visible when type=password and not disabled */}
        {isPassword && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowRaw((s) => !s)}
            className="myui-input-eye-btn"
            aria-label={showRaw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showRaw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}

        {icon && iconPosition === "end" && !hasValue && (
          <div className="myui-input-icon myui-input-icon--end">{icon}</div>
        )}
      </div>

      <div className="myui-input-footer">
        <div className="myui-input-message">
          {error ? (
            <p className="myui-input-error">{error}</p>
          ) : helperText ? (
            <p className="myui-input-helper">{helperText}</p>
          ) : null}
        </div>

        {showCount && hasLimit && (
          <span
            className={`myui-input-char-count ${
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

export const Input = forwardRef(InputComponent);
export default Input;
