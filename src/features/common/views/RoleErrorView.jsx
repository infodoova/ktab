import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { useAuthStore } from "@/core/store/authStore";
import "./RoleErrorView.css";

export function RoleErrorView() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogoutAndSwitch = async () => {
    try {
      await logout();
    } finally {
      navigate("/login?switch=true", { replace: true });
    }
  };

  return (
    <div className="role-error-container" dir="rtl">
      <main className="role-error-card">
        <div className="role-error-icon-wrap" aria-hidden="true">
          <ShieldAlert size={34} strokeWidth={2} />
        </div>

        <h1 className="role-error-title">
          لا تملك صلاحية للدخول
        </h1>

        <p className="role-error-desc">
          هذا القسم غير متوفر حسب صلاحيات الحساب الحالي المسجل.
        </p>

        <div className="role-error-actions">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="role-error-btn-primary"
          >
            <span>العودة إلى الصفحة الرئيسية</span>
            <ArrowLeft size={16} strokeWidth={2.4} />
          </button>

          <button
            type="button"
            onClick={handleLogoutAndSwitch}
            className="role-error-btn-secondary"
          >
            <LogOut size={16} strokeWidth={2.2} />
            <span>تسجيل الخروج والتبديل لحساب آخر</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default RoleErrorView;
