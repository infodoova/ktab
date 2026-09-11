import React from "react";
import "./Switch.css";

/**
 * Editorial Apple / Eleven Reader Switch Component
 */
export function Switch({
  label,
  checked = false,
  onChange,
  disabled = false,
  id,
  className = "",
  size = "md", // "sm" | "md"
  ...props
}) {
  const switchId = id || (label ? `switch-${label.replace(/\s+/g, "-")}` : undefined);
  const isSmall = size === "sm";

  return (
    <label
      htmlFor={switchId}
      className={`myui-switch-label-wrap ${disabled ? "is-disabled" : ""} ${className}`}
      dir="rtl"
    >
      <input
        id={switchId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked, e)}
        disabled={disabled}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
        {...props}
      />

      <div
        className={`myui-switch-track ${isSmall ? "is-small" : ""} ${
          checked ? "is-checked" : ""
        }`}
      >
        <div className="myui-switch-knob" />
      </div>

      {label && <span className="myui-switch-text">{label}</span>}
    </label>
  );
}

export default Switch;
