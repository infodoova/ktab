/* eslint-disable no-unused-vars */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import BookDataComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/BookDataComponent";
import AIComponents from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/AIComponent";
import UserRatesComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/UserRatesComponent";
import SimilarBooksComponent from "../../../../components/myui/Users/ReaderPages/BookDetailsComponent/SimilarBooksComponent";

/* ------------------------------ DUMMY SIMILAR BOOKS WITH IMAGES ------------------------------ */
const dummySimilarBooks = [
  {
    id: "sim1",
    title: "مغامرة في الصحراء",
    coverImageUrl: "https://images.pexels.com/photos/17510046/pexels-photo-17510046.jpeg",
    averageRating: 4.2,
  },
  {
    id: "sim2",
    title: "أسرار البحيرة الزرقاء",
    coverImageUrl: "https://images.pexels.com/photos/30206439/pexels-photo-30206439.jpeg",
    averageRating: 4.8,
  },
  {
    id: "sim3",
    title: "مدينة الألوان المفقودة",
    coverImageUrl: "https://images.pexels.com/photos/34874933/pexels-photo-34874933.jpeg",
    averageRating: 3.9,
  },
  {
    id: "sim4",
    title: "الرحلة إلى القمة",
    coverImageUrl: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
    averageRating: 4.5,
  },
];

export default function BookDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const book = state?.book;

  const [isRatingModalOpen, setIsRatingModalOpen] = React.useState(false);
  const [selectedAiTool, setSelectedAiTool] = React.useState("summary");
  const [aiInput, setAiInput] = React.useState("");

  if (!book)
    return (
      <div className="flex items-center justify-center h-screen text-[var(--earth-brown)]">
        لا توجد بيانات للكتاب
      </div>
    );

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--earth-cream)]">
      {/* Whole page wrapper in ONE DIV */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12 bg-transparent">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--earth-brown)] hover:text-[var(--earth-olive)] transition font-semibold"
        >
          <ArrowRight className="w-5 h-5" />
          <span>رجوع</span>
        </button>

        {/* --------------------- ALL COMPONENTS INSIDE ONE WRAPPER ---------------------- */}
        <div className="space-y-12">

          <BookDataComponent
            book={book}
            navigate={navigate}
            setIsRatingModalOpen={setIsRatingModalOpen}
          />

          <AIComponents
            selectedAiTool={selectedAiTool}
            setSelectedAiTool={setSelectedAiTool}
            aiInput={aiInput}
            setAiInput={setAiInput}
          />

          <UserRatesComponent />

          <SimilarBooksComponent books={dummySimilarBooks} navigate={navigate} />

        </div>
      </div>
    </div>
  );
}
