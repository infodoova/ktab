import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import "./Button.css";

/**
 * Editorial Apple / Eleven Reader Button Component
 */
export function Button({
  children,
  variant = "primary", // "primary" | "teal" | "secondary" | "outline" | "ghost" | "danger"
  size = "md", // "sm" | "md" | "lg" | "icon"
  loading = false,
  disabled = false,
  icon,
  iconPosition = "start",
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  const variantClass = `myui-btn--${variant}`;
  const sizeClass = `myui-btn--${size}`;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.012 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={`myui-btn ${sizeClass} ${variantClass} ${isDisabled ? "is-disabled" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="myui-btn-icon myui-btn-spinner" size={16} />
      ) : (
        icon && iconPosition === "start" && <span className="myui-btn-icon">{icon}</span>
      )}

      {children && <span>{children}</span>}

      {!loading && icon && iconPosition === "end" && (
        <span className="myui-btn-icon">{icon}</span>
      )}
    </motion.button>
  );
}

export default Button;
