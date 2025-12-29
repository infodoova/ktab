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
        <div className="w-full max-w-[280px] md:w-1/3 lg:w-1/4 mx-auto md:mx-0 group">
          <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-[#FEFCF8]/50 relative">
            <img
              src={bookData.coverImageUrl}
              alt={bookData.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
          </div>
        </div>

        {/* INFO */}
        <div className="flex-1 space-y-8 md:pt-4 text-center md:text-right">
          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl font-black text-[#3E2723]">
            {bookData.title}
          </h1>

          {/* STARS */}
          <div className="flex justify-center md:justify-start gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i <= filledStars
                    ? "text-[#DEC59E] fill-[yellow]"
                    : "text-[#D7CCC8]"
                }`}
              />
            ))}
            <span className="text-[#5D4037] font-medium">
              ({bookData.totalReviews} مراجعة)
            </span>
          </div>

          {/* DESCRIPTION */}
          {bookData.description && (
            <p className="text-[#5D4037] text-lg max-w-3xl line-clamp-4 font-medium cursor-pointer hover:line-clamp-none">
              {bookData.description}
            </p>
          )}

          {/* TAGS */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-semibold text-[#5D4037]">
            {bookData.genre && (
              <span className="bg-[#ECE7E3] px-3 py-1 rounded-xl">
                التصنيف: {bookData.genre}
              </span>
            )}
            {bookData.subgenre && (
              <span className="bg-[#ECE7E3] px-3 py-1 rounded-xl">
                التصنيف الفرعي: {bookData.subgenre}
              </span>
            )}
            {bookData.language && (
              <span className="bg-[#ECE7E3] px-3 py-1 rounded-xl">
                اللغة: {bookData.language}
              </span>
            )}
            {bookData.pageCount && (
              <span className="bg-[#ECE7E3] px-3 py-1 rounded-xl">
                {bookData.pageCount} صفحة
              </span>
            )}
            {bookData.ageRangeMin && bookData.ageRangeMax && (
              <span className="bg-[#ECE7E3] px-3 py-1 rounded-xl">
                الفئة العمرية: {bookData.ageRangeMin}–{bookData.ageRangeMax}
              </span>
            )}
            {bookData.hasAudio && (
              <span className="bg-[#606C38]/10 text-[#606C38] px-3 py-1 rounded-xl flex items-center gap-1">
                <Headphones className="w-4 h-4" /> نسخة صوتية
              </span>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <Button
              onClick={() => navigate(`/reader/display/${bookData.id}`)}
              className="w-full sm:w-auto px-10 h-14 text-lg font-bold bg-[#606C38] text-white rounded-xl hover:bg-[#3E4A20]"
            >
              <BookOpen className="w-6 h-6" /> قراءة الآن
            </Button>

            <div className="flex gap-3">
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#FEFCF8] transition
      ${
        isReviewed
          ? "border-[#B800D0] text-[#B800D0] shadow-[0_0_12px_rgba(184,0,208,0.5)]"
          : "border-[#D7CCC8] text-[#5D4037] hover:border-yellow-500 hover:text-yellow-500"
      }
    `}
              >
                <Star className="w-6 h-6" />
              </button>

              <button
                onClick={toggleAssignBook}
                disabled={isAssignLoading}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#FEFCF8] transition
      ${
        isAssigned
          ? "border-[#006A6A] text-[#006A6A] shadow-[0_0_10px_rgba(0,106,106,0.6)]"
          : "border-[#D7CCC8] text-[#5D4037] hover:border-green-500 hover:text-green-500"
      } ${isAssignLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <BookPlus className="w-6 h-6" />
              </button>

              {bookData.pdfDownloadUrl && (
                <button
                  onClick={() => window.open(bookData.pdfDownloadUrl, "_blank")}
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#FEFCF8] border-[#D7CCC8] hover:border-black text-[#5D4037] hover:text-black transition"
                >
                  <Download className="w-6 h-6" />
                </button>
              )}

              <button
                onClick={handleShare}
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#FEFCF8] border-[#D7CCC8] hover:border-blue-500 text-[#5D4037] hover:text-blue-500 transition"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RATING MODAL */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-[#3E2723]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#FEFCF8] rounded-2xl p-8 w-full max-w-md shadow-2xl relative text-center border border-[#D7CCC8]">
            <button
              onClick={() => setIsRatingModalOpen(false)}
              className="absolute top-4 left-4 text-[#D7CCC8] hover:text-[#3E2723]"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#3E2723] mb-6">
              ما رأيك في الكتاب؟
            </h2>

            <div className="flex justify-center gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  onClick={() => setUserRating(i)}
                  className={`w-10 h-10 cursor-pointer transition hover:scale-110 ${
                    i <= userRating
                      ? "text-[#DEC59E] fill-[yellow]"
                      : "text-[#D7CCC8]"
                  }`}
                />
              ))}
            </div>

            <textarea
              className="w-full h-32 p-4 rounded-xl border-2 border-[#D7CCC8] bg-[#F4EFE9] text-[#3E2723] focus:border-[#606C38] outline-none resize-none text-right"
              placeholder="اكتب مراجعتك هنا..."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
            />

            <Button
              onClick={handleSubmitReview}
              className="w-full h-12 bg-[#606C38] text-white rounded-xl font-bold hover:bg-[#3E4A20]"
            >
              {isReviewed ? "تعديل التقييم" : "تأكيد التقييم"}
            </Button>

            {isReviewed && (
              <button
                onClick={handleDeleteReview}
                className="mt-3 w-full h-12 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                حذف التقييم
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
