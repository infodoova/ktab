import React from "react";

export default function RatingModelComponent() {
  const dummyStats = [
    { star: 5, percent: 61, count: 19 },
    { star: 4, percent: 39, count: 12 },
    { star: 3, percent: 0, count: 0 },
    { star: 2, percent: 0, count: 0 },
    { star: 1, percent: 0, count: 0 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-6 text-right">
      <h3 className="font-bold text-lg mb-6 text-[var(--earth-brown)]">
        توزيع التقييمات
      </h3>

      <div className="space-y-4">
        {dummyStats.map((item) => (
          <div
            key={item.star}
            className="flex flex-row-reverse items-center gap-3"
          >
            {/* Stars */}
            <span className="w-12 text-sm font-medium text-right">
              {item.star} ★
            </span>

            {/* Progress (TRUE RTL) */}
            <div
              className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden"
              style={{ direction: "rtl" }}
            >
              <div
                className="bg-yellow-400 h-full rounded-full"
                style={{ width: `${item.percent}%` }}
              />
            </div>

            {/* Count */}
            <span className="text-sm text-gray-600 w-16 text-left">
              ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
