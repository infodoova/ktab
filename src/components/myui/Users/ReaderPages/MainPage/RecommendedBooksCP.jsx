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
  {
    id: "rec1",
    title: "ألف ليلة وليلة",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/59/%D8%BA%D9%84%D8%A7%D9%81_%D8%A3%D9%84%D9%81_%D9%84%D9%8A%D9%84%D8%A9_%D9%88%D9%84%D9%8A%D9%84%D8%A9_%28%D8%A7%D9%84%D8%AC%D8%B2%D8%A1_%D8%A7%D9%84%D8%A3%D9%88%D9%84%29.jpg",
  },
  {
    id: "rec2",
    title: "الفيل الأزرق",
    coverImageUrl: "https://upload.wikimedia.org/wikipedia/ar/f/f3/Al-Feel_al-Azraq.jpg",
  },
  {
    id: "rec3",
    title: "عزازيل",
    coverImageUrl: "https://upload.wikimedia.org/wikipedia/ar/a/aa/Azazel_novel_cover.jpg",
  },
  {
    id: "rec4",
    title: "رجال في الشمس",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/ar/4/40/%D8%B5%D9%88%D8%B1%D8%A9_%D8%BA%D9%84%D8%A7%D9%81_%D8%B1%D9%88%D8%A7%D9%8A%D8%A9_%D8%B1%D8%AC%D8%A7%D9%84_%D9%81%D9%8A_%D8%A7%D9%84%D8%B4%D9%85%D8%B3.jpg",
  },
  {
    id: "rec5",
    title: "زقاق المدق",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/ar/9/95/%D8%BA%D9%84%D8%A7%D9%81_%D8%B1%D9%88%D8%A7%D9%8A%D8%A9_%D8%B2%D9%82%D8%A7%D9%82_%D8%A7%D9%84%D9%85%D8%AF%D9%82.jpeg",
  },
  {
    id: "rec6",
    title: "الثلاثية",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/ar/2/2c/%D8%A8%D9%8A%D9%86_%D8%A7%D9%84%D9%82%D8%B5%D8%B1%D9%8A%D9%86.jpg",
  },

  {
    id: "rec8",
    title: "الخبز الحافي",
    coverImageUrl:
      "https://upload.wikimedia.org/wikipedia/ar/e/ec/%D8%BA%D9%84%D8%A7%D9%81_%D8%A7%D9%84%D8%AE%D8%A8%D8%B2_%D8%A7%D9%84%D8%AD%D8%A7%D9%81%D9%8A.jpg",
  },
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