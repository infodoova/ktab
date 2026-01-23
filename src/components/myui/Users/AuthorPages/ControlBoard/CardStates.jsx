import React from "react";
import { Eye, Star, BookOpen, Users } from "lucide-react";

export default function CardStates({ stats }) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ">
        <StatCard
          title="التقييم"
          value={stats?.averageRating?.toFixed(2)}
          icon={<Star className="w-6 h-6 text-[#5de3ba]" />}
        />
        <StatCard
          title="عدد القراء "
          value={stats?.totalReads}
          icon={<Eye className="w-6 h-6 text-[#5de3ba]" />}
        />
        <StatCard
          title="مجموع التقييمات"
          value={stats?.totalReviews}
          icon={<Users className="w-6 h-6 text-[#5de3ba]" />}
        />
        <StatCard
          title="الكتب"
          value={stats?.totalBooks}
          icon={<BookOpen className="w-6 h-6 text-[#5de3ba]" />}
        />
      </div>
    </section>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div
      className="bg-white shadow-sm border border-black/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10 mb-3">
        {React.cloneElement(icon, { className: "text-[#5de3ba]", size: 24 })}
      </div>
      <div className="text-2xl font-black text-black tracking-tight">
        {value ?? 0}
      </div>
      <div className="text-sm font-black uppercase tracking-widest text-black/40 mt-1">
        {title}
      </div>
    </div>
  );
}
