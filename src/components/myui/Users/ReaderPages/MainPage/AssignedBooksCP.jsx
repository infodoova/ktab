import React, { useEffect, useState, useCallback } from "react";
import { BookPlus, X } from "lucide-react";
import { getHelper, deleteHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";
import { useNavigate } from "react-router-dom";
import { MinimalBookCard } from "../Library/BooksCardComponent";
export default function AssignedBooksCP() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".book-menu-area")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // Fetch assigned books
  const fetchAssignedBooks = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/library/myLibrary`,
        pagination: true,
        page: 0,
        size: 8,
      });

      if (res?.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        setBooks([]);
        return;
      } else {
        setBooks(res.data?.content ?? []);
      }
    } catch (error) {
      console.error("Library fetch error:", error);
      AlertToast("حدث خطأ أثناء تحميل المكتبة.", "ERROR");

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

      if (res?.messageStatus !== "SUCCESS") {
        AlertToast(res.message, res.messageStatus);

        setBooks((prev) => prev.filter((b) => b.id !== bookId));
      } else {
        AlertToast(
          res?.message || "حاول مرة أخرى لاحقاً.",
          res?.messageStatus || "ERROR"
        );
      }
    } catch (err) {
      console.error("Remove book error:", err);
      AlertToast("فشل حذف الكتاب.", "ERROR");
    }
  };

  return (
    <section dir="rtl" className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
          <BookPlus size={20} className="text-[var(--primary-button)]" />
        </div>
        <h2 className="text-xl font-black text-[var(--primary-text)] tracking-tight">المفضلة</h2>
      </div>

      {loading ? (
        <p className="text-center text-[var(--primary-text)]/40 font-black uppercase tracking-widest text-sm py-10">
          جاري التحميل...
        </p>
      ) : books.length === 0 ? (
        <p className="text-center text-[var(--primary-text)]/40 font-black uppercase tracking-widest text-sm py-10">
          لا توجد كتب في مكتبتك حالياً.
        </p>
      ) : (
        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden px-4 pb-4 scrollbar-hide">
            <div className="flex gap-4" style={{ width: "max-content" }}>
              {books.map((b, index) => (
                <div key={b.id} className="w-44">
                  <MinimalBookCard
                    book={b}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    index={index}
                    extraMenuItems={
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveBook(b.id);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors font-black uppercase tracking-tight"
                      >
                        <span>حذف</span> <X size={14} />
                      </button>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
