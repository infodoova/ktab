import React from "react";
import { Loader2 } from "lucide-react";

export function UploadProgressModal({ isOpen, progress = 0, title = "جاري حفظ وتجهيز الكتاب..." }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-black/5" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-[#5de3ba]/10 text-[#5de3ba] flex items-center justify-center mx-auto">
          <Loader2 className="animate-spin" size={32} />
        </div>

        <div>
          <h3 className="font-black text-slate-900 text-lg">{title}</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">يرجى الانتظار حتى اكتمال الرفع والمعالجة</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-l from-[#5de3ba] to-[#76debf] h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-black text-slate-700">{progress}%</p>
        </div>
      </div>
    </div>
  );
}

export default UploadProgressModal;
