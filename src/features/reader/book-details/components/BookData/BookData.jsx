import React from "react";
import {
  BookOpen,
  Star,
  Headphones,
  X,
  BookPlus,
  User,
} from "lucide-react";


/**
 * Pure presentation component for Book hero data, stats, and rating modal.
 */
export function BookData({
  bookData,
  loadingBook,
  isRatingModalOpen,
  setIsRatingModalOpen,
  userRating,
  setUserRating,
  userReview,
  setUserReview,
  isReviewed,
  isAssigned,
  isAssignLoading,
  isDescriptionExpanded,
  setIsDescriptionExpanded,
  onSubmitReview,
  onDeleteReview,
  onToggleAssign,
  navigate,
}) {

  if (loadingBook) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[var(--primary-button)]">
        <div className="w-12 h-12 border-2 border-[var(--primary-button)]/20 border-t-[var(--primary-button)] rounded-full animate-spin mb-4" />
        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
          جاري تحميل بيانات العمل...
        </p>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="text-center py-20 text-white/40 font-bold">
        تعذر العثور على بيانات هذا الكتاب.
      </div>
    );
  }

  const {
    id,
    title,
    description,
    genre,
    subgenre,
    language,
    pageCount,
    ageRangeMin,
    ageRangeMax,
    hasAudio,
    averageRating,
    totalReviews,
    coverImageUrl,
    authorName,
  } = bookData;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20 pt-4" dir="rtl">
      {/* 1. Cover Poster Card */}
      <div className="w-full max-w-[340px] sm:max-w-[400px] lg:w-[460px] shrink-0">
        <div className="relative group">
          <div className="aspect-[3/4.4] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative">
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Action Overlay */}
          <div className="absolute -bottom-6 inset-x-6 flex items-center gap-3">
            <button
              onClick={() => navigate(`/reader/display/${id}`)}
              className="flex-1 btn-premium h-14 rounded-2xl flex items-center justify-center gap-3 text-white font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
            >
              <BookOpen size={18} strokeWidth={2.5} />
              ابدأ القراءة
            </button>

            <button
              onClick={onToggleAssign}
              disabled={isAssignLoading}
              className={`h-14 w-14 rounded-2xl border flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                isAssigned
                  ? "bg-[#5de3ba] border-[#5de3ba] text-black"
                  : "bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-white/10"
              }`}
              aria-label="المفضلة"
            >
              <BookPlus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metadata & Details */}
      <div className="flex-1 space-y-8 text-right w-full">
        {/* Title & Author */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {genre && (
              <span className="px-4 py-1.5 rounded-full bg-[#5de3ba]/10 text-[#5de3ba] border border-[#5de3ba]/20 font-black text-xs uppercase tracking-widest">
                {genre}
              </span>
            )}
            {subgenre && (
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-bold text-xs uppercase tracking-normal">
                {subgenre}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-normal leading-tight">
            {title}
          </h1>

          {authorName && (
            <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
              <User size={16} />
              <span>تأليف: {authorName}</span>
            </div>
          )}
        </div>

        {/* Rating and Reviews Quick Stats */}
        <div className="flex items-center gap-6 py-4 border-y border-white/10">
          <div className="flex items-center gap-2">
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-black text-white">
              {Number(averageRating).toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400">
              ({totalReviews} تقييم)
            </span>
          </div>

          <button
            onClick={() => setIsRatingModalOpen(true)}
            className="text-xs font-black uppercase tracking-normal text-[#5de3ba] hover:underline"
          >
            {isReviewed ? "تعديل تقييمك" : "أضف تقييمك"}
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-normal text-slate-400 block mb-1">
              عدد الصفحات
            </span>
            <span className="text-lg font-black text-white">{pageCount || "--"}</span>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-normal text-slate-400 block mb-1">
              اللغة
            </span>
            <span className="text-lg font-black text-white">{language || "العربية"}</span>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-normal text-slate-400 block mb-1">
              الفئة العمرية
            </span>

            <span className="text-lg font-black text-white">
              {ageRangeMin ? (ageRangeMax && ageRangeMax < 99 ? `${ageRangeMin}-${ageRangeMax}` : `+${ageRangeMin}`) : "+12"}
            </span>
          </div>


          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
              نسخة صوتية
            </span>
            <span className="text-lg font-black text-[#5de3ba] flex items-center justify-center gap-1">
              {hasAudio ? <Headphones size={16} /> : "غير متوفر"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-white tracking-tight">عن الكتاب</h3>
          <p
            className={`text-white/70 text-base leading-relaxed ${
              !isDescriptionExpanded ? "line-clamp-4" : ""
            }`}
          >
            {description || "لا يوجد وصف متاح لهذا الكتاب حالياً."}
          </p>
          {description && description.length > 200 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-xs font-bold text-[#5de3ba] hover:underline"
            >
              {isDescriptionExpanded ? "عرض أقل" : "قراءة المزيد"}
            </button>
          )}
        </div>
      </div>

      {/* Rating & Review Dialog */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-right">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white">
                {isReviewed ? "تعديل تقييمك" : "أضف تقييمك للكتاب"}
              </h3>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stars Selector */}
            <div className="flex justify-center items-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= userRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment Input */}
            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="اكتب انطباعك ورأيك حول هذا الكتاب..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 outline-none focus:border-[#5de3ba] transition-colors resize-none"
            />

            <div className="flex items-center justify-between gap-4 pt-2">
              {isReviewed && (
                <button
                  variant="ghost"
                  onClick={onDeleteReview}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                >
                  حذف التقييم
                </button>
              )}
              <div className="flex items-center gap-3 mr-auto">
                <button
                  variant="ghost"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="text-white/40 hover:text-white rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  onClick={onSubmitReview}
                  className="btn-premium px-8 rounded-xl text-white font-bold"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookData;
