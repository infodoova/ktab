import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RoleErrorView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50" dir="rtl">
      <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mb-6 shadow-sm">
        <ShieldAlert size={40} />
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
        لا تملك صلاحية للدخول
      </h1>

      <p className="text-base text-slate-500 font-bold max-w-md leading-relaxed mb-8">
        هذا القسم غير متوفر حسب دور الحساب الخاص بك.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="btn-premium px-8 py-6 rounded-2xl text-white font-black text-xs uppercase tracking-widest active:scale-95 shadow-xl flex items-center gap-3"
      >
        <span>العودة إلى الصفحة الرئيسية</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}

export default RoleErrorView;
