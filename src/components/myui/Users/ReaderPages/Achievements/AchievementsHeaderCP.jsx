import React from "react";

export default function AchievementsHeaderCP({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      {stats.map((item, i) => (
        <div 
          key={i} 
          className="bg-white rounded-[2rem] p-8 text-center border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <div className="text-3xl font-black text-black tracking-tight mb-2">
            {item.value}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-black/40">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
