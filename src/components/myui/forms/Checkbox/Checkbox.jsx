import React from "react";
import { Check } from "lucide-react";
import "./Checkbox.css";

/**
 * Editorial Apple / Eleven Reader Checkbox Component
 */
export function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  id,
  className = "",
  error,
  ...props
}) {
  const checkboxId = id || (label ? `checkbox-${label.replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={`myui-checkbox-wrap ${className}`} dir="rtl">
      <label
        htmlFor={checkboxId}
        className={`myui-checkbox-label-wrap ${disabled ? "is-disabled" : ""}`}
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked, e)}
          disabled={disabled}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          {...props}
        />

        <div
          className={`myui-checkbox-box ${checked ? "is-checked" : ""} ${
            error ? "has-error" : ""
          }`}
        >
          {checked && <Check size={13} className="myui-checkbox-icon" />}
        </div>

        {label && <span className="myui-checkbox-text">{label}</span>}
      </label>

      {error && <p className="myui-checkbox-error">{error}</p>}
    </div>
  );
}

export default Checkbox;
