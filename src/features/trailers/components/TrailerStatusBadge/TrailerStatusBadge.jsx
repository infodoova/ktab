import {
  Clock,
  Loader2,
  Film,
  CheckCircle2,
  ShieldAlert,
  AlertCircle,
  Ban,
} from "lucide-react";
import "./TrailerStatusBadge.css";

const STATUS_CONFIG = {
  QUEUED: {
    label: "في قائمة الانتظار",
    icon: Clock,
    className: "trailer-status-badge--queued",
  },
  RUNNING: {
    label: "جارٍ الإنتاج",
    icon: Loader2,
    className: "trailer-status-badge--running",
    isSpinning: true,
  },
  HARVESTING: {
    label: "تجميع الملفات",
    icon: Film,
    className: "trailer-status-badge--harvesting",
  },
  READY: {
    label: "جاهز للمشاهدة",
    icon: CheckCircle2,
    className: "trailer-status-badge--ready",
  },
  NEEDS_REVIEW: {
    label: "بانتظار المراجعة",
    icon: ShieldAlert,
    className: "trailer-status-badge--review",
  },
  FAILED: {
    label: "فشل الإنتاج",
    icon: AlertCircle,
    className: "trailer-status-badge--failed",
  },
  CANCELLED: {
    label: "تم الإلغاء",
    icon: Ban,
    className: "trailer-status-badge--cancelled",
  },
};

export function TrailerStatusBadge({ status, size = "md", showIcon = true, className = "" }) {
  const norm = typeof status === "string" ? status.trim().toUpperCase() : "";
  const config = STATUS_CONFIG[norm] || {
    label: status || "غير محدد",
    icon: Clock,
    className: "trailer-status-badge--unknown",
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`trailer-status-badge ${config.className} trailer-status-badge--${size} ${className}`}
      data-status={norm}
    >
      {showIcon && (
        <IconComponent
          size={size === "sm" ? 12 : 14}
          className={`trailer-status-badge__icon ${config.isSpinning ? "trailer-status-badge__icon--spin" : ""}`}
        />
      )}
      <span className="trailer-status-badge__text">{config.label}</span>
    </span>
  );
}
