import React, { useState, useEffect } from "react";
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

  const [toast, setToast] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const showToast = (variant, title, description) =>
    setToast({ open: true, variant, title, description });

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  // Review state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  // Assignment toggle
  const [isAssigned, setIsAssigned] = useState(false);
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return;

      try {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/viewBook/${bookId}`,
        });

        const b = res?.data ?? res;

        setBookData({
          id: b.id,
          title: b.title ?? "كتاب",
          description: b.description ?? "",
          genre: b.genre ?? null,
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
      } catch {
        showToast("error", "خطأ", "تعذر تحميل بيانات الكتاب.");
      } finally {
        setLoadingBook(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [bookId]);

  // Encrypt share link
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
        await navigator.share({ title: bookData.title, url: shareUrl });
        return;
      }
    } catch {
      //
    }

    await navigator.clipboard.writeText(shareUrl);
    showToast("success", "تم النسخ", "✔ تم نسخ الرابط المشفّر!");
  };

  // ============================
  // CHECK ASSIGNMENT STATUS
  // ============================
  useEffect(() => {
    const fetchAssignment = async () => {
      if (!bookId) return;

      try {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/library/isAssigned/${bookId}`,
        });

        if (res?.content?.some((b) => b.id === bookId)) {
          setIsAssigned(true);
        } else {
          setIsAssigned(false);
        }
      } catch {
        //
      }
    };

    fetchAssignment();
  }, [bookId]);

  // ============================
  // CHECK REVIEW STATE
  // ============================
  useEffect(() => {
    const fetchReviewState = async () => {
      const user = getUserData();
      if (!user.userId || !bookId) return;

      try {
        const res = await getHelper({
          url: `${
            import.meta.env.VITE_API_URL
          }/reader/books/${bookId}/isReviewed`,
        });

        if (res?.data?.reviewed) {
          setIsReviewed(true);
          setReviewId(res.data.reviewId);
          setUserRating(res.data.rating ?? 0);
          setUserReview(res.data.comment ?? "");
        } else {
          setIsReviewed(false);
          setReviewId(null);
        }
      } catch {
        //
      }
    };

    fetchReviewState();
  }, [bookId]);

  // ============================
  // ADD / EDIT REVIEW
  // ============================
  const handleSubmitReview = async () => {
    const user = getUserData();
    if (!user?.userId || !bookId) return;

    if (userRating < 0 || userRating > 5) {
      showToast("error", "خطأ", "التقييم يجب أن يكون بين 0 و 5.");
      return;
    }

    const payload = {
      rating: userRating,
      comment: userReview.trim(),
    };

    try {
      let response;

      if (isReviewed && reviewId) {
        response = await patchHelper({
          url: `${
            import.meta.env.VITE_API_URL
          }/reader/books/${bookId}/reviews/${reviewId}`,
          body: payload,
        });
      } else {
        // POST — new review
        response = await postHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/reviews`,
          body: payload,
        });
      }

      if (response?.success !== false) {
        setIsRatingModalOpen(false);
        setIsReviewed(true);
        showToast(
          "success",
          "تم الحفظ",
          isReviewed ? "✔ تم تعديل تقييمك." : "✔ تم إرسال تقييمك."
        );
      } else {
        showToast(
          "error",
          "تعذر الحفظ",
          response?.message ?? "حدث خطأ أثناء حفظ التقييم."
        );
      }
    } catch (err) {
      console.error("Review Error:", err);
      showToast("error", "مشكلة", "تعذر حفظ تقييمك.");
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

      if (res?.success) {
        setIsReviewed(false);
        setReviewId(null);
        setUserRating(0);
        setUserReview("");
        setIsRatingModalOpen(false);
        showToast("success", "تم الحذف", "✔ تم حذف تقييمك.");
      } else {
        showToast("error", "فشل الحذف", res?.message ?? "تعذر الحذف.");
      }
    } catch {
      showToast("error", "خطأ", "تعذر حذف تقييمك.");
    }
  };

  // ============================
  // ASSIGN / REMOVE BOOK
  // ============================
  const toggleAssignBook = async () => {
    if (!bookId) return;

    if (!isAssigned) {
      try {
        const res = await postHelper({
          url: `${import.meta.env.VITE_API_URL}/library/assignBook`,
          body: { bookId: bookId },
        });

        if (res?.success) {
          setIsAssigned(true);
          showToast("success", "تمت الإضافة", "✔ أُضيف الكتاب إلى مكتبتك.");
        } else {
          showToast("error", "فشل", res?.message ?? "تعذر الإضافة.");
        }
      } catch {
        showToast("error", "شبكة", "تعذر الإضافة.");
      }
    } else {
      try {
        const res = await deleteHelper({
          url: `${import.meta.env.VITE_API_URL}/library/removeBook/${bookId}`,
        });

        if (res?.success) {
          setIsAssigned(false);
          showToast("success", "تم الحذف", "✔ أُزيل الكتاب من مكتبتك.");
        } else {
          showToast("error", "فشل الحذف", res?.message ?? "تعذر الحذف.");
        }
      } catch {
        showToast("error", "شبكة", "تعذر الحذف.");
      }
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
            {/* READ */}
            <Button
              onClick={() =>
                navigate("/Screens/dashboard/ReaderPages/BookDisplayPage/g")
              }
              className="w-full sm:w-auto px-10 h-14 text-lg font-bold bg-[#606C38] text-white rounded-xl hover:bg-[#3E4A20]"
            >
              <BookOpen className="w-6 h-6" /> قراءة الآن
            </Button>

            {/* ICON GROUP */}
            <div className="flex gap-3">
              {/* REVIEW TOGGLE */}
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

              {/* ASSIGN */}
              <button
                onClick={toggleAssignBook}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#FEFCF8] transition
      ${
        isAssigned
          ? "border-[#006A6A] text-[#006A6A] shadow-[0_0_10px_rgba(0,106,106,0.6)]"
          : "border-[#D7CCC8] text-[#5D4037] hover:border-green-500 hover:text-green-500"
      }
    `}
              >
                <BookPlus className="w-6 h-6" />
              </button>

              {/* DOWNLOAD */}
              {bookData.pdfDownloadUrl && (
                <button
                  onClick={() => window.open(bookData.pdfDownloadUrl, "_blank")}
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#FEFCF8] border-[#D7CCC8] hover:border-black text-[#5D4037] hover:text-black transition"
                >
                  <Download className="w-6 h-6" />
                </button>
              )}

              {/* SHARE */}
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

            {/* INTERACTIVE STARS */}
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

            {/* REVIEW INPUT */}
            <textarea
              className="w-full h-32 p-4 rounded-xl border-2 border-[#D7CCC8] bg-[#F4EFE9] text-[#3E2723] focus:border-[#606C38] outline-none resize-none text-right"
              placeholder="اكتب مراجعتك هنا..."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
            />

            {/* SUBMIT BUTTON */}
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

      {/* TOAST */}
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={closeToast}
      />
    </div>
  );
}
