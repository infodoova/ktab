import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, Eye, Play, X, Sparkles, Clock, User } from "lucide-react";

const LENS_LABELS = {
  POLITICAL: "سياسي",
  PSYCHOLOGICAL: "نفسي",
  SURVIVAL: "بقاء",
  MORAL: "أخلاقي",
};

const LENS_COLORS = {
  POLITICAL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PSYCHOLOGICAL: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  SURVIVAL: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  MORAL: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DEFAULT: "bg-white/5 text-white/40 border-white/10",
};

function formatLens(lens) {
  if (!lens) return "غير محدد";
  return LENS_LABELS[lens] ?? String(lens);
}

function getLensStyle(lens) {
  return LENS_COLORS[lens] || LENS_COLORS.DEFAULT;
}

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
          <Skeleton className="h-5 w-40 rounded-md bg-white/5" />
          <Skeleton className="h-4 w-28 rounded-md bg-white/5" />
        </div>
        <Skeleton className="h-16 w-full sm:w-56 rounded-2xl bg-[var(--primary-button)]/20" />
      </div>
    </div>
    <div className="w-full md:w-[45%] lg:w-[42%] h-72 sm:h-96 md:h-full bg-[var(--primary-text)]/5" />
  </div>
);

export function StoryDetailsModal({
  isOpen,
  onClose,
  story,
  loading = false,
  onStartSession,
}) {
  if (!story && !loading) return null;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        dir="rtl"
        className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl h-[90vh] md:h-[80vh] p-0 overflow-hidden bg-black/95 text-white border-white/10 shadow-2xl rounded-3xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{story?.title || "تفاصيل القصة"}</DialogTitle>
          <DialogDescription>
            {story?.description || "عرض تفاصيل القصة التفاعلية والخيارات المتاحة"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <DetailsModalSkeleton />
        ) : (
          <div className="flex flex-col-reverse md:flex-row h-full w-full">
            {/* Left Content Area */}
            <div className="flex-1 flex flex-col p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6 custom-scrollbar">
              {/* Header Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-[#5de3ba]/10 text-[#5de3ba] border border-[#5de3ba]/20 font-black text-xs uppercase tracking-widest">
                    {story?.genre || "قصة تفاعلية"}
                  </span>
                  {story?.lens && (
                    <span
                      className={`px-4 py-1.5 rounded-full border font-bold text-xs uppercase tracking-widest ${getLensStyle(
                        story.lens
                      )}`}
                    >
                      {formatLens(story.lens)}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  {story?.title}
                </h2>

                {story?.authorName && (
                  <div className="flex items-center gap-2 text-white/50 font-bold text-sm">
                    <User size={16} />
                    <span>تأليف: {story.authorName}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 flex-1">
                <h3 className="text-sm font-black text-white/40 uppercase tracking-widest">
                  نبذة عن القصة
                </h3>
                <p className="text-white/70 text-base leading-relaxed">
                  {story?.description || "لا يوجد وصف متاح لهذه القصة التفاعلية."}
                </p>
              </div>

              {/* Action Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                <Button
                  onClick={() => onStartSession?.(story?.id)}
                  className="btn-premium flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase text-sm tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  <Play size={18} strokeWidth={2.5} />
                  ابدأ المغامرة الآن
                </Button>
              </div>
            </div>

            {/* Right Cover Area */}
            <div className="w-full md:w-[42%] h-64 md:h-full relative overflow-hidden bg-white/5">
              <img
                src={story?.coverImageUrl}
                alt={story?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default StoryDetailsModal;
