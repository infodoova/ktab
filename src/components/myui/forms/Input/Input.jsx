import React, { forwardRef } from "react";
import "./Input.css";

/**
 * Editorial Apple / Eleven Reader Input Component
 */
export function InputComponent(
  {
    label,
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
    ...props
  },
  ref
) {
  const inputId = id || (label ? `input-${label.replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={`myui-input-wrap ${className}`} dir="rtl">
      {label && (
        <label htmlFor={inputId} className="myui-input-label">
          <span>{label}</span>
          {required && <span className="myui-input-required">*</span>}
        </label>
      )}

      <div className="myui-input-field-wrap">
        {icon && iconPosition === "start" && (
          <div className="myui-input-icon myui-input-icon--start">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`myui-input ${error ? "has-error" : ""} ${
            icon && iconPosition === "start" ? "has-icon-start" : ""
          } ${icon && iconPosition === "end" ? "has-icon-end" : ""} ${inputClassName}`}
          {...props}
        />

        {icon && iconPosition === "end" && (
          <div className="myui-input-icon myui-input-icon--end">
            {icon}
          </div>
        )}
      </div>

      {error ? (
        <p className="myui-input-error">{error}</p>
      ) : helperText ? (
        <p className="myui-input-helper">{helperText}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(InputComponent);
export default Input;
