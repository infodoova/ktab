import React, { useEffect, useState, useCallback } from "react";
import { Star, Quote } from "lucide-react";
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
    <div className="border-t border-black/10 pt-16">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
            <Quote className="w-6 h-6 text-[var(--primary-button)]" />
          </div>
          <h2 className="text-3xl font-black text-[var(--primary-text)] tracking-tight">آراء القراء</h2>
        </div>

        {reviews.length > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-[10px] font-black text-[var(--primary-text)]/40 hover:text-[var(--primary-text)] uppercase tracking-widest transition-colors mb-2"
          >
            عرض الكل
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-[#5D4037]">جاري التحميل...</p>
      ) : reviews.length === 0 ? (
        <p className="text-[#5D4037] text-center font-medium">
          لا توجد تقييمات بعد.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="group bg-white p-8 rounded-[2rem] border border-black/10 hover:border-black/20 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[var(--primary-text)] tracking-tight">
                    {r.userName || "قارئ مجهول"}
                  </h4>
                  <span className="text-[10px] text-black/20 font-black uppercase tracking-widest">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("ar-EG")
                      : ""}
                  </span>
                </div>

                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < (r.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-black/5"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[var(--primary-text)]/60 text-sm leading-[1.8] font-black tracking-tight line-clamp-4">
                {r.comment || ""}
              </p>
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
