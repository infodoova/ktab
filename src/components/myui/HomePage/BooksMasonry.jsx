import React, { useState } from "react";
import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";

const BOOKS = [
  {
    title: "العبور إلى الحقيقة",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/95b90bc3-8dbc-4602-aa73-e7505e6a9c99.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=23fd532d8fdeb08cc0067d3eb7379fca00657ab49c0e73de0524020b1e4fc590",
  },
  {
    title: "أحلام البحر القديمة",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/6495af96-2366-447d-a05e-9ab9829209a9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=21a2fd98113e4f80b9b43ab8313127fa6507b72d723ec31d849ad327046d9d3d",
  },
  {
    title: "بائع الجرائد",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/8f46bdaf-7259-47cc-98ec-b7d3965ab07f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=e07a58690800333eedd25ddbf64e8664871242515cf6907e7ecf112c12f87432",
  },
  {
    title: "رواية حب على متن القطرية",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/73d91241-05af-491f-964a-64dc06f52898.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=dee56078fd9a7aee73991df41e7affa5f080f8aa39461c683799b2d6b2c79e2f",
  },
  {
    title: "حديث عيسى بن هشام",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/4070075b-8916-496f-ac91-78804ed7764c.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=4cf20937e903e99f87b5acf8ebc4c3c0cc0a9033392e7f674c213711f15637fc",
  },
  {
    title: "سقوط غرناطة",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/75d7614f-3095-42e6-963b-2ecda305f3ce.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=298638264a3c47dba73de670802e28c5afdf8dfafe8819b3cb49265ef94732c8",
  },
  {
    title: "دعاء الكروان",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/d30dfea2-7bfd-466b-92aa-45a3832600d6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=7fbcb384bc1900c1621cdefc27c62df7e9ad089f0fcf691640766bd3eff13bf4",
  },
  {
    title: "الأرض",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/994fbd09-ee04-430a-bfc6-ae99ab0807f0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134710Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=c40402432f11955ec8ab15a59dd70b503a3e756e86dd817c9372ce447a3f54c1",
  },
  {
    title: "قضية فندق سميراميس",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/fb4f8445-b239-4dc0-a825-e327a4e1364d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134742Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=55cac2b4f8879741d06b186e9792848c9163b5026d8598b1750172fa07cec65b",
  },
  {
    title: "بيروت مدينة العالم",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/1c930418-1081-4c76-8666-9a833f4d84bf.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134742Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=70864e7ffa1fd662f48b5797505430c921154dc845a5939d0c019b5aadcc4823",
  },
  {
    title: "الرسائل المصرية",
    img: "https://amzn-s3-ktab-bucket.s3.eu-north-1.amazonaws.com/books/cover/5/11da226c-221c-4ac7-8f5f-44965db763b8.PNG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260123T134742Z&X-Amz-SignedHeaders=host&X-Amz-Expires=35999&X-Amz-Credential=AKIARFFK6IRAXVXITXXC%2F20260123%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=94abefa1e134eddb86742ea8fe471eb56cf51a30f56fa7113dcf62be2a6516e9",
  },
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
  // State for the modal (Lightbox)
  const [selectedBook, setSelectedBook] = useState(null);

  const visibleBooks = BOOKS;
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
          {visibleBooks.map((b, i) => {
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
                  {/* TOP: PREVIEW BUTTON */}
                  <div className="flex justify-end translate-y-[-8px] group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      className="
                        backdrop-blur-xl
                        text-[var(--bg-dark)]
                        font-black text-xs uppercase
                        px-5 py-2.5 rounded-full
                        shadow-lg transition-all duration-300
                        hover:scale-105 active:scale-95
                        flex items-center gap-2
                      "
                      style={{
                        background:
                          "var(--gradient, linear-gradient(to right, #fbbf24, #d97706))",
                      }}
                      onClick={(e) => handlePreview(e, b)}
                    >
                      {/* Optional Eye Icon */}
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md transition-all duration-500 animate-in fade-in"
          onClick={() => setSelectedBook(null)}
        >
          {/* Enhanced Close Button */}
          <button
            onClick={() => setSelectedBook(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/40 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 hover:rotate-90 rounded-full p-4 border border-white/10 group z-[110]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 md:w-8 md:h-8"
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
            className="relative flex flex-col items-center max-w-full w-full animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The "Fixed Size" Image Card */}
            <div 
              className="
                relative w-full max-w-[260px] md:max-w-[320px] 
                aspect-[2/3] overflow-hidden rounded-[2rem] 
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

            {/* Content Section */}
            <div className="mt-6 text-center max-w-2xl px-6">
              <h3 className="text-2xl md:text-4xl text-white font-black tracking-tight leading-tight drop-shadow-2xl">
                {selectedBook.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
