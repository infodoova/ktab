import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import BookDataComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/BookDataComponent";
import AIComponents from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/AIComponent";
import UserRatesComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/UserRatesComponent";
import SimilarBooksComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/SimilarBooksComponent";



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
            bookId={book.id} 
            navigate={navigate}
          />

        </div>
      </div>
    </div>
  );
}