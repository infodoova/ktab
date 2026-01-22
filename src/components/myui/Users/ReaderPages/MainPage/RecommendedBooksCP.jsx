import { Sparkles, BookOpen } from "lucide-react";
import React, { useState, useEffect } from "react";
import { MinimalBookCard } from "../Library/BooksCardComponent";

export default function RecommendedBooksCP() {
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

  const books = [
    { id: "rec1", title: "كتاب المعجزة", coverImageUrl: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg" },
    { id: "rec2", title: "الذكي الفقير", coverImageUrl: "https://images.pexels.com/photos/8078549/pexels-photo-8078549.jpeg" },
    { id: "rec3", title: "رحلة النجاح", coverImageUrl: "https://images.pexels.com/photos/14750508/pexels-photo-14750508.jpeg" },
    { id: "rec4", title: "نور الحكمة", coverImageUrl: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg" },
    { id: "rec5", title: "مملكة المعرفة", coverImageUrl: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg" },
    { id: "rec6", title: "المعرفة", coverImageUrl: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg" },
  ];

  return (
    <section dir="rtl" className="w-full max-w-full py-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-6">
        <h2 className="text-xl font-black flex items-center gap-3 text-[var(--primary-text)] tracking-tight">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
            <Sparkles size={20} className="text-[var(--primary-button)]" />
          </div>
          موصى به لك
        </h2>
      </div>

      {/* Scrollable Container */}
      <div className="relative w-full">
        <div 
          className="overflow-x-scroll overflow-y-hidden px-4 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex gap-4 w-max">
            {books.map((b, i) => (
              <div key={b.id} className="w-44">
                <MinimalBookCard
                  book={b}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  index={i}
                  clickable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        section > div > div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}