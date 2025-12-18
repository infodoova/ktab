import React, { useEffect, useState, useCallback } from "react";
import { BookPlus, X } from "lucide-react";
import { getHelper, deleteHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";
import { useNavigate } from "react-router-dom";
export default function AssignedBooksCP() {
  const [books, setBooks] = useState([]);
 const navigate = useNavigate();
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

  // Fetch assigned books
  const fetchAssignedBooks = useCallback(async () => {

    setLoading(true);

    try {
      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/library/myLibrary`,
        page: 0,
        size: 8,
      });

      if (!res || !res.content) {
        showToast("error", "فشل التحميل", "تعذر تحميل مكتبتك الآن.");
        setBooks([]);
      } else {
        setBooks(res.content);
      }

    } catch (error) {
      console.error("Library fetch error:", error);
      showToast("error", "مشكلة شبكة", "حدث خطأ أثناء تحميل المكتبة.");

      setBooks([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchAssignedBooks();
    };

    load();
  }, [fetchAssignedBooks]);

  // Remove assigned book
  const handleRemoveBook = async (bookId) => {
    try {
      const res = await deleteHelper({
        url: `${import.meta.env.VITE_API_URL}/library/removeBook/${bookId}`,
      });

      if (res?.success) {
        showToast("success", "تم الحذف", "✔ تمت إزالة الكتاب من مكتبتك.");
        setBooks((prev) => prev.filter((b) => b.id !== bookId));
      } else {
        showToast(
          "error",
          "تعذر الحذف",
          res?.message || "حاول مرة أخرى لاحقاً."
        );
      }
    } catch (err) {
      console.error("Remove book error:", err);
      showToast("error", "مشكلة شبكة", "فشل حذف الكتاب.");
    }
  };

  return (
    <section dir="rtl" className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 mb-5">
        <div className="p-1.5 rounded-lg bg-red-50">
          <BookPlus size={20} className="text-[var(--earth-olive)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--earth-brown)]">المفضلة</h2>
      </div>

      {loading ? (
        <p className="text-center text-[var(--earth-brown)] font-medium">
          جاري التحميل...
        </p>
      ) : books.length === 0 ? (
        <p className="text-center text-[var(--earth-brown)] font-medium">
          لا توجد كتب في مكتبتك حالياً.
        </p>
      ) : (
        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden px-4 pb-4 scrollbar-hide">
            <div className="flex gap-4" style={{ width: "max-content" }}>
              {books.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                      navigate(`/reader/BookDetails/${b.id}`);
                 
                  }}
                  className="
                    group
                    w-40
                    bg-white
                    rounded-2xl
                    shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
                    hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.12)]
                    border border-gray-100
                    transition-all duration-300 ease-out
                    hover:-translate-y-1.5
                    flex flex-col
                    cursor-pointer
                  "
                >
                  <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-2xl bg-gray-100">
                    <img
                      src={b.coverImageUrl}
                      alt={b.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Remove Button */}
                    <button
                      className="
                        absolute top-3 left-2
                        w-6 h-6 rounded-full
                        bg-white/90 backdrop-blur-sm
                        text-red-500
                        flex items-center justify-center
                        opacity-0 group-hover:opacity-100
                        transition-all duration-300
                        hover:bg-red-500 hover:text-white
                        transform translate-y-[-8px] group-hover:translate-y-0
                        shadow-lg
                      "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBook(b.id);
                      }}
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-2.5">
                    <h3
                      className="
                      text-[var(--earth-brown)]
                      font-bold
                      text-xs
                      text-center
                      line-clamp-2
                      group-hover:text-[var(--earth-olive)]
                      transition-colors
                      min-h-[2rem]
                      flex items-center justify-center
                    "
                    >
                      {b.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={closeToast}
      />

      {/* Scrollbar hide styling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
