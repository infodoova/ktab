import React, { useEffect, useState } from "react";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";

export default function UserRatings({ bookId }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchRatings() {
      try {
        setLoading(true);

        const data = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/books/${bookId}/reviews`,
        });


           if (data?.messageStatus && data.messageStatus !== "SUCCESS") {
             AlertToast(data?.message, data?.messageStatus);
             return;
           }
        
        // Normalize strictly for UI
        const normalized = data.map((item) => ({
          userName: item.userName || "مستخدم",
          rating: Number(item.rating) || 0,
          comment: item.comment || "",
        }));

        if (mounted) setRatings(normalized);
      } catch  {
        AlertToast("حدث خطأ أثناء تحميل التقييمات", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRatings();

    return () => {
      mounted = false;
    };
  }, [bookId]);

  if (loading) {
    return <p className="text-gray-500 text-right">جاري تحميل التقييمات...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6 text-right">
      <h3 className="font-bold text-lg text-[var(--earth-brown)]">
        جميع التقييمات
      </h3>

      {ratings.map((item, index) => {
        const firstChar = item.userName.charAt(0);

        return (
          <div
            key={index}
            className="flex flex-row-reverse gap-4 border-b pb-4 last:border-b-0"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
              {firstChar}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-row-reverse items-center justify-between">
                <p className="font-semibold">{item.userName}</p>
                <span className="text-yellow-500 font-bold">
                  {item.rating} ★
                </span>
              </div>

              <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                {item.comment}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
