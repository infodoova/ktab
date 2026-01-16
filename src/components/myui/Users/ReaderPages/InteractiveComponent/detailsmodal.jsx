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
  POLITICAL: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]",
  PSYCHOLOGICAL: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]",
  SURVIVAL: "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]",
  MORAL: "bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]",
  DEFAULT:
    "bg-[var(--earth-cream)] text-[var(--earth-brown)] border-[var(--earth-sand)]",
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
        <Skeleton className="h-7 w-36 rounded-full bg-[var(--earth-sand)]/20" />
        <div className="space-y-3">
          <Skeleton className="h-12 md:h-16 w-full rounded-2xl bg-[var(--earth-sand)]/30" />
          <Skeleton className="h-12 md:h-16 w-2/3 rounded-2xl bg-[var(--earth-sand)]/30" />
        </div>
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-10 w-28 rounded-xl bg-[var(--earth-sand)]/20" />
          <Skeleton className="h-10 w-28 rounded-xl bg-[var(--earth-sand)]/20" />
        </div>
      </div>
      <div className="flex-1 space-y-4 pt-4">
        <Skeleton className="h-4 w-full rounded-md bg-[var(--earth-sand)]/15" />
        <Skeleton className="h-4 w-full rounded-md bg-[var(--earth-sand)]/15" />
        <Skeleton className="h-4 w-full rounded-md bg-[var(--earth-sand)]/15" />
        <Skeleton className="h-4 w-5/6 rounded-md bg-[var(--earth-sand)]/15" />
        <Skeleton className="h-4 w-4/6 rounded-md bg-[var(--earth-sand)]/15" />
      </div>
      <div className="pt-10 border-t border-[var(--earth-sand)]/40 flex items-center justify-between">
        <div className="hidden sm:flex flex-col gap-2">
          <Skeleton className="h-5 w-40 rounded-md bg-[var(--earth-sand)]/20" />
          <Skeleton className="h-4 w-52 rounded-md bg-[var(--earth-sand)]/10" />
        </div>
        <Skeleton className="h-14 md:h-16 w-full sm:w-[260px] rounded-2xl bg-[var(--earth-olive)]/20" />
      </div>
    </div>
    <div className="h-[240px] sm:h-[320px] md:h-full md:w-[40%] lg:w-[45%] relative">
      <Skeleton className="h-full w-full rounded-none bg-[var(--earth-sand)]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--earth-brown)]/10 to-transparent" />
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
  const cover = currentStory?.cover || "";
  const genre = currentStory?.genre || "قصة تفاعلية";
  const description =
    currentStory?.description ||
    "انطلق في رحلة غامرة عبر عوالم نسجتها خيالات المبدعين، حيث كل قرار تتخذه يشكل مسار القصة ويغير مصير أبطالها. اكتشف أسراراً دفينة، واجه تحديات أخلاقية معقدة، واستمتع بتجربة سردية تفاعلية فريدة تمزج بين الأدب الكلاسيكي وتقنيات الذكاء الاصطناعي الحديثة. هل أنت مستعد لكتابة فصلك الخاص؟";
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
          w-[95vw] sm:w-[92vw] 
          sm:max-w-[550px] md:max-w-[85vw] lg:max-w-[1000px] xl:max-w-[1100px]
          p-0 gap-0 
          bg-[var(--earth-paper)]/85 backdrop-blur-xl
          border border-[var(--earth-sand)]/50 shadow-[0_20px_60px_var(--earth-shadow)]
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
              rounded-full bg-white/90 hover:bg-[var(--earth-cream)]
              shadow-md hover:shadow-lg transition-all duration-300 
              border border-[var(--earth-sand)] text-[var(--earth-brown)]
            "
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>
        </div>

        {loading ? (
          <DetailsModalSkeleton />
        ) : (
          <div className="flex flex-col-reverse md:flex-row h-full max-h-[95vh] md:max-h-none md:min-h-[500px] md:h-[600px] lg:h-[680px] overflow-y-auto md:overflow-hidden">
            {/* --- Content Body --- */}
            <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-[#FCFAF8] to-[var(--earth-cream)]/40">
              <div className="p-5 sm:p-8 md:p-10 lg:p-14 flex flex-col h-full">
                {/* Header */}
                <DialogHeader className="space-y-3 md:space-y-5 mb-4 md:mb-8 text-right items-start">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-[10px] md:text-[12px] font-bold text-[var(--earth-brown)] bg-[var(--earth-cream)] px-3 py-1.5 rounded-full border border-[var(--earth-sand)] shadow-sm">
                      <Sparkles className="w-3 h-3 text-[var(--earth-olive)]" />
                      رواية تفاعلية
                    </span>
                  </div>

                  <DialogTitle className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-[var(--earth-brown-dark)] leading-tight text-right w-full tracking-tight">
                    {title}
                  </DialogTitle>

                  {/* Meta Tags Row */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-1">
                    <div
                      className={`flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-xl border text-[11px] md:text-[14px] font-bold shadow-sm ${lensStyle}`}
                    >
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" />
                      <span>{lensLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-xl bg-white/60 border border-[var(--earth-sand)] text-[var(--earth-brown)] text-[11px] md:text-[14px] font-bold shadow-sm">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80 text-[var(--earth-olive)]" />
                      <span>{sceneCount} مشهد</span>
                    </div>
                  </div>
                </DialogHeader>

                {/* Description - More readable sizing */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-6 min-h-[100px] md:min-h-0">
                  <DialogDescription className="text-sm sm:text-base md:text-xl text-[var(--earth-brown)]/90 leading-relaxed text-right font-medium">
                    {description}
                  </DialogDescription>
                </div>

                {/* Footer Action */}
                <div className="pt-4 md:pt-8 mt-auto border-t border-[var(--earth-sand)]/60 flex items-center justify-between gap-4 md:gap-8">
                  <div className="hidden sm:block text-right">
                    <p className="text-[12px] md:text-[14px] text-[var(--earth-brown-dark)] font-bold">
                      جاهز للاستكشاف؟
                    </p>
                    <p className="text-[10px] md:text-[12px] text-[var(--earth-brown)] opacity-70">
                      سيتم حفظ تقدمك تلقائياً
                    </p>
                  </div>

                  <Button
                    onClick={() => onStart?.(currentStory)}
                    disabled={loading || !currentStory}
                    className="
                      flex-1 sm:flex-none sm:min-w-[200px] md:min-w-[240px] h-11 md:h-16 rounded-xl md:rounded-2xl
                      bg-[var(--earth-olive)] hover:bg-[var(--earth-olive-dark)]
                      text-white shadow-lg shadow-[var(--earth-olive)]/20
                      text-base md:text-lg font-bold
                      flex items-center justify-center gap-3
                      transition-all duration-300 active:scale-[0.98]
                      hover:-translate-y-0.5
                    "
                  >
                    <span>ابدأ الرحلة</span>
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  </Button>
                </div>
              </div>
            </div>

            {/* --- Hero Image Section --- */}
            <div className="relative h-[200px] sm:h-[280px] md:h-full md:w-[38%] lg:w-[42%] shrink-0 group overflow-hidden bg-[var(--earth-cream)] border-b md:border-b-0 md:border-l border-[var(--earth-sand)]">
              <img
                src={cover}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-[5s] ease-out group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay with Earth Brown tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--earth-brown-dark)]/40 via-transparent to-transparent md:bg-[var(--earth-brown-dark)]/5" />

              {/* Badge (Genre) */}
              <div className="absolute top-3 right-3 md:top-8 md:right-8">
                <span
                  className="
                    inline-flex items-center gap-2
                    px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl
                    bg-white/95 text-[var(--earth-brown-dark)]
                    text-[10px] md:text-[13px] font-bold shadow-xl
                    border border-[var(--earth-sand)]
                    backdrop-blur-sm
                  "
                >
                  <Layers className="w-3 h-3 md:w-4 md:h-4 text-[var(--earth-olive)]" />
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
