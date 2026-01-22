import React, { useEffect, useState, useCallback } from "react";
import { Star, Quote, ArrowLeft } from "lucide-react";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";
import FullUserRatesModal from "./fulluserpageComponent";

export default function UserRatesComponent({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [loading, setLoading] = useState(true);
const fetchReviews = useCallback(async () => {
  setLoading(true);

  try {
    const res = await getHelper({
      url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/reviews`,
    });

    // 1️⃣ Validate status ONLY if backend provides it
    if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
      AlertToast(res?.message, res?.messageStatus);
      setReviews([]);
      return;
    }

    // 2️⃣ Normalize content (REAL API SHAPE)
    let content = [];

    if (Array.isArray(res?.content?.content)) {
      content = res.content.content;
    } else if (Array.isArray(res?.data?.content)) {
      content = res.data.content;
    } else if (Array.isArray(res?.content)) {
      content = res.content;
    }

    setReviews(content.slice(0, 3)); // max 4
  } catch (err) {
    console.error("Fetch reviews error:", err);
    AlertToast("حدث خطأ في الشبكة أثناء تحميل المراجعات.", "ERROR");
    setReviews([]);
  } finally {
    setLoading(false);
  }
}, [bookId]);
 // memoization dependency

  useEffect(() => {
    if (!bookId) return;

    const run = async () => {
      await fetchReviews();
    };

    run();
  }, [bookId, fetchReviews]);

  // Listen for global review change events to refresh reviews in real-time
  useEffect(() => {
    const onBookReviewChanged = (e) => {
      try {
        if (!e?.detail) return;
        const {
          bookId: changedBookId,
          action,
          review,
          reviewId: changedReviewId,
        } = e.detail;

        if (!changedBookId || String(changedBookId) !== String(bookId)) return;

        // Try optimistic local updates, then always refetch for consistency.

        // Deleted: remove locally if we have an id
        if (action === "deleted") {
          if (changedReviewId) {
            setReviews((prev) =>
              prev.filter(
                (r) =>
                  String(r.id ?? r.reviewId ?? r._id) !==
                  String(changedReviewId)
              )
            );
          }
        }

        // Created or updated: optimistic upsert
        if (review) {
          const incomingId = review.id ?? review.reviewId ?? review._id;
          setReviews((prev) => {
            const idx = prev.findIndex(
              (r) => String(r.id ?? r.reviewId ?? r._id) === String(incomingId)
            );
            if (idx !== -1) {
              const copy = [...prev];
              copy[idx] = review;
              return copy;
            }
            return [review, ...prev].slice(0, 3);
          });
        }

        // Always refetch to ensure the UI matches the server (handles races and different response shapes)
        fetchReviews();
      } catch {
        // ignore
      }
    };

    window.addEventListener("bookReviewChanged", onBookReviewChanged);
    return () =>
      window.removeEventListener("bookReviewChanged", onBookReviewChanged);
  }, [bookId, fetchReviews]);

  return (
    <div className="border-t border-white/5 pt-16">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] bg-gradient-to-br from-[#5de3ba] to-[#76debf] shadow-[0_10px_30px_rgba(93,227,186,0.2)]">
            <Quote className="w-5 h-5 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">آراء القراء</h2>
          
          </div>
        </div>

        {reviews.length > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 md:gap-3 text-sm md:text-lg font-black text-white/40 hover:text-[var(--primary-button)] transition-all group"
          >
            <span className="hidden sm:block uppercase tracking-[0.1em] md:tracking-[0.2em]">استكشف الكل</span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--primary-button)] group-hover:text-black group-hover:border-transparent transition-all">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </div>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-[var(--primary-button)]/20 border-t-[var(--primary-button)] rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-[var(--primary-button)]/20">
          <p className="text-white/20 font-bold uppercase tracking-widest">
            لا توجد تقييمات حتى الآن. كن أول من يشارك رأيه!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="group bg-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-[var(--primary-button)]/30 hover:border-[var(--primary-button)]/50 hover:bg-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white/40 font-black text-[10px] md:text-xs border border-white/5 shrink-0">
                    {r.userName?.[0] || "ق"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white tracking-tight text-base md:text-lg truncate">
                      {r.userName || "قارئ مجهول"}
                    </h4>
                    <span className="text-[9px] md:text-[10px] text-white/20 font-bold uppercase tracking-widest">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("ar-EG")
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex gap-0.5 md:gap-1 bg-black/20 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shrink-0">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={10}
                      strokeWidth={0}
                      className={`md:w-3 md:h-3 ${
                        idx < (r.rating || 0)
                          ? "fill-[var(--primary-button)] text-[var(--primary-button)]"
                          : "text-white/5"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <p className="text-white/60 text-base md:text-lg leading-relaxed font-semibold tracking-tight line-clamp-4 italic">
                  "{r.comment || "تجربة قراءة فريدة ومتميزة..."}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <FullUserRatesModal
        bookId={bookId}
        isOpen={showAll}
        onClose={() => setShowAll(false)}
      />
    </div>
  );
}
