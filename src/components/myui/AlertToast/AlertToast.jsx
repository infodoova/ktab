import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import "./AlertToast.css";

/* =========================================================
   INTERNAL CONFIG
========================================================= */
const AUTO_CLOSE_DELAY = 2000;
let root = null;
let container = null;
let closeTimer = null;

/* =========================================================
   VARIANT NORMALIZATION (STRICT)
========================================================= */
const normalizeVariant = (variant) => {
  if (!variant) return null;

  const v = String(variant).toLowerCase();

  if (["error", "danger"].includes(v)) return "error";
  if (["success", "ok"].includes(v)) return "success";
  if (["warning", "warn"].includes(v)) return "warning";
  if (v === "info") return "info";

  return null; // ❌ invalid variant → no toast
};

const variantIcon = {
  error: <AlertCircle size={16} />,
  success: <CheckCircle2 size={16} />,
  info: <Info size={16} />,
  warning: <AlertCircle size={16} />,
};

/* =========================================================
   INTERNAL TOAST UI (PRIVATE)
========================================================= */
function Toast({ variant, title, description, onClose }) {
  useEffect(() => {
    closeTimer = setTimeout(onClose, AUTO_CLOSE_DELAY);
    return () => clearTimeout(closeTimer);
  }, [onClose]);

  return (
    <div className="ktab-toast-portal">
      <div className={`ktab-toast-card ktab-toast-card--${variant}`}>
        <div className="ktab-toast-icon">{variantIcon[variant]}</div>

        <div className="ktab-toast-content">
          {title && <p className="ktab-toast-title">{title}</p>}
          {description && (
            <p className="ktab-toast-desc">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ktab-toast-close-btn"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   CLEANUP
========================================================= */
function destroyToast() {
  if (closeTimer) clearTimeout(closeTimer);

  if (root) {
    root.unmount();
    root = null;
  }

  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
    container = null;
  }
}

/* =========================================================
   PUBLIC API
========================================================= */
export function AlertToast(message, variant, title = null) {
  // 🚫 No message → no toast
  if (!message || typeof message !== "string") return;

  // 🚫 No or invalid variant → no toast
  const safeVariant = normalizeVariant(variant);
  if (!safeVariant) return;

  destroyToast();

  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  root.render(
    <Toast
      variant={safeVariant}
      title={title}
      description={message}
      onClose={destroyToast}
    />
  );
}

export default AlertToast;
