import React from "react";
import "./FormField.css";

/**
 * Editorial Apple / Eleven Reader Label Component
 */
export function Label({
  children,
  htmlFor,
  required = false,
  className = "",
  ...props
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`myui-label ${className}`}
      dir="rtl"
      {...props}
    >
      <span>{children}</span>
      {required && <span className="myui-label-required">*</span>}
    </label>
  );
}

/**
 * Editorial Apple / Eleven Reader FormField Wrapper Component
 */
export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required = false,
  className = "",
  children,
}) {
  return (
    <div className={`myui-formfield-wrap ${className}`} dir="rtl">
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}

      {children}

      {error ? (
        <p className="myui-formfield-error">{error}</p>
      ) : helperText ? (
        <p className="myui-formfield-helper">{helperText}</p>
      ) : null}
    </div>
  );
}

export default FormField;
