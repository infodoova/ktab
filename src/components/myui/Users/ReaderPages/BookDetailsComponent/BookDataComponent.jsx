import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Star,
  Headphones,
  X,
  BookPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getUserData } from "../../../../../../store/authToken";
import {
  getHelper,
  postHelper,
  deleteHelper,
  patchHelper,
} from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";

export default function BookDataComponent({ bookId, navigate }) {
  const [bookData, setBookData] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);

  // Review state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  // Assignment toggle
  const [isAssigned, setIsAssigned] = useState(false);
  const [isAssignLoading, setIsAssignLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // ============================
  // 1. FETCH BOOK DETAILS
  // ============================
  const fetchBookDetails = useCallback(async () => {
    if (!bookId) return;

    setLoadingBook(true);
    try {
      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/reader/viewBook/${bookId}`,
      });

      const b = res?.data ?? res;

      setBookData({
        id: b.id,
        title: b.title ?? "كتاب",
        description: b.description ?? "",
        genre: b.mainGenreName ?? null,
        subgenre: b.subGenreName ?? null,
        language: b.language ?? null,
        pageCount: b.pageCount ?? null,
        ageRangeMin: b.ageRangeMin ?? null,
        ageRangeMax: b.ageRangeMax ?? null,
        hasAudio: b.hasAudio ?? false,
        averageRating: b.averageRating ?? 0,
        totalReviews: b.totalReviews ?? 0,
        coverImageUrl: b.coverImageUrl ?? "",
        pdfDownloadUrl: b.pdfDownloadUrl ?? null,
      });
      if (res?.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      }
    } catch {
      AlertToast("تعذر تحميل بيانات الكتاب.", "ERROR");
    } finally {
      setLoadingBook(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId, fetchBookDetails]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [bookId]);

  // ============================
  // 2. FETCH REVIEW STATE (Reusable)
  // ============================
  const fetchReviewState = useCallback(async () => {
    const user = getUserData();
    if (!user.userId || !bookId) return;

    try {
      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/isReviewed`,
      });

      // Handle if res is the axios response or the data directly
      const data = res?.data ?? res;
      if (res?.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      }
      if (data?.reviewed) {
        setIsReviewed(true);

        // FIX: Deep search for the ID.
        const backendId =
          data.reviewId ||
          data.id ||
          data._id ||
          data.review?.id ||
          data.review?._id ||
          data.review?.reviewId;

        console.log("Found Review ID:", backendId); // Debug Log
        setReviewId(backendId);

        setUserRating(data.rating ?? 0);
        setUserReview(data.comment ?? "");
      } else {
        setIsReviewed(false);
        setReviewId(null);
      }
    } catch (err) {
      console.error("Error fetching review state:", err);
    }
  }, [bookId]);

  // Trigger review fetch on mount
  useEffect(() => {
    fetchReviewState();
  }, [fetchReviewState]);

  // ============================
  // 3. SUBMIT REVIEW
  // ============================
  const handleSubmitReview = async () => {
    const user = getUserData();
    if (!user?.userId || !bookId) return;

    if (userRating < 0 || userRating > 5) {
      AlertToast("التقييم يجب أن يكون بين 0 و 5.", "ERROR");
      return;
    }

    const payload = {
      rating: userRating,
      comment: userReview.trim(),
    };

    try {
      let response;

      console.log("Submitting...", { isReviewed, reviewId }); // Debug Log

      if (isReviewed && reviewId) {
        // PATCH
        response = await patchHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/reviews/${reviewId}`,
          body: payload,
        });
        if (response?.messageStatus !== "SUCCESS") {
          AlertToast(response?.message, response?.messageStatus);
          return;
        }
        AlertToast(response?.message, response?.messageStatus);
      } else {
        // POST
        response = await postHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/reviews`,
          body: payload,
        });
        if (response?.messageStatus !== "SUCCESS") {
          AlertToast(response?.message, response?.messageStatus);
          return;
        }
        AlertToast(response?.message, response?.messageStatus);
      }

      if (response?.messageStatus == "SUCCESS") {
        const wasReviewedBefore = isReviewed;
        setIsReviewed(true);
        setIsRatingModalOpen(false);

        AlertToast(
          response.message || wasReviewedBefore
            ? "✔ تم تعديل تقييمك."
            : "✔ تم إرسال تقييمك.",
          response.messageStatus || "success"
        );

        // Notify Listeners
        const savedReview =
          response?.data ?? response?.review ?? response ?? null;
        window.dispatchEvent(
          new CustomEvent("bookReviewChanged", {
            detail: {
              bookId: String(bookId),
              action: wasReviewedBefore ? "updated" : "created",
              review: savedReview,
              reviewId: reviewId, // Pass current ID if available
            },
          })
        );

        // REFRESH DATA
        fetchBookDetails();
        await fetchReviewState();
      } else {
        AlertToast("حدث خطأ أثناء حفظ التقييم.", "ERROR");
      }
    } catch (err) {
      console.error("Review Error:", err);
      AlertToast(err || "تعذر حفظ تقييمك.", err.messageStatus || "ERROR");
    }
  };

  // ============================
  // DELETE REVIEW
  // ============================
  const handleDeleteReview = async () => {
    const user = getUserData();
    if (!user?.userId || !reviewId || !bookId) return;

    try {
      const res = await deleteHelper({
        url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/reviews/${reviewId}`,
      });

      if (res?.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      } else {
        // Reset Local State
        setIsReviewed(false);
        setReviewId(null);
        setUserRating(0);
        setUserReview("");
        setIsRatingModalOpen(false);

        AlertToast(res?.message, res?.messageStatus);

        fetchBookDetails(); // Refresh stats

        window.dispatchEvent(
          new CustomEvent("bookReviewChanged", {
            detail: { bookId: String(bookId), action: "deleted", reviewId },
          })
        );
      }
    } catch {
      AlertToast("تعذر حذف تقييمك.", "ERROR");
    }
  };

  // ============================
  // OTHER HELPERS
  // ============================

  // Check Assignment
  useEffect(() => {
    const fetchAssignment = async () => {
      if (!bookId) return;
      try {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/library/isAssigned/${bookId}`,
        });
        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        let assigned = false;
        if (res === true) assigned = true;
        else if (res === false) assigned = false;
        else if (
          res?.data === true ||
          res?.assigned === true ||
          res?.isAssigned === true
        )
          assigned = true;
        else if (
          Array.isArray(res?.content) &&
          res.content.some((b) => b.id === bookId)
        )
          assigned = true;
        else if (
          Array.isArray(res) &&
          res.some &&
          res.some((b) => b?.id === bookId)
        )
          assigned = true;

        setIsAssigned(assigned);
      } catch {
        //
      }
    };
    fetchAssignment();
  }, [bookId]);

  const toggleAssignBook = async () => {
    if (!bookId) return;
    const previous = isAssigned;
    setIsAssigned(!previous);
    setIsAssignLoading(true);

    try {
      if (!previous) {
        const res = await postHelper({
          url: `${import.meta.env.VITE_API_URL}/library/assignBook`,
          body: { bookId: bookId },
        });
        if (res?.messageStatus !== "SUCCESS") {
          setIsAssigned(previous);
          AlertToast(res?.message, res?.messageStatus);
        } else {
          setIsAssigned(true);
          AlertToast(res?.message, res?.messageStatus);
        }
      } else {
        const res = await deleteHelper({
          url: `${import.meta.env.VITE_API_URL}/library/removeBook/${bookId}`,
        });
        if (res?.messageStatus !== "SUCCESS") {
          setIsAssigned(previous);
          AlertToast(res?.message, res?.messageStatus);
        } else {
          setIsAssigned(false);
          AlertToast(res?.message, res?.messageStatus);
        }
      }
    } catch (err) {
      setIsAssigned(previous);
      console.error("Assign toggle error:", err);
      AlertToast(
        previous ? "تعذر الحذف" : "تعذر الإضافة",
        "شبكة — حاول مرة أخرى.",
        "ERROR"
      );
    } finally {
      setIsAssignLoading(false);
    }
  };

  if (loadingBook || !bookData) {
    return (
      <div className="flex items-center justify-center min-h-[500px] w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary-button)] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 animate-pulse">جارٍ تحميل بيانات الكتاب...</p>
        </div>
      </div>
    );
  }

  const filledStars = Math.round(bookData.averageRating);

  return (
    <div className="w-full relative" dir="rtl">
      
      {/* ========== SUBTLE BACKGROUND TEXTURE ========== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Subtle Top Glow */}
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--primary-button)] opacity-[0.03] blur-[150px] rounded-full" />
      </div>

      {/* ========== MOBILE HERO COVER (Top of page, mobile only) ========== */}
      {/* Starting from the absolute top of the screen by cancelling out parent padding and navigation offsets */}
      <div className="absolute -top-[176px] sm:-top-[176px] left-1/2 -translate-x-1/2 w-screen h-[550px] md:hidden overflow-hidden -z-10">
        <img
          src={bookData.coverImageUrl}
          alt={bookData.title}
          className="w-full h-full object-cover scale-110 opacity-70"
        />
        {/* Stronger Bottom & Top Shadow Gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        <div className="absolute inset-x-0 bottom-0 h-[380px] bg-gradient-to-t from-black via-black/95 to-transparent" />
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20 items-stretch md:items-start w-full py-6 md:py-12">
        
        {/* Top Header Wrapper (Row on mobile, contents on desktop) */}
        <div className="flex flex-row md:contents gap-4 sm:gap-8 items-start" dir="ltr">
          
          {/* ===== COVER IMAGE ===== */}
          <div className="relative w-[120px] sm:w-[160px] md:w-[260px] lg:w-[340px] xl:w-[380px] shrink-0 group">
            {/* Shadow Layer */}
            <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-black/50 to-black rounded-[1.5rem] md:rounded-[2rem] blur-2xl opacity-60 md:opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Image */}
            <div className="relative aspect-[2/3] rounded-xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform transition-transform duration-500 md:group-hover:scale-[1.02]">
              <img
                src={bookData.coverImageUrl}
                alt={bookData.title}
                className="w-full h-full object-cover"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* ===== MOBILE INFO (Right of cover) ===== */}
          <div className="flex-1 flex flex-col md:hidden gap-3 justify-between" dir="rtl">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white leading-[1.2] tracking-tight text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" dir="ltr">
                {bookData.title}
              </h1>
              
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 justify-end">
                <span className="bg-[var(--primary-button)] text-black px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide shadow-md">
                  {bookData.genre || "أدب"}
                </span>
                {bookData.subgenre && (
                  <span className="bg-black/60 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-[var(--primary-button)]/40 backdrop-blur-md shadow-lg">
                    {bookData.subgenre}
                  </span>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-end gap-2.5 bg-black/60 px-3 py-2 rounded-xl border border-[var(--primary-button)]/40 backdrop-blur-md w-fit mr-auto shadow-2xl">
              <span className="text-base font-black text-[var(--primary-button)] drop-shadow-md">{bookData.averageRating}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i <= filledStars ? "text-[var(--primary-button)] fill-[var(--primary-button)]" : "text-white/20"}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/60 font-bold">({bookData.totalReviews})</span>
            </div>
          </div>
        </div>

        {/* ===== MOBILE STATS GRID (Under Row Header) ===== */}
        <div className="grid grid-cols-3 gap-3 md:hidden w-full px-2 mt-4">
           <div className="bg-white/10 backdrop-blur-md border border-[var(--primary-button)]/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 shadow-xl">
              <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">اللغة</span>
              <span className="text-sm font-black text-white">{bookData.language || "العربية"}</span>
           </div>
           <div className="bg-white/10 backdrop-blur-md border border-[var(--primary-button)]/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 shadow-xl">
              <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">الصفحات</span>
              <span className="text-sm font-black text-white">{bookData.pageCount || "—"}</span>
           </div>
           <div className="bg-white/10 backdrop-blur-md border border-[var(--primary-button)]/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 shadow-xl">
              <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">الفئة</span>
              <span className="text-sm font-black text-white">+{bookData.ageRangeMin || "10"}</span>
           </div>
        </div>

        {/* ===== MAIN INFO CONTAINER (Desktop: Right Side, Mobile: Under Header) ===== */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right gap-6 md:gap-8 w-full px-2 md:px-0 mt-2 md:mt-0">
          
          {/* Genre Tags (Desktop Only) */}
          <div className="hidden md:flex flex-wrap items-center justify-start gap-3">
            <span className="bg-[var(--primary-button)] text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
              {bookData.genre || "أدب"}
            </span>
            {bookData.subgenre && (
              <span className="bg-white/10 text-white/70 px-5 py-2 rounded-full text-xs font-semibold border border-white/20 transition-colors hover:border-[var(--primary-button)]/30">
                {bookData.subgenre}
              </span>
            )}
            {bookData.hasAudio && (
              <span className="bg-black/40 text-[var(--primary-button)] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[var(--primary-button)]/20 backdrop-blur-sm shadow-md">
                <Headphones size={13.5} /> صوتي
              </span>
            )}
          </div>

          {/* Title (Desktop Only) */}
          <h1 className="hidden md:block text-4xl lg:text-5xl xl:text-7xl font-black text-white leading-[1.15] tracking-tight">
            {bookData.title}
          </h1>

          {/* Metadata Row (Desktop Style) */}
          <div className="hidden md:flex flex-wrap items-center justify-start gap-6 text-white/70">
            {/* Rating */}
            <div className="flex items-center gap-3 bg-white/[0.07] px-5 py-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-sm">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    strokeWidth={0}
                    className={i <= filledStars ? "text-[var(--primary-button)] fill-[var(--primary-button)]" : "text-white/10"}
                  />
                ))}
              </div>
              <span className="text-xl font-black text-white">{bookData.averageRating}</span>
              <span className="text-xs text-white/30 font-bold">({bookData.totalReviews} مراجعة)</span>
            </div>

            <div className="w-px h-5 bg-white/10" />

            {/* Page Count */}
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-white">{bookData.pageCount || "—"}</span>
              <span className="text-xs text-white/40 uppercase tracking-wider">صفحة</span>
            </div>

            <div className="w-px h-5 bg-white/10" />

            {/* Age */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/40 uppercase tracking-wider">الفئة</span>
              <span className="text-lg font-bold text-white">+{bookData.ageRangeMin || "10"}</span>
            </div>
          </div>

          {/* Description (Mobile & Desktop) */}
          <div className="space-y-4 md:space-y-6 w-full">
            <div className="flex items-center justify-center md:justify-start gap-4 md:hidden">
               <div className="h-px flex-1 bg-white/10" />
               <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">عن الكتاب</span>
               <div className="h-px flex-1 bg-white/10" />
            </div>
            <div 
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="relative group md:bg-transparent bg-white/[0.03] backdrop-blur-sm border border-transparent md:border-none md:p-0 p-5 rounded-3xl transition-all duration-300 cursor-pointer"
            >
              <p className={`text-base md:text-lg lg:text-xl text-white/70 md:text-white/50 leading-relaxed max-w-3xl group-hover:text-white transition-colors duration-300 ${isDescriptionExpanded ? "" : "line-clamp-6 md:line-clamp-5"}`}>
                {bookData.description || "استكشف هذا العمل الأدبي الفريد الذي يجمع بين الخيال والواقع في رحلة سردية مذهلة."}
              </p>
            </div>
          </div>

          {/* ===== DESKTOP ACTIONS ===== */}
          <div className="hidden md:flex items-center gap-6 pt-8">

            <button
              onClick={() => setIsRatingModalOpen(true)}
              className={`h-16 lg:h-[76px] px-8 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.03] active:scale-95 min-w-[100px]
                ${isReviewed 
                  ? "bg-[var(--primary-button)] text-black border-transparent shadow-lg" 
                  : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/10"
                }`}
            >
              <Star size={24} className={isReviewed ? "fill-black" : ""} strokeWidth={2.5} />
              <span className="font-bold text-sm uppercase tracking-wider hidden lg:block">{isReviewed ? "قيمت" : "تقييم"}</span>
            </button>

            <button
              onClick={toggleAssignBook}
              disabled={isAssignLoading}
              className={`h-16 lg:h-[76px] px-8 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.03] active:scale-95 min-w-[100px]
                ${isAssigned 
                  ? "bg-white text-black border-transparent shadow-lg" 
                  : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/10"
                } ${isAssignLoading ? "opacity-50" : ""}`}
            >
              <BookPlus size={24} strokeWidth={2.5} />
              <span className="font-bold text-sm uppercase tracking-wider hidden lg:block">{isAssigned ? "في المكتبة" : "للمكتبة"}</span>
            </button>

          </div>
        </div>
      </div>

      {/* ========== MOBILE STICKY ACTION BAR (Single Row) ========== */}
      <div className="fixed bottom-0 inset-x-0 z-[100] md:hidden">
        <div className="bg-black/95 backdrop-blur-lg border-t border-white/5 px-3 py-3">
          <div className="flex items-center gap-2">
            {/* Read Button */}

            {/* Rate Button */}
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 shrink-0
                ${isReviewed 
                  ? "bg-[var(--primary-button)] text-black border-transparent" 
                  : "bg-white/5 text-white/50 border-white/10"
                }`}
            >
              <Star size={20} className={isReviewed ? "fill-black" : ""} />
            </button>

            {/* Library Button */}
            <button
              onClick={toggleAssignBook}
              disabled={isAssignLoading}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 shrink-0
                ${isAssigned 
                  ? "bg-white text-black border-transparent" 
                  : "bg-white/5 text-white/50 border-white/10"
                } ${isAssignLoading ? "opacity-50" : ""}`}
            >
              <BookPlus size={20} />
            </button>

          </div>
        </div>
      </div>

      {/* ========== RATING MODAL ========== */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Top Accent */}
            <div className="h-1 bg-gradient-to-r from-transparent via-[var(--primary-button)] to-transparent" />

            <div className="p-6 md:p-8 relative">
              {/* Close Button */}
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
              >
                <X size={16} />
              </button>

              <div className="text-center pt-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--primary-button)]/10 flex items-center justify-center text-[var(--primary-button)] mb-5">
                  <Star size={26} className="fill-[var(--primary-button)]" />
                </div>

                <h2 className="text-2xl font-black text-white mb-1 tracking-tight">قيم تجربتك</h2>
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-6">{bookData.title}</p>

                {/* Stars */}
                <div className="flex justify-center gap-2.5 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setUserRating(i)}
                      className="transition-transform duration-200 hover:scale-110 active:scale-90"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          i <= userRating
                            ? "text-[var(--primary-button)] fill-[var(--primary-button)]"
                            : "text-white/10 hover:text-white/20"
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--primary-button)]/40 transition-all h-24 resize-none text-right mb-6"
                  placeholder="شارك رأيك..."
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                />

                {/* Submit */}
                <Button
                  onClick={handleSubmitReview}
                  className="w-full h-12 bg-[var(--primary-button)] text-black font-black uppercase text-xs tracking-widest rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  {isReviewed ? "تحديث التقييم" : "نشر التقييم"}
                </Button>

                {isReviewed && (
                  <button
                    onClick={handleDeleteReview}
                    className="mt-4 text-[10px] font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    حذف المراجعة
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

