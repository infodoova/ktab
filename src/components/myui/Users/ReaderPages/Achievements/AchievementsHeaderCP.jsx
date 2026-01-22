import React from "react";

export default function AchievementsHeaderCP({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((item, i) => (
        <div 
          key={i} 
          className="bg-white rounded-[2rem] p-8 text-center border border-black/[0.03] shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="text-4xl font-black text-slate-900 tracking-tight mb-2 font-tajawal group-hover:scale-110 transition-transform duration-500">
            {item.value}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
