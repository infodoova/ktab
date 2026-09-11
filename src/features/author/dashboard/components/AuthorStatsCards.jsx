import React from "react";
import { motion } from "framer-motion";
import { Eye, Star, BookOpen, Users } from "lucide-react";

/**
 * Pure presentation AuthorStatsCards component - Mobile-First Liquid Glass Edition
 */
export function AuthorStatsCards({ stats }) {
  const cards = [
    {
      title: "متوسط التقييم",
      value: typeof stats?.averageRating === "number" ? stats.averageRating.toFixed(2) : (stats?.averageRating || "0.0"),
      subValue: "من 5 نجوم",
      icon: <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />,
    },
    {
      title: "عدد القراءات",
      value: stats?.totalReads ?? 0,
      subValue: "قراءة نشطة",
      icon: <Eye className="w-4 h-4 md:w-5 md:h-5 text-[#5de3ba]" />,
    },
    {
      title: "مجموع التقييمات",
      value: stats?.totalReviews ?? 0,
      subValue: "مراجعة قارئ",
      icon: <Users className="w-4 h-4 md:w-5 md:h-5 text-[#38bdf8]" />,
    },
    {
      title: "الكتب المنشورة",
      value: stats?.totalBooks ?? 0,
      subValue: "عمل متوفر",
      icon: <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-[#c084fc]" />,
    },
  ];

  return (
    <section className="w-full" dir="rtl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative group rounded-[1.8rem] md:rounded-[2.2rem] p-4 sm:p-5 md:p-7 bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-3xl border border-white/[0.12] hover:border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_25px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Specular White Top Reflection Line */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Top Row: Glass Icon + Subvalue Badge */}
            <div className="flex items-center justify-between gap-2 mb-3 md:mb-5 relative z-10">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/15 backdrop-blur-2xl shrink-0 shadow-inner">
                {card.icon}
              </div>

              <span className="text-[9px] md:text-[10px] font-black text-slate-200 uppercase tracking-wider bg-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-white/15 backdrop-blur-xl shrink-0">
                {card.subValue}
              </span>
            </div>

            {/* Bottom Row: Number & Label */}
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-sans">
                {card.value}
              </div>
              <div className="text-[11px] md:text-xs font-bold text-slate-200 mt-0.5 tracking-wide truncate">
                {card.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default AuthorStatsCards;
