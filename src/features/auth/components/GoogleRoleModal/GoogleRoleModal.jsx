import React from "react";
import { Check, ArrowLeft } from "lucide-react";
import "./GoogleRoleModal.css";

/**
 * Clean editorial role completion screen for new users registering with Google OAuth.
 * Presented inline inside the AuthLayout container or as a standalone modal.
 *
 * @param {{
 *   selectedRole: string,
 *   onSelectRole: (role: string) => void,
 *   onSubmit: () => void,
 *   loading: boolean,
 *   onClose: () => void,
 * }} props
 */
export function GoogleRoleModal({
  selectedRole,
  onSelectRole,
  onSubmit,
  loading,
  onClose,
}) {
  return (
    <div className="google-role-container" dir="rtl">
      <header className="google-role-header">
        <h2 className="google-role-title">إكمال إنشاء الحساب</h2>
        <p className="google-role-subtitle">
          اختر نوع الحساب الذي يناسبك للمتابعة عبر Google
        </p>
      </header>

      <div className="google-role-cards-grid" role="radiogroup" aria-label="اختر نوع الحساب">
        {/* Reader Option */}
        <button
          type="button"
          role="radio"
          aria-checked={selectedRole === "READER"}
          className={`google-role-card ${selectedRole === "READER" ? "is-selected" : ""}`}
          onClick={() => onSelectRole("READER")}
          disabled={loading}
        >
          <span className="google-role-card-title">قارئ</span>
          <div className="google-role-check" aria-hidden="true">
            {selectedRole === "READER" && <Check size={12} strokeWidth={3} />}
          </div>
        </button>

        {/* Author Option */}
        <button
          type="button"
          role="radio"
          aria-checked={selectedRole === "AUTHOR"}
          className={`google-role-card ${selectedRole === "AUTHOR" ? "is-selected" : ""}`}
          onClick={() => onSelectRole("AUTHOR")}
          disabled={loading}
        >
          <span className="google-role-card-title">مؤلف</span>
          <div className="google-role-check" aria-hidden="true">
            {selectedRole === "AUTHOR" && <Check size={12} strokeWidth={3} />}
          </div>
        </button>
      </div>

      <footer className="google-role-actions">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !selectedRole}
          className="google-role-submit-btn"
        >
          <span>{loading ? "جاري إنشاء الحساب..." : "تأكيد والانتقال"}</span>
          {!loading && <ArrowLeft size={16} strokeWidth={2.4} />}
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="google-role-cancel-btn"
        >
          إلغاء والعودة
        </button>
      </footer>
    </div>
  );
}

export default GoogleRoleModal;
