import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import BookDataComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/BookDataComponent";
import AIComponents from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/AIComponent";
import UserRatesComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/UserRatesComponent";
import SimilarBooksComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/SimilarBooksComponent";

/* ------------------------------ DUMMY DATA ------------------------------ */
/* ------------------------------ DUMMY DATA ------------------------------ */
const dummySimilarBooks = [
  { 
    id: "sim1", 
    title: "مغامرة في الصحراء", 
    genre: "مغامرات",
    pageCount: 120,
    ageRangeMin: 8,
    ageRangeMax: 14,
    language: "عربي",
    hasAudio: true,
    totalReviews: 50,
    pdfDownloadUrl: "#",
    coverImageUrl: "https://images.pexels.com/photos/17510046/pexels-photo-17510046.jpeg", 
    averageRating: 4.2,
    description: "رحلة مثيرة في قلب الرمال الذهبية حيث يكتشف الأبطال واحة مخفية تحرسها ألغاز قديمة. تتطلب الرحلة شجاعة وذكاءً لحل الأحاجي والنجاة من عواصف الصحراء."
  },
  { 
    id: "sim2", 
    title: "أسرار البحيرة الزرقاء", 
    genre: "غموض",
    pageCount: 180,
    ageRangeMin: 10,
    ageRangeMax: 15,
    language: "عربي",
    hasAudio: false,
    totalReviews: 120,
    pdfDownloadUrl: "#",
    coverImageUrl: "https://images.pexels.com/photos/30206439/pexels-photo-30206439.jpeg", 
    averageRating: 4.8,
    description: "تدور القصة حول بحيرة غامضة تضيء ليلاً، ويحاول مجموعة من الأصدقاء كشف سر هذا الضوء الغريب وما يختبئ تحت سطح الماء من مخلوقات أسطورية."
  },
  { 
    id: "sim3", 
    title: "مدينة الألوان المفقودة", 
    genre: "فانتازيا",
    pageCount: 95,
    ageRangeMin: 6,
    ageRangeMax: 10,
    language: "عربي",
    hasAudio: true,
    totalReviews: 75,
    pdfDownloadUrl: "#",
    coverImageUrl: "https://images.pexels.com/photos/34874933/pexels-photo-34874933.jpeg", 
    averageRating: 3.9,
    description: "في عالم رمادي، تنطلق فتاة صغيرة في مهمة لإعادة الألوان إلى مدينتها الكئيبة، مستعينة بفرشاة سحرية وقوة الخيال التي لا حدود لها."
  },
  { 
    id: "sim4", 
    title: "الرحلة إلى القمة", 
    genre: "تشويق",
    pageCount: 200,
    ageRangeMin: 12,
    ageRangeMax: 18,
    language: "عربي",
    hasAudio: false,
    totalReviews: 90,
    pdfDownloadUrl: "#",
    coverImageUrl: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg", 
    averageRating: 4.5,
    description: "قصة كفاح وصعود نحو قمة جبل شاهق، حيث يتعلم البطل أن الوصول إلى القمة ليس مجرد تحدٍ بدني، بل رحلة لاكتشاف الذات والتغلب على المخاوف الداخلية."
  },
];

export default function BookDetails() {
  
  const navigate = useNavigate();
  const { state } = useLocation();
  const book = state?.book;

  const [selectedAiTool, setSelectedAiTool] = React.useState("summary");
  const [aiInput, setAiInput] = React.useState("");

  if (!book) return <div className="flex items-center justify-center h-screen bg-[#F4EFE9] text-[#5D4037]">لا توجد بيانات للكتاب</div>;

  return (
    <div dir="rtl" className="relative min-h-screen bg-[#F4EFE9] text-[#3E2723] overflow-x-hidden">
      
      {/* --- CINEMATIC BACKDROP (Warm Fade) --- */}
      <div className="absolute inset-0 w-full h-[80vh] overflow-hidden z-0 pointer-events-none">
        {/* Gradient moves from transparent to the Cream color */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-[#F4EFE9]/80 to-[#F4EFE9] z-10" />
        <img 
          src={book.coverImageUrl} 
          alt="Backdrop" 
          className="w-full h-full object-cover blur-3xl opacity-30 scale-110 saturate-150" 
        />
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-20">
        
        {/* Navigation */}
        <div className="pt-6 mb-8">
            <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#5D4037] hover:text-[#3E2723] transition group font-medium"
            >
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>العودة للتصفح</span>
            </button>
        </div>

        {/* --- MAIN SEAMLESS FLOW --- */}
        <div className="space-y-20 lg:space-y-32">
          
          <BookDataComponent 
            bookId={book.id} 
            navigate={navigate} 
          />

          <AIComponents
            selectedAiTool={selectedAiTool}
            setSelectedAiTool={setSelectedAiTool}
            aiInput={aiInput}
            setAiInput={setAiInput}
          />

<UserRatesComponent bookId={book.id} />

          <SimilarBooksComponent 
            books={dummySimilarBooks} 
            navigate={navigate}
          />

        </div>
      </div>
    </div>
  );
}