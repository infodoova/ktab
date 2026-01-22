import { Sparkles, BookOpen } from "lucide-react";

export default function RecommendedBooksCP() {
  const books = [
    { title: "كتاب المعجزة", cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg" },
    { title: "الذكي الفقير", cover: "https://images.pexels.com/photos/8078549/pexels-photo-8078549.jpeg" },
    { title: "رحلة النجاح", cover: "https://images.pexels.com/photos/14750508/pexels-photo-14750508.jpeg" },
    { title: "نور الحكمة", cover: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg" },
    { title: "مملكة المعرفة", cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg" },
    { title: "المعرفة", cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg" },
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
              <div
                key={i}
                className="
                  group
                  w-44
                  bg-white/80 backdrop-blur-sm
                  rounded-[2rem]
                  shadow-sm
                  hover:shadow-md
                  border border-black/10
                  transition-all duration-300 ease-out
                  hover:-translate-y-2
                  flex flex-col
                  cursor-pointer
                  overflow-hidden
                "
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-b-2xl bg-gray-50 flex items-center justify-center p-3">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105 shadow-sm"
                  />
                </div>
                
                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-[var(--primary-text)] font-black text-sm line-clamp-1 mb-1 group-hover:text-[var(--primary-button)] transition-colors tracking-tight">
                    {b.title}
                  </h3>
                  
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-text)]/40 mb-4">تطوير الذات</span>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-black text-[var(--primary-text)] flex items-center gap-1">
                      <span className="text-yellow-400">★</span> 4.8
                    </span>
                    
                    <div className="
                      w-9 h-9 rounded-xl
                      bg-white border border-black/10
                      text-black
                      flex items-center justify-center
                      shadow-sm
                      transition-all duration-300
                      group-hover:scale-110 group-hover:bg-black group-hover:text-white
                    ">
                      <BookOpen size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
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