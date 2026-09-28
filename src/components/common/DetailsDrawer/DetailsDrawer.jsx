import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDetailsDrawer } from "./useDetailsDrawer";
import "./DetailsDrawer.css";

/**
 * Standard slide-over drawer modal.
 * Positions on the left of viewport on desktop and translates into a bottom sheet on mobile.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibility toggle
 * @param {Function} props.onClose - Callback triggered upon backdrop click or escape key
 * @param {React.ReactNode} props.title - Primary drawer title
 * @param {React.ReactNode} [props.subtitle] - Optional subtitle under title
 * @param {React.ReactNode} props.children - Scrollable body content
 * @param {React.ReactNode} [props.footer] - Optional sticky action footer
 * @param {string} [props.width="520px"] - Custom desktop panel max-width
 * @param {string} [props.className=""] - Optional wrapper CSS class
 */
export function DetailsDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "520px",
  className = "",
  headerActions = null,
  onBackdropClick = null,
}) {
  const { isMobile } = useDetailsDrawer({ isOpen, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`ktab-details-drawer-backdrop ${className}`}
          onClick={onBackdropClick || onClose}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : "تفاصيل"}
        >
          {/* Frosted Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ktab-details-drawer-overlay"
          />

          {/* Drawer Sheet Container */}
          <motion.div
            initial={
              isMobile
                ? { opacity: 0, y: "100%" }
                : { opacity: 0, x: -60, scale: 0.98 }
            }
            animate={
              isMobile
                ? { opacity: 1, y: 0 }
                : { opacity: 1, x: 0, scale: 1 }
            }
            exit={
              isMobile
                ? { opacity: 0, y: "100%" }
                : { opacity: 0, x: -60, scale: 0.98 }
            }
            transition={{
              type: "spring",
              damping: isMobile ? 32 : 30,
              stiffness: isMobile ? 320 : 350,
              mass: 0.8,
            }}
            className="ktab-details-drawer-panel"
            style={{ "--drawer-width": width }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="ktab-details-drawer-handle" />

            {/* Header with Title and Close Button */}
            <div className="ktab-details-drawer-header">
              <div className="ktab-details-drawer-header__titles">
                <h3 className="ktab-details-drawer-title">{title}</h3>
                {subtitle && (
                  <p className="ktab-details-drawer-subtitle">{subtitle}</p>
                )}
              </div>
              <div className="ktab-details-drawer-header-actions">
                {headerActions}
                <button
                  type="button"
                  onClick={onClose}
                  className="ktab-details-drawer-close-btn"
                  aria-label="إغلاق"
                  title="إغلاق"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="ktab-details-drawer-body">{children}</div>

            {/* Optional Sticky Footer */}
            {footer && <div className="ktab-details-drawer-footer">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default DetailsDrawer;
