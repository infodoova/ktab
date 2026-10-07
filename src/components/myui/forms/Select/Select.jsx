import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import "./Select.css";

/**
 * Editorial Apple / Eleven Reader Select Dropdown Component
 */
export function Select({
  label,
  labelExtra,
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
  multiple = false,
  maxSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to [{ value, label }]
  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" && opt !== null ? opt : { value: opt, label: opt }
  );

  // Multi-selection arrays
  const selectedValues = multiple
    ? (Array.isArray(value) ? value : value !== undefined && value !== null ? [value] : [])
    : null;

  const selectedLabels = multiple
    ? selectedValues
        .map((v) => normalizedOptions.find((opt) => opt.value === v)?.label || v)
        .filter(Boolean)
    : [];

  // Find currently selected option for single select
  const selectedOption = multiple
    ? null
    : normalizedOptions.find((opt) => {
        if (opt.value === value) return true;
        if (value !== undefined && value !== null) {
          const strVal = String(value).trim();
          const optVal = String(opt.value).trim();
          if (optVal === strVal || optVal.toLowerCase() === strVal.toLowerCase()) return true;
          if (opt.label && (String(opt.label).trim() === strVal || String(opt.label).trim().toLowerCase() === strVal.toLowerCase())) return true;
        }
        return false;
      });

  const displayText = multiple
    ? (selectedLabels.length > 0 ? selectedLabels.join("، ") : placeholder)
    : (selectedOption ? selectedOption.label : placeholder);

  const hasSelected = multiple ? selectedValues.length > 0 : Boolean(selectedOption);

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
    if (multiple) {
      let updated;
      if (selectedValues.includes(val)) {
        updated = selectedValues.filter((v) => v !== val);
      } else {
        if (maxSelected && selectedValues.length >= maxSelected) {
          return;
        }
        updated = [...selectedValues, val];
      }
      const event = {
        target: { value: updated, name },
        currentTarget: { value: updated, name },
        value: updated,
      };
      onChange?.(event, updated);
    } else {
      // Provide standard change event object with string primitive fallback and dual arguments
      const event = {
        target: { value: val, name },
        currentTarget: { value: val, name },
        value: val,
        toString: () => String(val),
        valueOf: () => val,
        [Symbol.toPrimitive]: () => val,
      };
      onChange?.(event, val);
      setIsOpen(false);
    }
  };

  const selectId = id || (label ? `select-${label.replace(/\s+/g, "-")}` : undefined);

  return (
    <div
      ref={containerRef}
      className={`myui-select-wrap ${className}`}
      dir="rtl"
    >
      {/* Trigger Button */}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`myui-select-trigger ${label ? "has-inset-label" : ""} ${
          isOpen ? "is-open" : ""
        } ${error ? "has-error" : ""} ${triggerClassName}`}
      >
        <div className="myui-select-trigger-content">
          {label && (
            <div className="myui-select-inset-label">
              <span>{label}</span>
              {required && <span className="myui-select-required">*</span>}
              {labelExtra}
            </div>
          )}

          <div className="myui-select-value-wrap">
            {icon && <span className="myui-select-icon-slot">{icon}</span>}
            {selectedOption?.color && (
              <span
                className="myui-select-color-circle"
                style={{ backgroundColor: selectedOption.color }}
              />
            )}
            <span
              className={
                hasSelected
                  ? "myui-select-selected-text"
                  : "myui-select-placeholder"
              }
            >
              {displayText}
            </span>
          </div>
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
                const isSelected = multiple
                  ? selectedValues.includes(opt.value)
                  : opt.value === value;

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
                    <div className="myui-select-option-content">
                      {opt.color && (
                        <span
                          className="myui-select-color-circle"
                          style={{ backgroundColor: opt.color }}
                        />
                      )}
                      <span>{opt.label}</span>
                    </div>
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
