import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, Eye, Play, X, Sparkles, Clock } from "lucide-react";

// --- Configuration & Helpers ---
const LENS_LABELS = {
  POLITICAL: "سياسي",
  PSYCHOLOGICAL: "نفسي",
  SURVIVAL: "بقاء",
  MORAL: "أخلاقي",
};

const LENS_COLORS = {
  POLITICAL: "bg-white/50 text-blue-600 border-black/10",
  PSYCHOLOGICAL: "bg-white/50 text-purple-600 border-black/10",
  SURVIVAL: "bg-white/50 text-orange-600 border-black/10",
  MORAL: "bg-white/50 text-emerald-600 border-black/10",
  DEFAULT:
    "bg-white/50 text-[var(--primary-text)]/60 border-black/10",
};

function formatLens(lens) {
  if (!lens) return "غير محدد";
  return LENS_LABELS[lens] ?? String(lens);
}

function getLensStyle(lens) {
  return LENS_COLORS[lens] || LENS_COLORS.DEFAULT;
}

// --- Skeleton Component ---
const DetailsModalSkeleton = () => (
  <div className="flex flex-col-reverse md:flex-row h-full w-full animate-in fade-in duration-500">
    <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-12 lg:p-16 space-y-8">
      <div className="space-y-5">
        <Skeleton className="h-7 w-36 rounded-full bg-[var(--primary-button)]/10" />
        <div className="space-y-3">
          <Skeleton className="h-12 md:h-16 w-full rounded-2xl bg-[var(--primary-text)]/5" />
          <Skeleton className="h-12 md:h-16 w-2/3 rounded-2xl bg-[var(--primary-text)]/5" />
        </div>
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-10 w-28 rounded-xl bg-[var(--primary-text)]/5" />
          <Skeleton className="h-10 w-28 rounded-xl bg-[var(--primary-text)]/5" />
        </div>
      </div>
      <div className="flex-1 space-y-4 pt-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full rounded-md bg-[var(--primary-text)]/5" />
        ))}
      </div>
      <div className="pt-10 border-t border-[var(--primary-border)]/10 flex items-center justify-between">
        <div className="hidden sm:flex flex-col gap-2">
          <Skeleton className="h-5 w-40 rounded-md bg-[var(--primary-text)]/5" />
          <Skeleton className="h-4 w-52 rounded-md bg-[var(--primary-text)]/5" />
        </div>
        <Skeleton className="h-14 md:h-16 w-full sm:w-[260px] rounded-2xl bg-[var(--primary-button)]/20" />
      </div>
    </div>
    <div className="h-[240px] sm:h-[320px] md:h-full md:w-[40%] lg:w-[45%] relative">
      <Skeleton className="h-full w-full rounded-none bg-[var(--primary-text)]/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-text)]/10 to-transparent" />
    </div>
  </div>
);

// --- Component ---
function DetailsModal({ open, onOpenChange, story, loading = false, onStart }) {
  // Fix the "blink" bug by keeping a local version of the story data
  const [displayStory, setDisplayStory] = useState(story);

  // Sync state with props during render if story exists and is different
  // This pattern is the idiomatic React way to sync props to state and avoids the useEffect lint warning
  if (story && story !== displayStory) {
    setDisplayStory(story);
  }

  // Use displayStory for rendering to ensure content stays stable during closing animation
  const currentStory = open ? story || displayStory : displayStory;

  const title = currentStory?.title || "تحميل تفاصيل الرواية...";
  const cover = currentStory?.coverImageUrl || "";
  const genre = currentStory?.genre || "قصة تفاعلية";
  
  // Build a dynamic description from constitution if description is missing
  const constitution = currentStory?.constitution;
  const description = currentStory?.description || (constitution ? 
    `${constitution.coreTheme || ""} ${constitution.settingPlace ? `في ${constitution.settingPlace}.` : ""} ${constitution.tone ? `تمتاز هذه القصة بأسلوب ${constitution.tone}.` : ""}`.trim() : 
    "");

  const lensLabel = formatLens(currentStory?.lens);
  const lensStyle = getLensStyle(currentStory?.lens);
  const sceneCount = currentStory?.sceneCount ?? "0";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="
          font-arabic
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[200]
          w-[95vw] sm:w-[92vw] 
          sm:max-w-[550px] md:max-w-[85vw] lg:max-w-[1000px] xl:max-w-[1100px]
          p-0 gap-0 
          bg-white/95 backdrop-blur-[40px]
          border border-[var(--primary-border)]/10 shadow-[0_40px_100px_rgba(0,0,0,0.2)]
          rounded-[2rem] md:rounded-[3rem] overflow-hidden 
          flex flex-col h-auto max-h-[95vh] md:max-h-[90vh]
          focus:outline-none outline-none ring-0
        "
      >
        {/* --- Close Button --- */}
        <div className="absolute top-3 left-3 md:top-6 md:left-6 z-50">
          <button
            onClick={() => onOpenChange?.(false)}
            className="
              group flex items-center justify-center w-8 h-8 md:w-11 md:h-11
              rounded-full bg-white/80 backdrop-blur-md hover:bg-white
              shadow-sm hover:shadow-md transition-all duration-300 
              border border-black/5 text-[var(--primary-text)]
            "
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
          </button>
        </div>

        {loading ? (
          <DetailsModalSkeleton />
        ) : (
          <div className="flex flex-col-reverse md:flex-row h-full max-h-[95vh] md:max-h-none md:min-h-[500px] md:h-[600px] lg:h-[680px] overflow-y-auto md:overflow-hidden">
            {/* --- Content Body --- */}
            <div className="flex-1 flex flex-col min-h-0 bg-white/80">
              <div className="p-5 sm:p-8 md:p-10 lg:p-14 flex flex-col h-full">
                {/* Header */}
                <DialogHeader className="space-y-4 md:space-y-6 mb-4 md:mb-8 text-right items-start">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[var(--primary-text)]/40 bg-white/50 px-4 py-2 rounded-full border border-black/5 shadow-sm">
                      <Sparkles className="w-3 h-3 text-[var(--primary-button)]" />
                      رواية تفاعلية
                    </span>
                  </div>

                  <DialogTitle className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-[var(--primary-text)] leading-tight text-right w-full tracking-tight">
                    {title}
                  </DialogTitle>

                  {/* Meta Tags Row */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-1">
                    <div
                      className={`flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-xl border text-[11px] md:text-[13px] font-black uppercase tracking-wide shadow-sm transition-all ${lensStyle}`}
                    >
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" />
                      <span>{lensLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-xl bg-white/50 border border-black/5 text-[var(--primary-text)] text-[11px] md:text-[13px] font-black uppercase tracking-wide shadow-sm">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80 text-[var(--primary-button)]" />
                      <span>{sceneCount} مشهد</span>
                    </div>
                  </div>
                </DialogHeader>

                {/* Description - More readable sizing */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-6 min-h-[100px] md:min-h-0">
                  <DialogDescription className="text-sm sm:text-base md:text-xl text-[var(--primary-text)]/70 leading-relaxed text-right font-bold">
                    {description}
                  </DialogDescription>
                </div>

                {/* Footer Action */}
                <div className="pt-8 mt-auto border-t border-[var(--primary-border)]/10 flex items-center justify-between gap-4 md:gap-8">
                  <div className="hidden sm:block text-right">
                    <p className="text-[14px] text-[var(--primary-text)] font-black uppercase tracking-tight">
                      جاهز للاستكشاف؟
                    </p>
                    <p className="text-[12px] text-[var(--primary-text)] opacity-40">
                      سيتم حفظ تقدمك تلقائياً
                    </p>
                  </div>

                  <Button
                    onClick={() => onStart?.(currentStory)}
                    disabled={loading || !currentStory}
                    className="
                      flex-1 sm:flex-none sm:min-w-[200px] md:min-w-[280px] h-12 md:h-18 rounded-2xl
                      bg-gradient-to-r from-[#5de3ba] to-[#76debf] hover:opacity-90
                      text-white shadow-[0_15px_30px_rgba(93,227,186,0.3)]
                      text-lg font-black uppercase tracking-tight
                      flex items-center justify-center gap-3
                      transition-all duration-300 active:scale-[0.98]
                      hover:-translate-y-1 border-0
                    "
                  >
                    <span>ابدأ الرحلة</span>
                    <Play className="w-5 h-5 fill-current" />
                  </Button>
                </div>
              </div>
            </div>

            {/* --- Hero Image Section --- */}
            <div className="relative h-[200px] sm:h-[280px] md:h-full md:w-[38%] lg:w-[42%] shrink-0 group overflow-hidden bg-gray-50 border-b md:border-b-0 md:border-l border-black/5 flex items-center justify-center">
              {cover ? (
                <img
                  src={cover}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="text-[var(--primary-text)] opacity-10">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-black/5" />

              {/* Badge (Genre) */}
              <div className="absolute top-3 right-3 md:top-8 md:right-8">
                <span
                  className="
                    inline-flex items-center gap-2
                    px-4 md:px-6 py-2 md:py-3 rounded-xl
                    bg-white/95 text-[var(--primary-text)]
                    text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-2xl
                    border border-black/5
                    backdrop-blur-md
                  "
                >
                  <Layers className="w-4 h-4 text-[var(--primary-button)]" />
                  {genre}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DetailsModal;
