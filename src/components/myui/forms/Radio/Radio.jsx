import React from "react";
import "./Radio.css";

/**
 * Editorial Apple / Eleven Reader Radio Item Component
 */
export function Radio({
  label,
  value,
  checked = false,
  onChange,
  disabled = false,
  name,
  id,
  className = "",
  ...props
}) {
  const radioId = id || (label ? `radio-${label.replace(/\s+/g, "-")}-${value}` : undefined);

  return (
    <label
      htmlFor={radioId}
      className={`myui-radio-label-wrap ${disabled ? "is-disabled" : ""} ${className}`}
      dir="rtl"
    >
      <input
        id={radioId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(value, e)}
        disabled={disabled}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
        {...props}
      />

      <div className={`myui-radio-circle ${checked ? "is-checked" : ""}`}>
        {checked && <div className="myui-radio-dot" />}
      </div>

      {label && <span className="myui-radio-text">{label}</span>}
    </label>
  );
}

/**
 * Editorial Apple / Eleven Reader RadioGroup Component
 */
export function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  children,
  className = "",
}) {
  return (
    <div className={`myui-radio-group ${className}`} dir="rtl" role="radiogroup">
      {options.length > 0
        ? options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const lbl = typeof opt === "object" ? opt.label : opt;
            const isChecked = value === val;

            return (
              <Radio
                key={val}
                name={name}
                value={val}
                label={lbl}
                checked={isChecked}
                onChange={onChange}
              />
            );
          })
        : React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(child, {
              name,
              checked: child.props.value === value,
              onChange: (val, e) => {
                child.props.onChange?.(val, e);
                onChange?.(val, e);
              },
            });
          })}
    </div>
  );
}

export default Radio;
