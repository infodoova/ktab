/* eslint-disable */

import { motion } from "framer-motion";

const BOOKS = [
  { title: "رحلة البدء", img: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "روح الحكايات", img: "https://images.pexels.com/photos/2099691/pexels-photo-2099691.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "كاتب وظلال", img: "https://images.pexels.com/photos/3368816/pexels-photo-3368816.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "مملكة القراءة", img: "https://images.pexels.com/photos/2228580/pexels-photo-2228580.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "ذكريات الحبر", img: "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "أفكار صامتة", img: "https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "حضور الكلمات", img: "https://images.pexels.com/photos/3309957/pexels-photo-3309957.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "بوح الروح", img: "https://images.pexels.com/photos/4153146/pexels-photo-4153146.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "عوالم الورق", img: "https://images.pexels.com/photos/3952078/pexels-photo-3952078.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "أساطير القلم", img: "https://images.pexels.com/photos/4050303/pexels-photo-4050303.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "رحلة الفكر", img: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "حدائق القصص", img: "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "سحر المكتبة", img: "https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "نوافذ المعرفة", img: "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "قهوة وكتاب", img: "https://images.pexels.com/photos/35124044/pexels-photo-35124044.jpeg" },
  { title: "حديث الصمت", img: "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "أوراق الخريف", img: "https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "مجلدات قديمة", img: "https://images.pexels.com/photos/279222/pexels-photo-279222.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "همس الكتب", img: "https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "فراغ ممتلئ", img: "https://images.pexels.com/photos/4065406/pexels-photo-4065406.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "عالم الخيال", img: "https://images.pexels.com/photos/3466163/pexels-photo-3466163.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "القارئ النهم", img: "https://images.pexels.com/photos/2923595/pexels-photo-2923595.jpeg?auto=compress&cs=tinysrgb&w=600" },
   { title: "رحلة البدء", img: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "روح الحكايات", img: "https://images.pexels.com/photos/2099691/pexels-photo-2099691.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
  { title: "كاتب وظلال", img: "https://images.pexels.com/photos/3368816/pexels-photo-3368816.jpeg?auto=compress&cs=tinysrgb&w=600" }, 
 
];
const handleDownload = async (url, title) => {
    if (window.event) window.event.stopPropagation(); 
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const extension = contentType.split('/').pop().split(';')[0] || 'jpg'; 

      const safeTitle = title.toLowerCase();
      const filename = `${safeTitle}.${extension}`;

      const link = document.createElement('a');
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
  const visibleBooks = isMobile ? BOOKS.slice(0, BOOKS.length / 2) : BOOKS;

  return (
    <section className="w-full min-h-screen bg-gray-50 pb-10" dir="rtl" id="library">
      
      {/* Title Header */}
      <div className="pt-10 pb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
          معرض الكتب
        </h2>
        <p className="text-gray-500 mt-2">مكتبة لا نهائية من الإلهام</p>
      </div>

      <div className="px-2 md:px-4 w-full">

        <div 
          className="
            columns-2 
            md:columns-3 
            lg:columns-4 
            xl:columns-5 
            2xl:columns-6 
            gap-3 space-y-3
          "
        >
          {visibleBooks.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="
                relative break-inside-avoid 
                rounded-2xl overflow-hidden 
                group cursor-zoom-in
                shadow-sm hover:shadow-xl
                bg-gray-200
                mb-3
              "
            >

              <img
                src={b.img}
                alt={b.title}
                loading="lazy"
                className="
                  w-full h-auto object-cover 
                  transform transition-transform duration-700 
                  group-hover:scale-110
                "
              />

              <div 
                className="
                  absolute inset-0 
                  bg-gradient-to-t from-black/80 via-black/20 to-transparent
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                "
              />

              <div 
                className="
                  absolute inset-0 p-4 
                  flex flex-col justify-between 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                "
              >
                <div className="flex justify-end translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    className="bg-[var(--earth-cream)] text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-black hover:text-white shadow-md"
                    onClick={() => handleDownload(b.img, b.title)}
                  >
                    حفظ
                  </button>
                </div>

                <div className="translate-y-[10px] group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-bold text-lg drop-shadow-md">
                      {b.title}
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
