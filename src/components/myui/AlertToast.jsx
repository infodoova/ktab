import * as React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const variantStyles = {
  error: "bg-red-50 text-red-900 border-red-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  info: "bg-blue-50 text-blue-900 border-blue-200",
};

const variantIcon = {
  error: <AlertCircle className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export const AlertToast = ({
  open,
  variant = "info",
  title,
  description,
  autoClose = true,
  autoCloseDelay = 4000,
  onClose,
}) => {
  React.useEffect(() => {
    if (!open || !autoClose) return;

    const id = window.setTimeout(() => {
      onClose?.();
    }, autoCloseDelay);

    return () => window.clearTimeout(id);
  }, [open, autoClose, autoCloseDelay, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 z-[9999]",
        "w-[calc(100%-2rem)] max-w-sm sm:w-full sm:max-w-sm"
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-md border px-3.5 py-3 shadow-md",
          "text-sm",
          variantStyles[variant]
        )}
      >
        <div className="mt-0.5">{variantIcon[variant]}</div>

        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold leading-snug truncate">{title}</p>}

          {description && (
            <p className="mt-0.5 text-xs sm:text-[13px] leading-snug break-words">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-2 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-current/70 hover:bg-black/5 hover:text-current transition"
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
