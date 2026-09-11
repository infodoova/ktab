import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { useAuthStore } from "@/core/store/authStore";
import { LogOut, User, Mail, Shield } from "lucide-react";

/**
 * Pure presentation view for Author Settings and Profile.
 */
export function AuthorSettingsView({ pageName = "الإعدادات" }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="max-w-4xl mx-auto py-8 space-y-8" dir="rtl">
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-sm space-y-8">
          <div className="flex items-center gap-6 border-b border-black/5 pb-8">
            <div className="w-20 h-20 bg-[#5de3ba]/20 text-black rounded-3xl flex items-center justify-center font-black text-2xl">
              <User size={36} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                {user?.fullName || user?.name || "المؤلف"}
              </h2>
              <p className="text-sm font-bold text-slate-400 mt-1">
                {user?.email || "author@ktab.app"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 flex items-center gap-4">
              <Mail className="text-slate-400" size={24} />
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                  البريد الإلكتروني
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {user?.email || "author@ktab.app"}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 flex items-center gap-4">
              <Shield className="text-[#5de3ba]" size={24} />
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                  نوع الحساب
                </span>
                <span className="text-sm font-bold text-slate-800">
                  مؤلف (AUTHOR)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 bg-[#5de3ba]/10 rounded-[2rem] flex items-center justify-center mx-auto text-[#5de3ba]">
            <LogOut size={36} strokeWidth={2.5} />
          </div>

          <h3 className="text-2xl font-black text-slate-900">تسجيل الخروج</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed text-sm">
            هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك كمؤلف؟
          </p>

          <button
            onClick={handleLogout}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl active:scale-[0.98] transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-black/10"
          >
            <LogOut size={16} strokeWidth={3} />
            <span>تسجيل الخروج الآن</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default AuthorSettingsView;
