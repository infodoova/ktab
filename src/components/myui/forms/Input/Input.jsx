import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import "./Input.css";

/**
 * Editorial Apple / Eleven Reader Modern Floating Label Input Component.
 * Implements the Notched Outline floating label pattern ("Design Bites"):
 * - Idle: label sits centered inside the container.
 * - On Press / Focus or With Content: label glides up onto the top border notch.
 * - Shows optional clear (X) button when content exists.
 * - Built-in max limit validation with live tabular character counter.
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
  // Controls password plaintext reveal. Only active when the original type prop is "password".
  const [showRaw, setShowRaw] = useState(false);
  const localInputRef = useRef(null);

  useImperativeHandle(ref, () => localInputRef.current);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value ?? "") : internalValue;
  const currentLength = String(currentValue).length;
  const hasValue = currentLength > 0;
  const isFloating = Boolean(label) && (isFocused || hasValue);
  const isPassword = type === "password";
  // When the field is a password type, toggle between masked and plaintext.
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
      className={`myui-input-wrap ${label ? "myui-input-wrap--floating" : ""} ${
        error ? "has-error" : ""
      } ${isFocused ? "is-focused" : ""} ${className}`}
      dir="rtl"
    >
      <div className={`myui-input-field-wrap ${label ? "myui-input-field-wrap--floating" : ""}`}>
        {icon && iconPosition === "start" && (
          <div className="myui-input-icon myui-input-icon--start">{icon}</div>
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
          placeholder={label ? (isFloating ? placeholder : "") : placeholder}
          className={`myui-input ${label ? "myui-input--floating" : ""} ${
            error ? "has-error" : ""
          } ${icon && iconPosition === "start" ? "has-icon-start" : ""} ${
            (icon && iconPosition === "end") || (showClear && hasValue) || isPassword
              ? "has-icon-end"
              : ""
          } ${inputClassName}`}
          {...props}
        />

        {label && (
          <label
            htmlFor={inputId}
            className={`myui-input-floating-label ${
              isFloating ? "is-floating" : ""
            } ${isFocused ? "is-focused" : ""}`}
          >
            <span>{label}</span>
            {required ? (
              <span className="myui-input-required">*</span>
            ) : (
              <span className="myui-input-optional">(اختياري)</span>
            )}
            {labelExtra && <span className="myui-input-extra-inline">{labelExtra}</span>}
          </label>
        )}

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
