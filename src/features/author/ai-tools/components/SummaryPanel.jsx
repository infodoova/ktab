import React, { useState } from "react";
import { Copy, Check, Sparkles, Share2 } from "lucide-react";
import { AiGeneratingScreen } from "./AiGeneratingScreen";
import { AlertToast } from "@/components/myui/AlertToast";

export function SummaryPanel({ loading = false, summary = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    AlertToast("تم نسخ النص بنجاح!", "SUCCESS");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex-1 bg-white rounded-[2.5rem] border border-black/5 shadow-sm p-8 md:p-10 flex flex-col justify-between min-h-[450px]"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#5de3ba]/15 text-black">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">الخاتمة المقترحة</h3>
            <p className="text-xs font-bold text-slate-400">توليد مدعوم بالذكاء الاصطناعي</p>
          </div>
        </div>

        {summary && !loading && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors border border-black/5"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>{copied ? "تم النسخ" : "نسخ النص"}</span>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 py-6">
        {loading ? (
          <AiGeneratingScreen />
        ) : summary ? (
          <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-black/5 text-slate-800 text-sm md:text-base leading-loose font-bold whitespace-pre-wrap">
            {summary}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
              <Sparkles size={28} />
            </div>
            <p className="font-bold text-sm">
              قم برفع ملف الكتاب من القائمة الجانبية واضغط على زر التوليد لعرض النتائج هنا.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryPanel;
