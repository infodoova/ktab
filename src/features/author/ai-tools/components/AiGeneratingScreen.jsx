import React from "react";
import { Sparkles } from "lucide-react";

export function AiGeneratingScreen() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#5de3ba]/20 to-[#76debf]/30 flex items-center justify-center text-[#5de3ba] animate-pulse">
          <Sparkles size={36} />
        </div>
        <div className="absolute -inset-1 bg-[#5de3ba]/20 rounded-3xl blur-xl animate-spin" />
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-black text-slate-900">جاري قراءة وتحليل ملف PDF...</h4>
        <p className="text-xs font-bold text-slate-400 max-w-xs mx-auto">
          يقوم الذكاء الاصطناعي باستخراج أحداث الكتاب وصياغة خاتمة مقترحة وفق الفئة المستهدفة.
        </p>
      </div>
    </div>
  );
}

export default AiGeneratingScreen;
