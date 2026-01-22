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
      <h2 className="text-xl font-black mb-6 text-[var(--primary-text)] tracking-tight">إحصائيات القراءة</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="bg-white shadow-sm border border-black/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10 mb-3">
                <Icon className="text-[var(--primary-button)]" size={24} />
              </div>
              <div className="text-2xl font-black text-[var(--primary-text)] tracking-tight">
                {item.value}
              </div>
              <div className="text-sm font-black uppercase tracking-widest text-[var(--primary-text)]/40 mt-1">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
