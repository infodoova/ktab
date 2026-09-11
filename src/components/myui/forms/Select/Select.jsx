import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import "./Select.css";

/**
 * Editorial Apple / Eleven Reader Select Dropdown Component
 */
export function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "اختر...",
  error,
  helperText,
  disabled = false,
  required = false,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  icon,
  id,
  name,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to [{ value, label }]
  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" && opt !== null ? opt : { value: opt, label: opt }
  );

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    // Dispatch standard change event object
    onChange?.({ target: { value: val, name } });
    setIsOpen(false);
  };

  const selectId = id || (label ? `select-${label.replace(/\s+/g, "-")}` : undefined);

  return (
    <div
      ref={containerRef}
      className={`myui-select-wrap ${className}`}
      dir="rtl"
    >
      {label && (
        <label htmlFor={selectId} className="myui-select-label">
          <span>{label}</span>
          {required && <span className="myui-select-required">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`myui-select-trigger ${isOpen ? "is-open" : ""} ${
          error ? "has-error" : ""
        } ${triggerClassName}`}
      >
        <div className="myui-select-value-wrap">
          {icon && <span className="myui-select-icon-slot">{icon}</span>}
          <span
            className={
              selectedOption
                ? "myui-select-selected-text"
                : "myui-select-placeholder"
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={17}
          strokeWidth={2.2}
          className={`myui-select-chevron ${isOpen ? "is-rotated" : ""}`}
        />
      </button>

      {/* Floating Menu with Spring Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="listbox"
            className={`myui-select-menu ${menuClassName}`}
          >
            {normalizedOptions.length === 0 ? (
              <div className="myui-select-empty">لا توجد خيارات متاحة</div>
            ) : (
              normalizedOptions.map((opt) => {
                const isSelected = opt.value === value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`myui-select-option ${
                      isSelected ? "is-selected" : ""
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check
                        size={15}
                        strokeWidth={2.8}
                        className="myui-select-check"
                      />
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error ? (
        <p className="myui-select-error">{error}</p>
      ) : helperText ? (
        <p className="myui-select-helper">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Select;
