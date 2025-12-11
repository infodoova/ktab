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
      <div className="flex items-center justify-between px-4 mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--earth-brown)]">
          <div className="p-1.5 rounded-lg bg-[var(--earth-olive)]/10">
            <Sparkles size={20} className="text-[var(--earth-olive)]" />
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
                {/* Image Container */}
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-2xl bg-gray-100">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                
                {/* Card Content */}
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-[var(--earth-brown)] font-bold text-sm line-clamp-1 mb-1 group-hover:text-[var(--earth-olive)] transition-colors">
                    {b.title}
                  </h3>
                  
                  <span className="text-xs text-gray-400 mb-3">تطوير الذات</span>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--earth-brown)]">
                      4.8 ★
                    </span>
                    
                    <div className="
                      w-8 h-8 rounded-full 
                      bg-[var(--earth-olive)]/10 
                      text-[var(--earth-olive)] 
                      flex items-center justify-center
                      group-hover:bg-[var(--earth-olive)]
                      group-hover:text-white
                      transition-all duration-300
                    ">
                      <BookOpen size={14} />
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