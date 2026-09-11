import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { useAuthStore } from "@/core/store/authStore";
import { User, Mail, Shield } from "lucide-react";

/**
 * Pure presentation view for the Reader Profile page.
 */
export function ReaderProfileView({ pageName = "الحساب الشخصي" }) {
  const user = useAuthStore((state) => state.user);

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="max-w-4xl mx-auto py-8" dir="rtl">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8">
          {/* Header */}
          <div className="flex items-center gap-6 border-b border-black/[0.05] pb-8">
            <div className="w-20 h-20 bg-[#5de3ba]/20 text-black rounded-3xl flex items-center justify-center font-black text-2xl">
              <User size={36} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                {user?.fullName || user?.name || "القارئ"}
              </h2>
              <p className="text-sm font-bold text-slate-400 mt-1">
                {user?.email || "reader@ktab.app"}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-black/[0.03] flex items-center gap-4">
              <Mail className="text-slate-400" size={24} />
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                  البريد الإلكتروني
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {user?.email || "reader@ktab.app"}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-black/[0.03] flex items-center gap-4">
              <Shield className="text-[#5de3ba]" size={24} />
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                  نوع الحساب
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {user?.role || "قارئ (READER)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default ReaderProfileView;
