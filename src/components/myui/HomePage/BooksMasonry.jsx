/* eslint-disable */

import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";

const BOOKS = [
  {
    title: "رحلة البدء",
    img: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "روح الحكايات",
    img: "https://images.pexels.com/photos/2099691/pexels-photo-2099691.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "كاتب وظلال",
    img: "https://images.pexels.com/photos/3368816/pexels-photo-3368816.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "مملكة القراءة",
    img: "https://images.pexels.com/photos/2228580/pexels-photo-2228580.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "ذكريات الحبر",
    img: "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "أفكار صامتة",
    img: "https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "حضور الكلمات",
    img: "https://images.pexels.com/photos/3309957/pexels-photo-3309957.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "بوح الروح",
    img: "https://images.pexels.com/photos/4153146/pexels-photo-4153146.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "عوالم الورق",
    img: "https://images.pexels.com/photos/3952078/pexels-photo-3952078.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "أساطير القلم",
    img: "https://images.pexels.com/photos/4050303/pexels-photo-4050303.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "رحلة الفكر",
    img: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "حدائق القصص",
    img: "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "سحر المكتبة",
    img: "https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "نوافذ المعرفة",
    img: "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "قهوة وكتاب",
    img: "https://images.pexels.com/photos/35124044/pexels-photo-35124044.jpeg",
  },
  {
    title: "حديث الصمت",
    img: "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "أوراق الخريف",
    img: "https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "مجلدات قديمة",
    img: "https://images.pexels.com/photos/279222/pexels-photo-279222.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "همس الكتب",
    img: "https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "فراغ ممتلئ",
    img: "https://images.pexels.com/photos/4065406/pexels-photo-4065406.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "عالم الخيال",
    img: "https://images.pexels.com/photos/3466163/pexels-photo-3466163.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "القارئ النهم",
    img: "https://images.pexels.com/photos/2923595/pexels-photo-2923595.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "رحلة البدء",
    img: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "روح الحكايات",
    img: "https://images.pexels.com/photos/2099691/pexels-photo-2099691.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "كاتب وظلال",
    img: "https://images.pexels.com/photos/3368816/pexels-photo-3368816.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];
const handleDownload = async (url, title) => {
  if (window.event) window.event.stopPropagation();

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.split("/").pop().split(";")[0] || "jpg";

    const safeTitle = title.toLowerCase();
    const filename = `${safeTitle}.${extension}`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Download failed:", error);
    alert("عذراً، فشل تحميل الصورة. قد تكون هناك مشكلة في رابط الصورة.");
  }
};

export default function BooksPinterest() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const visibleBooks = isMobile ? BOOKS.slice(0, BOOKS.length / 2 - 1) : BOOKS;

  return (
    <section
      className="w-full min-h-screen bg-[var(--bg-dark)] pb-16"
      dir="rtl"
      id="library"
    >
      {/* HEADER SECTION - Unified Design */}
      <div className="pt-24 pb-12 text-center px-4 relative z-10">
      

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6">
          معرض <span className="text-[var(--primary-button)]">الكتب</span>
        </h2>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-medium leading-relaxed">
          مكتبة لا نهائية من الإلهام تتجدد مع كل نقرة، مصممة لتحفيز فضولك وشغفك للقراءة.
        </p>
      </div>

      {/* GRID */}
      <div className="px-3 md:px-6 w-full">
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
          {visibleBooks.map((b, i) => (
            <div
              key={i}
            className="
              relative break-inside-avoid
              rounded-3xl overflow-hidden
              group cursor-zoom-in
              bg-[var(--bg-card)]
              shadow-lg hover:shadow-2xl
              border border-white/5
              transition-all duration-300
              hover:border-[var(--primary-button)]/30
            "
            >
              {/* IMAGE */}
              <ResponsiveImageSkeleton
                src={b.img}
                alt={b.title}
                className="w-full h-full"
                imgClassName="
                object-cover
                transition-transform duration-700
                group-hover:scale-110
              "
                rounded="rounded-none"
              />

              {/* GLASS OVERLAY */}
              <div
                className="
                absolute inset-0
                bg-gradient-to-t
                from-black/70 via-black/25 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              "
              />

              {/* CONTENT */}
              <div
                className="
                absolute inset-0 p-4
                flex flex-col justify-between
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              "
              >
                {/* ACTION */}
                <div className="flex justify-end translate-y-[-8px] group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    className="
                    backdrop-blur-xl
                    text-[var(--bg-dark)]
                    font-black text-xs uppercase
                    px-5 py-2.5 rounded-full
                    shadow-lg transition-all duration-300
                    hover:scale-105 active:scale-95
                  "
                    style={{ background: "var(--gradient)" }}
                    onClick={() => handleDownload(b.img, b.title)}
                  >
                    حفظ
                  </button>
                </div>

                {/* TITLE */}
                <div className="translate-y-[8px] group-hover:translate-y-0 transition-transform duration-300">
                  <span className="block text-white font-bold text-lg drop-shadow-md">
                    {b.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
