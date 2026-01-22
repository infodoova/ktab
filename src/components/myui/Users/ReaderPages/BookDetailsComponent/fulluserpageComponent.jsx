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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 bg-black/95 md:bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div
        className="
          bg-[#0d0d0d]
          w-full h-full 
          md:w-[1000px] md:h-auto md:max-h-[90vh] md:rounded-[3.5rem] 
          shadow-[0_60px_120px_rgba(0,0,0,0.9)]
          flex flex-col overflow-hidden
          border-t md:border border-white/5
          relative
        "
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-10 border-b border-white/5 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="p-3 md:p-4 rounded-[1.25rem] md:rounded-[1.5rem] bg-gradient-to-br from-[#5de3ba] to-[#76debf] shadow-lg">
              <Star size={24} className="text-white fill-white md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                آراء القراء
              </h3>
              <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1">تجارب حقيقية</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all active:scale-90"
          >
            <X size={24} className="md:w-8 md:h-8" strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar" id="reviews-container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--primary-button)]">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin mb-4" />
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] md:text-xs">جاري جلب الآراء...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 md:py-32">
               <p className="text-white/20 text-xl md:text-2xl font-bold italic">لا توجد مراجعات حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-8">
              {reviews.map((r, index) => (
                <div
                  key={`${r.id}-${index}`}
                  className="group bg-white/[0.03] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 hover:border-[var(--primary-button)]/30 hover:bg-white/[0.05] transition-all duration-500 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white/50 text-base md:text-xl font-black border border-white/10 shrink-0">
                        {r.userName?.[0] || "ق"}
                      </div>
                      <div>
                        <p className="text-lg md:text-2xl font-bold text-white tracking-tight">
                          {r.userName || "قارئ مجهول"}
                        </p>
                        <span className="text-[10px] md:text-xs text-white/30 font-bold uppercase tracking-widest">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString("ar-EG")
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1 md:gap-1.5 bg-black/40 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/5 shadow-inner">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          className={`md:w-[18px] md:h-[18px] ${
                            idx < (r.rating || 0)
                              ? "fill-[var(--primary-button)] text-[var(--primary-button)]"
                              : "text-white/[0.05]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-white/70 text-base md:text-2xl leading-relaxed md:leading-[1.8] font-medium tracking-tight bg-gradient-to-l from-white/80 to-white/40 bg-clip-text text-transparent">
                    {r.comment || "مراجعة مميزة لهذا العمل..."}
                  </p>
                </div>
              ))}

              {/* Load More Button */}
              {page < totalPages - 1 && (
                <div className="flex justify-center pt-8 pb-4 md:pt-12 md:pb-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetchingMore}
                    className="flex items-center gap-3 md:gap-4 px-10 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-3xl bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-[var(--primary-button)] hover:text-white active:scale-95 transition-all duration-500 shadow-xl disabled:opacity-50"
                  >
                    {isFetchingMore ? (
                      <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                    ) : (
                      "عرض المزيد"
                    )}
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
