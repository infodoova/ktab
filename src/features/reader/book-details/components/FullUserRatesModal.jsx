import React from "react";
import { Star, X, Loader2 } from "lucide-react";

/**
 * Pure presentation modal for browsing all user reviews.
 * Receives reviews and loading state via props.
 */
export function FullUserRatesModal({ isOpen, onClose, reviews = [], loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="bg-[#0d0d0d] w-full max-w-3xl max-h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/10 relative"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#5de3ba] to-[#76debf] shadow-lg">
              <Star size={24} className="text-white fill-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                جميع آراء وتقييمات القراء
              </h3>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-0.5">
                تجارب حقيقية ({reviews.length} تقييم)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all active:scale-90"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#5de3ba]">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                جاري جلب الآراء...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg font-bold">لا توجد مراجعات مسجلة حتى الآن.</p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <div
                key={review.id || index}
                className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white">
                      {review.userName?.[0] || "ق"}
                    </div>
                    <span className="font-bold text-sm text-white">{review.userName || "قارئ كِتَاب"}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 text-xs text-yellow-500 font-black">
                    <Star size={14} className="fill-yellow-500" />
                    <span>{review.rating || review.rate || 5}</span>
                  </div>
                </div>

                <p className="text-white/70 text-sm leading-relaxed pr-13">
                  {review.comment || "مراجعة مميزة..."}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FullUserRatesModal;
