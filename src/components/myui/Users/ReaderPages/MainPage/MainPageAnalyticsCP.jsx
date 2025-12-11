import { Clock, Book, Award, Star } from "lucide-react";

export default function MainPageAnalyticsCP() {
  const stats = [
    { label: "الكتب المقروءة هذا الشهر", value: 0, icon: Book },
    { label: "ساعات القراءة", value: 15, icon: Clock },
    { label: "متوسط التقييم", value: 0, icon: Star },
    { label: "الإنجازات المفتوحة", value: 3, icon: Award },
  ];

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold mb-4 text-[var(--earth-brown)]">إحصائيات القراءة</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="bg-white shadow-md border border-[var(--earth-olive)/20] rounded-xl p-4 flex flex-col items-center text-center"
            >
              <Icon className="text-[var(--earth-olive)] mb-2" size={28} />
              <div className="text-2xl font-bold text-[var(--earth-brown)]">
                {item.value}
              </div>
              <div className="text-sm text-[var(--earth-brown)]/70">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
