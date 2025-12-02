import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Dummy Similar Books Data
const dummySimilarBooks = [
  { id: 'sim1', title: "مغامرة في الصحراء", coverImageUrl:       "https://images.pexels.com/photos/17510046/pexels-photo-17510046.jpeg"
, averageRating: 4.2 },
  { id: 'sim2', title: "أسرار البحيرة الزرقاء", coverImageUrl:      "https://images.pexels.com/photos/30206439/pexels-photo-30206439.jpeg",
 averageRating: 4.8 },
  { id: 'sim3', title: "مدينة الألوان المفقودة", coverImageUrl:       "https://images.pexels.com/photos/34874933/pexels-photo-34874933.jpeg",
 averageRating: 3.9 },
  { id: 'sim4', title: "الرحلة إلى القمة", coverImageUrl:      "https://images.pexels.com/photos/34733313/pexels-photo-34733313.jpeg",
 averageRating: 4.5 },
];

export default function BookDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const book = state?.book;

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--earth-brown)]">
        لا توجد بيانات للكتاب
      </div>
    );
  }

  // Helper function to render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 text-yellow-500 fill-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="gold" />
              <stop offset="50%" stopColor="currentColor" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.33L22 9.47l-5 4.88 1.18 6.88L12 18.25l-6.18 3.25L7 14.35l-5-4.88 6.91-1.14L12 2z" fill="url(#half-star)" />
        </svg>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 stroke-gray-400" />);
    }
    return stars;
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[var(--earth-cream)]">
      {/* FULL WIDTH CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 space-y-12">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--earth-brown)] hover:text-[var(--earth-olive)] transition font-medium"
        >
          <ArrowRight className="w-5 h-5" />
          <span>رجوع إلى المكتبة</span>
        </button>

        {/* ------------------ MAIN BOOK SECTION (PREMIUM CARD) ------------------ */}
        <div
          className="
            bg-white rounded-[2rem] 
            shadow-2xl shadow-black/10
            p-6 md:p-12 
            grid grid-cols-1 lg:grid-cols-3 
            gap-10 md:gap-16
            items-start
          "
        >
          {/* COVER & ACTIONS (Left Column) */}
          <div className="flex flex-col items-center space-y-6 lg:col-span-1">
            <div
              className="
                w-full max-w-[280px] 
                rounded-3xl overflow-hidden 
                shadow-[0_15px_30px_rgba(0,0,0,0.15)] 
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                transition-all duration-300
                hover:scale-[1.01] hover:rotate-[0.5deg]
              "
              style={{ aspectRatio: "1 / 1.6" }}
            >
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            <Button
              className="
                w-full max-w-[280px] h-14 
                bg-[var(--earth-olive)] text-white 
                hover:bg-[var(--earth-olive)]/90 
                rounded-2xl text-xl font-bold
                shadow-xl shadow-[var(--earth-olive)]/30
                transition-colors
              "
              onClick={() => window.open(book.pdfDownloadUrl, "_blank")}
            >
              قراءة الكتاب الآن
            </Button>
          </div>


          {/* DETAILS (Right Column - spans 2/3 of the space) */}
          <div className="flex flex-col space-y-8 lg:col-span-2">
            {/* TITLE */}
            <h1 className="text-5xl font-extrabold text-[var(--earth-brown-dark)] leading-tight">
              {book.title}
            </h1>

            {/* RATINGS & METADATA */}
            <div className="flex flex-wrap items-center gap-6 text-[var(--earth-brown)]">
                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(book.averageRating)}</div>
                    <span className="font-bold text-lg">{book.averageRating}</span>
                    <span className="text-sm text-gray-500">
                    ({book.totalReviews} مراجعة)
                    </span>
                </div>

                <Separator orientation="vertical" className="h-6 bg-neutral-200" />

                {/* Page Count */}
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[var(--earth-olive)]" />
                    <span className="font-medium">{book.pageCount} صفحة</span>
                </div>
            </div>
            
            {/* TAGS */}
            <div className="flex flex-wrap gap-3 pt-2">
                <Badge className="bg-[var(--earth-olive)] text-white px-4 py-1 text-sm font-medium hover:bg-[var(--earth-olive)]/90">
                    {book.genre}
                </Badge>
                <Badge className="bg-gray-700 text-white px-4 py-1 text-sm font-medium hover:bg-gray-600">
                    {book.language}
                </Badge>
                <Badge className="bg-gray-200 text-[var(--earth-brown-dark)] px-4 py-1 text-sm font-medium">
                    {book.ageRangeMin}–{book.ageRangeMax} سنة
                </Badge>
            </div>


            <Separator className="bg-neutral-200" />

            {/* DESCRIPTION */}
            <div>
                <h2 className="text-2xl font-bold text-[var(--earth-brown-dark)] mb-4">
                    ملخص الكتاب
                </h2>
                <p className="text-[var(--earth-brown)] text-lg leading-8 whitespace-pre-wrap">
                    {book.description}
                </p>
            </div>
          </div>
        </div>

        {/* ------------------ USER RATINGS SECTION ------------------ */}
        <div
          className="
            bg-white rounded-3xl 
            shadow-xl shadow-black/5
            p-6 md:p-10
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
            <h2 className="text-3xl font-extrabold text-[var(--earth-brown-dark)]">
              تقييمات المستخدمين
            </h2>

            <button className="text-[var(--earth-olive)] font-semibold hover:underline">
              عرض الكل  ({book.totalReviews})
            </button>
          </div>

          {/* REVIEWS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* REVIEW CARD */}
            {[ 
              {
                user: "أحمد",
                rating: 5.0,
                msg: "كتاب رائع جداً! مليء بالمغامرة والتشويق، وقد جذب ابني الصغير من الصفحة الأولى. القصة هادفة والرسومات ممتازة.",
              },
              {
                user: "سارة",
                rating: 4.5,
                msg: "استمتعت بكل صفحة! أنصح به للجميع. لغة سهلة وممتعة ومناسبة للفئة العمرية المذكورة. أتمنى المزيد من هذه السلسلة.",
              },
              {
                user: "يمنى",
                rating: 4.0,
                msg: "قصة جميلة وهادفة. أحببت الشخصيات وتطور الأحداث كان جيداً. أخذت نجمة واحدة فقط لعدم توفر نسخة صوتية.",
              },
              {
                user: "خالد",
                rating: 5.0,
                msg: "تصميم الغلاف جذاب ومحتوى القصة عميق. يستحق القراءة وأكثر. سيجعلك تفكر في طبيعة الأبطال الحقيقيين.",
              },
            ].slice(0, 3).map((r, i) => ( 
              <div
                key={i}
                className="
                  p-6 rounded-xl 
                  bg-[var(--earth-cream)] 
                  border border-black/5
                  shadow-inner
                "
              >
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(r.rating)}</div>
                    <span className="font-bold text-sm text-[var(--earth-brown-dark)]">{r.rating}</span>
                    <span className="text-xs text-gray-500">— {r.user}</span>
                </div>

                <p className="text-[var(--earth-brown)] text-base leading-relaxed">
                  {r.msg}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------ SIMILAR BOOKS SECTION ------------------ */}
        <div
          className="
            bg-white rounded-3xl 
            shadow-xl shadow-black/5
            p-6 md:p-10
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
            <h2 className="text-3xl font-extrabold text-[var(--earth-brown-dark)]">
              كتب مشابهة قد تعجبك
            </h2>
  
          </div>

          {/* SIMILAR BOOKS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummySimilarBooks.map((simBook) => (
              <div
                key={simBook.id}
               
                onClick={() => navigate(`/Screens/dashboard/ReaderPages/BookDetails/${simBook.id}`, { state: { book: simBook } })} 
                className="
                  flex flex-col items-center text-center 
                  cursor-pointer group
                  p-3 rounded-xl hover:bg-[var(--earth-cream)] transition-colors
                "
              >
                {/* Book Cover */}
                <div
                  className="
                    w-full max-w-[120px] mb-3 
                    rounded-lg overflow-hidden 
                    shadow-lg group-hover:shadow-xl
                    transition-all duration-200
                  "
                  style={{ aspectRatio: "1 / 1.6" }}
                >
                  <img
                    src={simBook.coverImageUrl}
                    alt={simBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-base font-semibold text-[var(--earth-brown-dark)] group-hover:text-[var(--earth-olive)] transition-colors line-clamp-2">
                  {simBook.title}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{simBook.averageRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}