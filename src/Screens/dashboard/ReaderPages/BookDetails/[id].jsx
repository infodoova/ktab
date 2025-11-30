import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[var(--earth-cream)]">
      {/* FULL WIDTH CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10 space-y-12">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--earth-brown)] hover:text-black transition mb-4"
        >
          <ArrowRight />
          <span>رجوع</span>
        </button>

        {/* ------------------ MAIN BOOK SECTION ------------------ */}
        {/* ------------------ MAIN BOOK SECTION ------------------ */}
<div
  className="
    bg-white rounded-3xl 
    border border-black/10 
    shadow-[0_4px_20px_rgba(0,0,0,0.04)]
    p-6 md:p-10 
    grid grid-cols-1 lg:grid-cols-2 
    gap-12
    items-start
  "
>
  {/* COVER */}
<div className="flex justify-center w-full">
  <div
    className="w-full max-w-[240px] rounded-2xl overflow-hidden shadow-xl bg-white"
    style={{ aspectRatio: "1 / 1.6" }}
  >
    <img
      src={book.coverImageUrl}
      alt={book.title}
      className="w-full h-full object-cover"
    />
  </div>
</div>


  {/* DETAILS */}
  <div className="flex flex-col space-y-6 w-full">
    <h1 className="text-4xl font-bold text-[var(--earth-brown-dark)] leading-snug">
      {book.title}
    </h1>

    {/* tags */}
    <div className="flex flex-wrap gap-3">
      <Badge className="bg-[var(--earth-olive)] text-white px-4 py-1">
        {book.genre}
      </Badge>
      <Badge className="bg-[var(--earth-brown)] text-white px-4 py-1">
        {book.language}
      </Badge>
      <Badge className="bg-[var(--earth-brown)]/70 text-white px-4 py-1">
        {book.ageRangeMin}–{book.ageRangeMax} سنة
      </Badge>
    </div>

    {/* ratings */}
    <div className="flex items-center gap-6 text-[var(--earth-brown)]">
      <div className="flex items-center gap-1">
        <Star className="w-5 h-5 text-yellow-500" fill="gold" />
        <span className="font-semibold">{book.averageRating}</span>
        <span className="text-xs text-gray-500">
          ({book.totalReviews} مراجعة)
        </span>
      </div>

      <Separator orientation="vertical" className="h-5 bg-black/20" />

      <div className="flex items-center gap-1">
        <BookOpen className="w-5 h-5" />
        <span>{book.pageCount} صفحة</span>
      </div>
    </div>

    <Separator className="bg-neutral-200" />

    <p className="text-[var(--earth-brown)] text-lg leading-8">
      {book.description}
    </p>

    <Button
      className="
        mt-2 w-full md:w-1/2 
        bg-[var(--earth-olive)] text-white 
        hover:bg-[var(--earth-olive)]/90 
        rounded-xl text-lg py-6 
        shadow-lg shadow-[var(--earth-olive)]/20
      "
      onClick={() => window.open(book.pdfDownloadUrl, "_blank")}
    >
      قراءة الكتاب
    </Button>
  </div>
</div>


        {/* ------------------ USER RATINGS SECTION ------------------ */}
        <div
          className="
            bg-white rounded-3xl 
            border border-black/10 
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
            p-6 md:p-10
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--earth-brown-dark)]">
              تقييمات المستخدمين
            </h2>

            <button className="text-[var(--earth-olive)] font-semibold hover:underline">
              عرض الكل
            </button>
          </div>

          {/* REVIEWS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* REVIEW CARD */}
            {[ 
              {
                user: "أحمد",
                rating: "5.0",
                msg: "كتاب رائع جداً! مليء بالمغامرة والتشويق.",
              },
              {
                user: "سارة",
                rating: "4.5",
                msg: "استمتعت بكل صفحة! أنصح به للجميع.",
              },
              {
                user: "يمنى",
                rating: "4.0",
                msg: "قصة جميلة وهادفة. أحببت الشخصيات.",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="
                  p-5 rounded-2xl 
                  bg-[var(--earth-cream)] 
                  border border-black/5
                  shadow-[0_2px_10px_rgba(0,0,0,0.03)]
                "
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" fill="gold" />
                  <span className="font-semibold">{r.rating}</span>
                  <span className="text-xs text-gray-500">— {r.user}</span>
                </div>

                <p className="text-[var(--earth-brown)] text-sm leading-relaxed">
                  {r.msg}
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
