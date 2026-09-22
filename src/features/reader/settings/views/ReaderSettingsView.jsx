import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { useAuthStore } from "@/core/store/authStore";
import { LogOut } from "lucide-react";

/**
 * Pure presentation view for Reader Settings and Logout.
 */
export function ReaderSettingsView({ pageName = "الإعدادات" }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="flex-1 flex items-center justify-center p-6 md:p-10" dir="rtl">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-12 border border-black/[0.03] shadow-[0_30px_60px_rgba(0,0,0,0.05)] text-center">
          <div className="w-24 h-24 bg-[#5de3ba]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <LogOut size={40} className="text-[#5de3ba]" strokeWidth={2.5} />
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-4">{pageName}</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
          </p>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-4 bg-[#0a0a0a] text-white px-8 py-6 rounded-3xl hover:bg-[#1a1a1a] active:scale-[0.98] transition-all duration-300 text-sm font-black uppercase tracking-widest shadow-xl shadow-black/10"
          >
            <LogOut size={18} strokeWidth={3} />
            <span>تسجيل الخروج الآن</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default ReaderSettingsView;
