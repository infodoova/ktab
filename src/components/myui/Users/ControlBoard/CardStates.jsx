import React from "react";
import { Eye, Star, BookOpen, Users } from "lucide-react";

export default function CardStates({ stats }) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ">
       
     
  
        <StatCard
          title="التقييم"
          value={stats?.rating}
          icon={<Star className="w-6 h-6 text-amber-500" />}
          gradient="from-[#FFEEC6] to-[#F9E0A6]"
        />
              <StatCard
          title="المشاهدات"
          value={stats?.views}
          icon={<Eye className="w-6 h-6 text-blue-700" />}
          gradient="from-[#DCEBFF] to-[#C5DBFF]"
        />
           <StatCard
          title="القراء"
          value={stats?.readers}
          icon={<Users className="w-6 h-6 text-emerald-700" />}
          gradient="from-[#D9F4E4] to-[#C0EFD4]"
        />
         <StatCard
          title="الكتب"
          value={stats?.booksCount}
          icon={<BookOpen className="w-6 h-6 text-[var(--earth-brown)]" />}
          gradient="from-[#F5E5C9] to-[#E8D6B2]"
        />

      </div>
    </section>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div
      className={`rounded-3xl border border-[var(--earth-shadow)] bg-gradient-to-br ${gradient} p-5 shadow-[0_4px_18px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.12)] transition-all backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-[var(--earth-brown)]/70 text-xs md:text-sm font-medium">
            {title}
          </p>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[var(--earth-brown-dark)] tracking-tight">
            {value ?? 0}
          </h3>
        </div>
        <div className="p-3 rounded-2xl bg-white/60 shadow-inner backdrop-blur-md">
          {icon}
        </div>
      </div>
    </div>
  );
}