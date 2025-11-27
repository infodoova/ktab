import React from "react";
import AiGeneratingScreen from "./AiGeneratingScreen";
import { Bot } from "lucide-react";

export default function SummaryPanel({ loading, summary }) {
  return (
    <div
      className="
        flex-1 
        rounded-2xl 
        bg-[var(--earth-paper)] 
        border border-[var(--earth-sand)]/40 
        shadow-sm 
        p-4 sm:p-6 
        relative overflow-hidden
        min-h-[320px]
        animate-fadeIn
      "
    >
      {/* LOADING STATE */}
      {loading && <AiGeneratingScreen />}

      {/* READY SUMMARY */}
      {!loading && summary && (
        <div className="overflow-y-auto h-full px-1 sm:px-2 fade-in">
          <h2 className="text-xl font-bold text-[var(--earth-brown)] mb-4">
            الخلاصة المولدة
          </h2>

          <p className="leading-relaxed text-[var(--earth-brown)]/80 whitespace-pre-line">
            {summary}
          </p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !summary && (
        <div className="flex flex-col items-center justify-center text-center h-full fade-in">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-[var(--earth-olive)]/20 blur-3xl rounded-full"></div>
            <Bot
              size={72}
              className="relative text-[var(--earth-olive)] opacity-90 drop-shadow"
            />
          </div>

          <p className="text-[var(--earth-brown)]/70 font-medium">
            لبدء توليد الخلاصة قم بملئ البيانات
          </p>

          <p className="text-[var(--earth-brown)]/50 text-sm mt-1">
            سيتم عرض الخلاصة مباشرة هنا{" "}
          </p>
        </div>
      )}
    </div>
  );
}
