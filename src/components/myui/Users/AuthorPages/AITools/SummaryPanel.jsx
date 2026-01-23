import React, { useState, useRef } from "react";
import { Bot, Copy, Share2, Check } from "lucide-react";
import AiGeneratingScreen from "./AiGeneratingScreen";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function SummaryPanel({ loading, summary, hasStarted }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const contentRef = useRef(null);

const cleanMarkdown = (text) => {
  if (!text) return "";

  let out = text;

  out = out.replace(/\.{2,}/g, ".");
  out = out.replace(/-{2,}/g, "-");

  out = out.replace(/(\d+)\s*-\s*/g, "$1. ");

  out = out.replace(/([^\n])(\d+\.)/g, "$1\n$2");

  out = out.replace(/([^\n])(-\s)/g, "$1\n$2");

  out = out.replace(
    /\b([\u0600-\u06FF])\s+([\u0600-\u06FF]{2,})\b/g,
    "$1$2"
  );

  out = out.replace(/\b([A-Za-z])\s+([A-Za-z]{2,})\b/g, "$1$2");

  out = out.replace(/\s+(?=[،.:؛؟!])/g, "");

  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
};


 
  const renderMarkdown = (text) => {
    const cleaned = cleanMarkdown(text);

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const html = marked.parse(cleaned);
    return DOMPurify.sanitize(html);
  };

 
  const handleCopy = () => {
    if (!contentRef.current) return;

    const plainText =
      contentRef.current.innerText || contentRef.current.textContent || "";

    navigator.clipboard.writeText(plainText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

 
  const handleShare = async () => {
    if (!contentRef.current) return;

    const plainText =
      contentRef.current.innerText || contentRef.current.textContent || "";

    const textToShare = plainText.trim();
    if (!textToShare) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "الخلاصة المولدة",
          text: textToShare,
        });
      } else {
        navigator.clipboard.writeText(textToShare);
      }

      setShared(true);
      setTimeout(() => setShared(false), 1200);
    } catch (err) {
      console.error(err);
    }
  };

 
  return (
    <div
      className="
        flex-1 flex flex-col relative overflow-hidden
        rounded-[2.5rem] p-6 md:p-10
        bg-white
        border border-black/5 
        shadow-[0_20px_50px_rgba(0,0,0,0.05)]
        max-h-[85vh]
      "
    >
      {/* --------------------- EMPTY STATE --------------------- */}
      {!summary && !loading && (
        <div className="flex flex-col items-center justify-center text-center h-full animate-fadeIn space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#5de3ba]/10 blur-3xl rounded-full" />
            <Bot
              size={80}
              className="relative text-[#5de3ba] opacity-90 drop-shadow-xl"
            />
          </div>

          <p className="text-3xl md:text-5xl font-black text-black tracking-tight">
            ابدأ الآن
          </p>

          <p className="text-sm md:text-base font-bold text-black/40 max-w-sm">
            قم برفع ملف PDF وتوليد الخاتمة الذكية مباشرة هنا لتوفير الوقت والجهد
          </p>
        </div>
      )}

      {/* ----------------------- LOADING ------------------------ */}
      {loading && !hasStarted && (
        <div className="absolute inset-0 z-20">
          <AiGeneratingScreen />
        </div>
      )}

      {loading && hasStarted && (
        <div className="text-center text-sm text-[var(--earth-brown)]/60 mb-3 animate-pulse">
          جاري التوليد...
        </div>
      )}

      {/* ---------------------- SUMMARY ------------------------- */}
      {summary && (
        <div className="h-full overflow-y-auto relative z-10 px-2 mt-2 custom-scrollbar">
          <h2 className="text-2xl md:text-4xl font-black text-center text-black mb-10 tracking-tight">
            الخلاصة المولدة
          </h2>

          <div
            ref={contentRef}
            dir="rtl"
            className="
              prose prose-lg max-w-none
              text-[var(--earth-brown)]/90 leading-relaxed text-right

              /* HEADINGS */
              prose-headings:text-[var(--earth-brown)]
              prose-headings:font-bold
              prose-headings:mt-6
              prose-headings:mb-3

              /* STRONG */
              prose-strong:text-[var(--earth-olive)] 
              prose-strong:font-extrabold

              /* LISTS */
              prose-ul:text-right prose-ol:text-right prose-li:text-right
              prose-li:marker:text-[var(--earth-olive)]
              [&_ul]:mr-5 [&_ul]:pl-0
              [&_ol]:mr-5 [&_ol]:pl-0
              [&_li]:my-1
            "
            dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
          />
        </div>
      )}

      {/* ---------------------- BUTTONS ------------------------- */}
      {summary && !loading && (
        <div
          className="absolute bottom-4 left-4 flex items-center gap-3 animate-fadeIn z-20"
          dir="ltr"
        >
          {/* COPY */}
          <button
            onClick={handleCopy}
            className="
              p-4 rounded-2xl 
              bg-white shadow-xl border border-black/5 
              transition-all hover:bg-black/5 
              hover:scale-105 active:scale-95
            "
          >
            {copied ? (
              <Check size={20} className="text-[#5de3ba]" />
            ) : (
              <Copy size={20} className="text-black/40" />
            )}
          </button>

          {/* SHARE */}
          <button
            onClick={handleShare}
            className="
              p-4 rounded-2xl 
              bg-white shadow-xl border border-black/5 
              transition-all hover:bg-black/5
              hover:scale-105 active:scale-95
            "
          >
            {shared ? (
              <Check size={20} className="text-[#5de3ba]" />
            ) : (
              <Share2 size={20} className="text-black/40" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
