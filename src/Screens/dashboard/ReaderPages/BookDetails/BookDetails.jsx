import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import BookDataComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/BookDataComponent";
import AIComponents from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/AIComponent";
import UserRatesComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/UserRatesComponent";
import SimilarBooksComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/SimilarBooksComponent";
import Footer from "../../../../components/myui/HomePage/footer"

export default function BookDetails() {
  
  const navigate = useNavigate();
  const { id } = useParams();
  const bookId = id;
  

  const [selectedAiTool, setSelectedAiTool] = React.useState("summary");
  const [aiInput, setAiInput] = React.useState("");

  // Set body, html, and root background to black to prevent white gap
  React.useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const rootElement = document.getElementById('root');
    const originalRootBg = rootElement ? rootElement.style.backgroundColor : '';
    
    document.body.style.backgroundColor = "#000000";
    document.documentElement.style.backgroundColor = "#000000";
    if (rootElement) {
      rootElement.style.backgroundColor = "#000000";
    }
    
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      if (rootElement) {
        rootElement.style.backgroundColor = originalRootBg;
      }
    };
  }, []);

  if (!bookId) return <div className="flex items-center justify-center h-screen bg-[#F4EFE9] text-[#5D4037]">لا توجد بيانات للكتاب</div>;

  return (
    <div dir="rtl" className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-[var(--primary-button)] selection:text-black" style={{ backgroundColor: '#000000' }}>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-16 pb-16">
        
        {/* Navigation */}
        <div className="pt-12 mb-10 relative z-20">
            <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-white hover:text-black hover:bg-[var(--primary-button)] transition-all group font-bold uppercase text-sm tracking-[0.2em] bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg"
            >
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-2 transition-transform" strokeWidth={3} />
            <span>العودة للمكتبة</span>
            </button>
        </div>

        {/* --- MAIN SEAMLESS FLOW --- */}
        <div className="space-y-40">
          
          <BookDataComponent 
            bookId={bookId} 
            navigate={navigate} 
          />

          <div className="space-y-48">
            {/* 
            <AIComponents
              selectedAiTool={selectedAiTool}
              setSelectedAiTool={setSelectedAiTool}
              aiInput={aiInput}
              setAiInput={setAiInput}
            /> 
            */}

            <UserRatesComponent bookId={bookId} />

            <SimilarBooksComponent 
              bookId={bookId} 
              navigate={navigate}
            />
          </div>


        </div>
      </div>
      <div className="bg-black relative" style={{ backgroundColor: '#000000', margin: 0, padding: 0 }}>
        <style>{`
          .book-details-footer footer {
            background-color: #000000 !important;
            margin-bottom: 0 !important;
          }
        `}</style>
        <div className="book-details-footer">
          <Footer />
        </div>
      </div>

    </div>
  );
}