import React, { useEffect,useState,useCallback } from "react";
import { Star, Quote } from "lucide-react";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";

export default function UserRatesComponent({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const showToast = (variant, title, description) => {
    setToast({ open: true, variant, title, description });
  };

  const closeToast = () =>
    setToast((prev) => ({
      ...prev,
      open: false,
    }));

const fetchReviews = useCallback(async () => {
  setLoading(true);

  try {
    const res = await getHelper({
      url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/reviews`,
    });

    if (!res || !res.content) {
      showToast(
        "error",
        "فشل تحميل البيانات",
        "تعذر تحميل تقييمات القراء حالياً."
      );
      setReviews([]);
    } else {
      setReviews(res.content.slice(0, 3)); // 3 max
    }
  } catch (err) {
    console.error("Fetch reviews error:", err);
    showToast("error", "خطأ", "حدث خطأ في الشبكة أثناء تحميل المراجعات.");
    setReviews([]);
  }

  setLoading(false);
}, [bookId]);  // memoization dependency

useEffect(() => {
  if (!bookId) return;

  const run = async () => {
    await fetchReviews();
  };

  run();
}, [bookId, fetchReviews]);




  return (
    <div className="border-t border-[#D7CCC8] pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#3E2723] rounded-full"></div>
        <h2 className="text-2xl font-bold text-[#3E2723]">آراء القراء</h2>
      </div>

      {loading ? (
        <p className="text-center text-[#5D4037]">جاري التحميل...</p>
      ) : reviews.length === 0 ? (
        <p className="text-[#5D4037] text-center font-medium">
          لا توجد تقييمات بعد.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="group bg-[#FEFCF8] p-8 rounded-2xl border border-transparent hover:border-[#D7CCC8] shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[#3E2723] group-hover:text-[#606C38] transition-colors">
                    {r.userName || "قارئ مجهول"}
                  </h4>
                  <span className="text-xs text-[#D7CCC8] font-bold">
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

              <p className="text-[#5D4037] text-sm leading-relaxed relative font-medium">
                <Quote className="w-4 h-4 inline-block ml-1 text-[#D7CCC8] transform -scale-x-100" />
                {r.comment || ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Alert Toast */}
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
