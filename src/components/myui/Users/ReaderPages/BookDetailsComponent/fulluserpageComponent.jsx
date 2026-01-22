import React, { useEffect, useState, useCallback } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";

const PAGE_SIZE = 10;

export default function FullUserRatesModal({ bookId, isOpen, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 1. Wrap the fetch function in useCallback
  const fetchReviews = useCallback(
    async (pageNum) => {
      if (pageNum === 0) setLoading(true);
      else setIsFetchingMore(true);

      try {
        const res = await getHelper({
          url: `${
            import.meta.env.VITE_API_URL
          }/reader/books/${bookId}/reviews?page=${pageNum}&size=${PAGE_SIZE}`,
        });

        if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
          AlertToast(res.message, res.messageStatus);
          return;
        }

        const responseData = res?.content ?? res?.data ?? res ?? {};
        const newContent = responseData?.content ?? [];
        const total = responseData?.totalPages ?? 0;

        if (pageNum === 0) {
          setReviews(newContent);
        } else {
          setReviews((prev) => [...prev, ...newContent]);
        }

        setTotalPages(total);
      } catch (err) {
        console.error("Fetch full reviews error:", err);
        AlertToast("حدث خطأ أثناء تحميل التقييمات.", "ERROR");
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [bookId]
  ); // Dependency: Only recreate this function if bookId changes

  // 2. Add fetchReviews to the useEffect dependency array
  useEffect(() => {
    if (isOpen && bookId) {
      setReviews([]);
      setPage(0);
      setTotalPages(0);
      fetchReviews(0);
    }
  }, [isOpen, bookId, fetchReviews]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="
          bg-white/95 backdrop-blur-[40px]
          w-full h-full 
          md:w-[850px] md:h-auto md:max-h-[85vh] md:rounded-[2.5rem] 
          shadow-[0_40px_100px_rgba(0,0,0,0.2)]
          flex flex-col overflow-hidden
          border border-black/10
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0
        "
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-black/10 bg-white/50">
          <h3 className="text-2xl font-black text-[var(--primary-text)] flex items-center gap-4 tracking-tight">
             <div className="p-2 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
                <Star className="w-5 h-5 text-[var(--primary-button)]" />
             </div>
             جميع آراء القراء
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-black/20 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" id="reviews-container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-[#5D4037]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>جاري التحميل...</p>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-[#5D4037] py-10">لا توجد تقييمات.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((r, index) => (
                <div
                  key={`${r.id}-${index}`}
                  className="border rounded-xl p-5 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-[#3E2723]">
                        {r.userName || "قارئ مجهول"}
                      </p>
                      <span className="text-xs text-[#9E9E9E]">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString("ar-EG")
                          : ""}
                      </span>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < (r.rating || 0)
                              ? "fill-[#DEC59E] text-[#DEC59E]"
                              : "text-[#D7CCC8]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#5D4037] text-sm leading-relaxed">
                    {r.comment || ""}
                  </p>
                </div>
              ))}

              {/* Load More Button */}
              {page < totalPages - 1 && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetchingMore}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isFetchingMore && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {isFetchingMore ? "جاري التحميل..." : "عرض المزيد من الآراء"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
