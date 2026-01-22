import React, { useState, useEffect, useCallback } from "react";
import {
  Share2,
  BookOpen,
  Star,
  Download,
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
        url: `${
          import.meta.env.VITE_API_URL
        }/reader/books/${bookId}/isReviewed`,
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
        // Checks: 1. Direct ID, 2. '_id', 3. 'reviewId', 4. Nested 'review.id'
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
          url: `${
            import.meta.env.VITE_API_URL
          }/reader/books/${bookId}/reviews/${reviewId}`,
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
        // 1. Refresh Book Stats (stars count)
        fetchBookDetails();

        // 2. CRITICAL FIX: Refresh Review State
        // This ensures we get the real ID from the server immediately after a POST,
        // so the next time the user clicks submit, it counts as a PATCH.
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
        url: `${
          import.meta.env.VITE_API_URL
        }/reader/books/${bookId}/reviews/${reviewId}`,
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
  const encryptLink = (text) => {
    try {
      return btoa(encodeURIComponent(text));
    } catch {
      return text;
    }
  };

  const generateEncryptedShareUrl = () => {
    const original = window.location.href;
    const encrypted = encryptLink(original);
    return `${window.location.origin}/share?r=${encrypted}`;
  };

  const handleShare = async () => {
    const shareUrl = generateEncryptedShareUrl();
    try {
      if (navigator.share) {
        await navigator.share({ title: bookData?.title, url: shareUrl });
        return;
      }
    } catch {
      //
    }
    await navigator.clipboard.writeText(shareUrl);
    AlertToast("✔ تم نسخ الرابط المشفّر!", "success");
  };

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
    return <div className="text-center py-10">جارٍ التحميل...</div>;
  }

  const filledStars = Math.round(bookData.averageRating);

  return (
    <div className="w-full animate-fade-in-up">
      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
        {/* COVER */}
        <div className="w-full max-w-[320px] md:w-1/3 lg:w-1/4 mx-auto md:mx-0 group">
          <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative p-4 bg-gray-50 flex items-center justify-center">
            <img
              src={bookData.coverImageUrl}
              alt={bookData.title}
              className="w-full h-full object-cover rounded-[2rem] group-hover:scale-105 transition duration-700 shadow-md"
            />
          </div>
        </div>

        {/* INFO */}
        <div className="flex-1 space-y-8 md:pt-4 text-center md:text-right">
          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-black text-[var(--primary-text)] tracking-tighter">
            {bookData.title}
          </h1>

          {/* STARS */}
          <div className="flex justify-center md:justify-start items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i <= filledStars
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-black/5"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-text)]/40 px-3 border-l border-black/10">
              {bookData.totalReviews} مراجعة لقرائنا
            </span>
          </div>

          {/* DESCRIPTION */}
          {bookData.description && (
            <p className="text-[var(--primary-text)]/60 text-xl max-w-3xl line-clamp-4 font-black tracking-tight leading-relaxed cursor-pointer hover:line-clamp-none transition-all">
              {bookData.description}
            </p>
          )}

          {/* TAGS */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {bookData.genre && (
              <span className="bg-gray-50 border border-black/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/40">
                {bookData.genre}
              </span>
            )}
            {bookData.subgenre && (
              <span className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {bookData.subgenre}
              </span>
            )}
            {bookData.language && (
              <span className="bg-gray-50 border border-black/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/40">
                {bookData.language}
              </span>
            )}
            {bookData.pageCount && (
              <span className="bg-gray-50 border border-black/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/40">
                {bookData.pageCount} صفحة
              </span>
            )}
            {bookData.ageRangeMin && bookData.ageRangeMax && (
              <span className="bg-gray-50 border border-black/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/40">
                العمر: {bookData.ageRangeMin}–{bookData.ageRangeMax}
              </span>
            )}
            {bookData.hasAudio && (
              <span className="bg-[var(--primary-button)]/10 text-[var(--primary-button)] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Headphones className="w-4 h-4" /> نسخة صوتية
              </span>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-10">
            <Button
              onClick={() => navigate(`/reader/display/${bookData.id}`)}
              className="w-full sm:w-auto px-12 h-16 text-[11px] font-black uppercase tracking-widest btn-premium text-white rounded-[1.25rem] transition-all active:scale-95 border-0"
            >
              <BookOpen className="w-6 h-6 ml-3" strokeWidth={3} /> قراءة الآن
            </Button>

            <div className="flex gap-4">
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center bg-white transition-all shadow-sm
      ${
        isReviewed
          ? "border-yellow-400 text-yellow-500 bg-yellow-400/5"
          : "border-black/10 text-black hover:border-black/20"
      }
    `}
              >
                <Star className={`w-6 h-6 ${isReviewed ? 'fill-yellow-400' : ''}`} strokeWidth={2.5} />
              </button>

              <button
                onClick={toggleAssignBook}
                disabled={isAssignLoading}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center bg-white transition-all shadow-sm
      ${
        isAssigned
          ? "border-[#5de3ba] text-[#5de3ba] bg-[#5de3ba]/5"
          : "border-black/10 text-black hover:border-black/20"
      } ${isAssignLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <BookPlus className="w-6 h-6" strokeWidth={2.5} />
              </button>

              {bookData.pdfDownloadUrl && (
                <button
                  onClick={() => window.open(bookData.pdfDownloadUrl, "_blank")}
                  className="w-14 h-14 rounded-2xl border border-black/10 flex items-center justify-center bg-white text-black hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <Download className="w-6 h-6" strokeWidth={2.5} />
                </button>
              )}

              <button
                onClick={handleShare}
                className="w-14 h-14 rounded-2xl border border-black/10 flex items-center justify-center bg-white text-black hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <Share2 className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RATING MODAL */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-[40px] rounded-[3rem] p-10 w-full max-w-md shadow-[0_40px_100px_rgba(0,0,0,0.2)] relative text-center border border-black/10 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0">
            <button
              onClick={() => setIsRatingModalOpen(false)}
              className="absolute top-8 left-8 text-black/20 hover:text-red-500 transition-colors"
            >
              <X className="w-6 h-6" strokeWidth={3} />
            </button>

            <h2 className="text-3xl font-black text-[var(--primary-text)] mb-8 tracking-tighter">
              ما رأيك في الكتاب؟
            </h2>

            <div className="flex justify-center gap-4 mb-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  onClick={() => setUserRating(i)}
                  className={`w-12 h-12 cursor-pointer transition-all hover:scale-110 ${
                    i <= userRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-black/5"
                  }`}
                />
              ))}
            </div>

            <textarea
              className="w-full h-40 p-6 rounded-[1.5rem] border border-black/10 bg-gray-50/50 text-[var(--primary-text)] font-black tracking-tight focus:ring-4 focus:ring-[var(--primary-button)]/10 focus:border-[var(--primary-button)] outline-none resize-none text-right placeholder:text-black/10 text-lg mb-8"
              placeholder="اكتب مراجعتك هنا..."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
            />

            <div className="space-y-4">
              <Button
                onClick={handleSubmitReview}
                className="w-full h-16 btn-premium text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 border-0"
              >
                {isReviewed ? "تعديل المراجعة" : "تأكيد التقييم"}
              </Button>

              {isReviewed && (
                <button
                  onClick={handleDeleteReview}
                  className="w-full h-12 text-xs font-black text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  حذف التقييم
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
