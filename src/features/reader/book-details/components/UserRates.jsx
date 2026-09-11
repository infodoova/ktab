import React from "react";
import { Star, Quote, ArrowLeft } from "lucide-react";

/**
 * Pure presentation component for Reader book ratings and reviews list.
 * Receives reviews, loading state, and modal trigger via props.
 */
export function UserRates({
  reviews = [],
  loading = false,
  onOpenFullModal,
}) {
  if (loading) {
    return (
      <div className="space-y-4 pt-10" dir="rtl">
        <h3 className="text-xl font-bold text-white tracking-tight">آراء القراء</h3>
        <p className="text-white/40 text-xs font-bold">جاري تحميل التقييمات...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="space-y-8 pt-12 border-t border-white/5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#5de3ba]/15 text-[#5de3ba]">
            <Quote size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">أحدث آراء القراء</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-0.5">
              تجارب ومراجعات
            </p>
          </div>
        </div>

        {reviews.length >= 3 && onOpenFullModal && (
          <button
            onClick={onOpenFullModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold transition-all border border-white/5 active:scale-95"
          >
            <span>عرض كل التقييمات</span>
            <ArrowLeft size={16} />
          </button>
        )}
      </div>

      {/* Reviews Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((review, i) => (
          <div
            key={review.id || i}
            className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-white">{review.userName || "قارئ كِتَاب"}</span>
                <div className="flex items-center gap-1 text-xs font-black text-yellow-500">
                  <Star size={14} className="fill-yellow-500" />
                  <span>{review.rating || review.rate || 5}</span>
                </div>
              </div>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-3">
                {review.comment || "مراجعة رائعة لهذا الكتاب..."}
              </p>
            </div>

            {review.createdAt && (
              <span className="text-[10px] text-white/30 font-bold block">
                {new Date(review.createdAt).toLocaleDateString("ar-EG")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserRates;
