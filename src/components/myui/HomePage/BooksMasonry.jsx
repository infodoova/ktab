import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";

const STATIC_BOOKS = [
  {
    title: "أخلاقيات الرأسمالية: ما لن يخبرك به أستاذك",
    img: "https://www.baytalhikma2.org/_next/image/?url=https%3A%2F%2Fapi.baytalhikma2.org%2Fapi%2Fv1%2Fstorages%2F66c78394c28c2.png&w=1080&q=75",
  },
  {
    title: "مدخل إلى الليبرالية الكلاسيكية",
    img: "https://www.baytalhikma2.org/_next/image/?url=https%3A%2F%2Fapi.baytalhikma2.org%2Fapi%2Fv1%2Fstorages%2F66a7d4eb863e4.jpg&w=1080&q=75",
  },
  {
    title: "الفقر والحرية",
    img: "https://www.baytalhikma2.org/_next/image/?url=https%3A%2F%2Fapi.baytalhikma2.org%2Fapi%2Fv1%2Fstorages%2F68dabac42c9ee.jpg&w=1080&q=75",
  },
  {
    title: "الرأسمالية والحرية",
    img: "https://www.baytalhikma2.org/_next/image/?url=https%3A%2F%2Fapi.baytalhikma2.org%2Fapi%2Fv1%2Fstorages%2F67a24dca16781.jpg&w=1080&q=75",
  },
  {
    title: "ما لم يخبرك به أحد",
    img: "https://www.noor-book.com/publice/covers_cache_webp/2/4/2/e/f435fe97c042e138993062aaa4e31533.jpg.webp",
  },
  {
    title: "الـتـابـع وسـلـيـمـان، عـن الـحـب والـجـسـد والـمـنـفـى",
    img: "https://images.arabicbookshop.net/362-302.jpg",
  },
  {
    title: "أصـدقـاء الـى الأبـد",
    img: "https://images.arabicbookshop.net/CHD-4.jpg",
  },
];

export default function BooksPinterest() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [allBooks, setAllBooks] = useState(STATIC_BOOKS);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reader/covers?page=0&size=18`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' 
          }
        });

        if (!response.ok) throw new Error("Network response was not ok");
        
        const json = await response.json();
     
        if (json.messageStatus !== "SUCCESS") {
          console.log("API returned non-success status:", json.messageStatus);
          return;
        }

        if (json.success && json.data && Array.isArray(json.data.content)) {
          const apiBooks = json.data.content.map((item) => ({
            ...item,
            img: item.coverImageUrl,
            fromApi: true,
          }));

          // Merge static and API data
          setAllBooks([...STATIC_BOOKS, ...apiBooks]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Block/unblock body scroll when modal is open
  useEffect(() => {
    if (selectedBook) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [selectedBook]);

  const aspectRatios = [
    "aspect-[2/3]",
    "aspect-[3/5]",
    "aspect-[3/4]",
    "aspect-[1/2]",
    "aspect-[4/5]",
  ];

  // Function to open the preview modal
  const handlePreview = (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBook(book);
  };

  const handleDetails = (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/reader/BookDetails/${book.id}`);
  };

  return (
    <section
      className="w-full min-h-screen bg-[var(--bg-dark)] pb-16 relative"
      dir="rtl"
      id="library"
    >
      {/* HEADER SECTION */}
      <div className="pt-24 pb-12 text-center px-4 relative z-10">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6">
          معرض <span className="text-[var(--primary-button)]">الكتب</span>
        </h2>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-medium leading-relaxed">
          مكتبة لا نهائية من الإلهام تتجدد مع كل نقرة، مصممة لتحفيز فضولك وشغفك
          للقراءة.
        </p>
      </div>

      {/* MASONRY GRID */}
      <div className="px-2 md:px-6 w-full">
        <div
          className="
            columns-2
            md:columns-3
            lg:columns-4
            xl:columns-5
            2xl:columns-6
            gap-4 space-y-4
          "
        >
          {/* 4. Use 'allBooks' state instead of static variable */}
          {allBooks.map((b, i) => {
            const ratioClass = aspectRatios[i % aspectRatios.length];

            return (
              <div
                key={i}
                // Clicking the card itself also triggers preview (optional UX choice)
                onClick={(e) => handlePreview(e, b)}
                className={`
                  relative break-inside-avoid
                  rounded-3xl overflow-hidden
                  group cursor-zoom-in
                  bg-[var(--bg-card)]
                  shadow-lg hover:shadow-2xl
                  border border-white/5
                  transition-all duration-300
                  hover:border-[var(--primary-button)]/30
                  ${ratioClass}
                `}
              >
                {/* IMAGE LOADER */}
                <ResponsiveImageSkeleton
                  src={b.img}
                  alt={b.title}
                  className="absolute inset-0 w-full h-full block"
                  imgClassName="
                    w-full h-full block
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                  rounded="rounded-none"
                />

                {/* DARK OVERLAY */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/90 via-black/30 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    pointer-events-none
                  "
                />

                {/* HOVER CONTENT WRAPPER */}
                <div
                  className="
                    absolute inset-0 p-4
                    flex flex-col justify-between
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    z-20
                  "
                >
                  {/* TOP: BUTTONS */}
                  <div className="flex flex-col gap-2 items-end translate-y-[-8px] group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      className="
                        backdrop-blur-xl
                        text-[var(--bg-dark)]
                        font-black text-xs uppercase
                        px-5 py-2.5 rounded-full
                        shadow-lg transition-all duration-300
                        hover:scale-105 active:scale-95
                        flex items-center gap-2
                        w-fit
                      "
                      style={{
                        background:
                          "var(--gradient, linear-gradient(to right, #fbbf24, #d97706))",
                      }}
                      onClick={(e) => handlePreview(e, b)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      معاينة
                    </button>
                  </div>

                  {/* BOTTOM: TITLE */}
                  <div className="translate-y-[8px] group-hover:translate-y-0 transition-transform duration-300">
                    {b.fromApi && b.mainGenre && (
                      <span className="inline-block bg-[var(--primary-button)] text-black text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                        {b.mainGenre}
                      </span>
                    )}
                    <span className="block text-white font-bold text-lg drop-shadow-md leading-tight">
                      {b.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- PREVIEW MODAL (LIGHTBOX) --- */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/95 md:backdrop-blur-md md:animate-in md:fade-in md:duration-300"
          onClick={() => setSelectedBook(null)}
        >
          {/* Enhanced Close Button */}
          <button
            onClick={() => setSelectedBook(null)}
            className="absolute top-4 right-4 md:top-10 md:right-10 text-white/40 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 hover:rotate-90 rounded-full p-3 md:p-4 border border-white/10 group z-[110]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 md:w-8 md:h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Modal Content Container */}
          <div
            className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 max-w-5xl w-full h-full md:h-auto md:max-h-[90vh] md:animate-in md:zoom-in-95 md:duration-300 bg-[var(--bg-card)] p-8 md:p-12 rounded-none md:rounded-[3rem] border-0 md:border border-white/10 shadow-none md:shadow-2xl overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: The "Fixed Size" Image Card */}
            <div
              className="
                relative w-full max-w-[220px] md:max-w-[320px] shrink-0
                aspect-[2/3] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] 
                shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] 
                border-4 border-white/5 bg-[var(--bg-card)]
                transition-transform duration-500 hover:scale-[1.02]
              "
            >
              <ResponsiveImageSkeleton
                src={selectedBook.img}
                alt={selectedBook.title}
                className="w-full h-full block"
                imgClassName="w-full h-full object-cover"
                rounded="rounded-none"
              />

              {/* Decorative inner glow */}
              <div className="absolute inset-0 pointer-events-none rounded-[1.8rem] border border-white/10" />
            </div>

            {/* Right: Content Section */}
            <div className="flex-1 text-center md:text-right w-full">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                 {selectedBook.fromApi && (
                   <>
                    <span className="bg-[var(--primary-button)]/20 text-[var(--primary-button)] px-3 py-1 rounded-full text-sm font-bold border border-[var(--primary-button)]/30">
                      {selectedBook.mainGenre}
                    </span>
                    <span className="bg-white/5 text-white/60 px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                      {selectedBook.language === 'arabic' ? 'العربية' : selectedBook.language}
                    </span>
                    <span className="bg-white/5 text-white/60 px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                       {selectedBook.pageCount} صفحة
                    </span>
                   </>
                 )}
              </div>

              <h3 className="text-3xl md:text-5xl text-white font-black tracking-tight leading-tight mb-6">
                {selectedBook.title}
              </h3>

              {selectedBook.fromApi ? (
                <div className="space-y-6">
                  <p className="text-white/70 text-lg leading-relaxed line-clamp-6 md:line-clamp-none">
                    {selectedBook.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/10">
                    <div>
                      <p className="text-white/40 text-xs uppercase mb-1">الفئة العمرية</p>
                      <p className="text-white font-bold">{selectedBook.ageRangeMin} - {selectedBook.ageRangeMax} سنة</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase mb-1">النوع الفرعي</p>
                      <p className="text-white font-bold">{selectedBook.subGenre}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      className="
                        w-full md:w-auto
                        bg-[var(--primary-button)] text-black
                        font-black text-base md:text-lg
                        px-8 py-4 rounded-2xl
                        shadow-xl transition-all duration-300
                        hover:scale-105 active:scale-95
                        flex items-center justify-center gap-3
                      "
                      onClick={(e) => handleDetails(e, selectedBook)}
                    >
                      عرض التفاصيل الكاملة
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white/60 text-lg">هذا الكتاب جزء من مجموعتنا المختارة. قريباً ستتوفر تفاصيل إضافية عنه.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}