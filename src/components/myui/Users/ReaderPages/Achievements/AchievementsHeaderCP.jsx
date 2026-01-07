import React from "react";

export default function AchievementsHeaderCP({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((item, i) => (
        <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="text-2xl font-bold text-[var(--earth-blue)]">
            {item.value}
          </div>
          <div className="text-sm text-[var(--earth-brown)] mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
