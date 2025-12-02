import React from "react";
import { Star } from "lucide-react";

export default function UserRatesComponent() {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-amber-400 text-amber-400"
            : "text-gray-300"
        }`}
      />
    ));

  const rates = [
    { user: "أحمد", rating: 5, msg: "كتاب رائع جداً ومفيد." },
    { user: "سارة", rating: 4.5, msg: "لغة سهلة ومناسبة." },
    { user: "يمنى", rating: 4, msg: "قصة جميلة وهادفة." },
  ];

  return (
    <section
      className="
        rounded-3xl shadow-xl p-6 md:p-10 border border-[#d3c8b8]
        bg-gradient-to-br from-[#faf7f1] to-[#f0ebe3]
      "
      dir="rtl"
    >
      <h2 className="text-3xl font-extrabold text-[#2a2d28] mb-6">
        تقييمات القرّاء
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rates.map((r, i) => (
          <div
            key={i}
            className="
              bg-[#f5f2eb] p-5 rounded-2xl border border-[#d3c8b8]
              shadow-sm hover:shadow-lg transition
            "
          >
            <div className="flex items-center gap-2 mb-2">
              {renderStars(r.rating)}
              <span className="font-bold text-[#2a2d28]">{r.rating}</span>
              <span className="text-sm text-[#645c45]">— {r.user}</span>
            </div>

            <p className="text-[#3d4a43] leading-relaxed">{r.msg}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
