import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================================================
   INTERNAL CONFIG (DO NOT TOUCH)
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

/* =========================================================
   STYLES & ICONS (ONE CANONICAL FORMAT)
========================================================= */
const variantStyles = {
  error: "bg-red-50 text-red-900 border-red-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  info: "bg-blue-50 text-blue-900 border-blue-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
};

const variantIcon = {
  error: <AlertCircle className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  warning: <AlertCircle className="h-4 w-4" />,
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
    <div className="fixed top-4 right-4 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div
        className={cn(
          "flex items-start gap-3 rounded-md border px-3.5 py-3 shadow-md text-sm",
          variantStyles[variant]
        )}
      >
        <div className="mt-0.5 shrink-0">{variantIcon[variant]}</div>

        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold leading-snug truncate">{title}</p>
          )}
          {description && (
            <p className="mt-0.5 text-xs leading-snug break-words">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   CLEANUP (SAFE & IDPOTENT)
========================================================= */
function destroyToast() {
  if (closeTimer) clearTimeout(closeTimer);

  if (root) {
    root.unmount();
    root = null;
  }

  if (container) {
    document.body.removeChild(container);
    container = null;
  }
}

/* =========================================================
   ✅ PUBLIC API (STRICT CONTRACT)
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
