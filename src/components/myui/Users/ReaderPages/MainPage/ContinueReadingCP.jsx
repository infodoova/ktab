import { BookOpen, ArrowLeftCircle } from "lucide-react";

export default function ContinueReadingCP() {
  const books = [
    {
      title: "رحلة القمر الصغير",
      author: "أحمد محمود",
      cover: "https://images.pexels.com/photos/7170721/pexels-photo-7170721.jpeg",
      progress: 78,
      total: 120,
      lastSeen: "منذ 7 أيام",
    },
    {
      title: "قوة العادات",
      author: "تشارلز دويج",
      cover: "https://images.pexels.com/photos/2938278/pexels-photo-2938278.jpeg",
      progress: 30,
      total: 240,
      lastSeen: "منذ 2 يوم",
    },
  ];

  return (
    <section dir="rtl">
      <h2 className="text-xl font-black mb-6 text-[var(--primary-text)] tracking-tight">متابعة القراءة</h2>

      <div className="space-y-3">
        {books.map((b, i) => {
          const percent = Math.round((b.progress / b.total) * 100);

          return (
            <div
              key={i}
              className="bg-white p-5 shadow-sm border border-black/10 rounded-[1.5rem] flex items-center gap-5 transition-all duration-300 hover:shadow-md"
            >
              {/* COVER */}
              <img
                src={b.cover}
                alt={b.title}
                className="w-20 h-24 object-cover rounded-xl shadow-sm border border-black/10"
              />

              {/* TEXT */}
              <div className="flex-1">
                <h3 className="text-[var(--primary-text)] font-black tracking-tight">{b.title}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-text)]/40 mb-3">{b.author}</p>

                <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-black/10">
                  <div
                    className="bg-gradient-to-r from-[#5de3ba] to-[#76debf] h-full rounded-full shadow-[0_0_10px_rgba(93,227,186,0.3)]"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <p className="text-[10px] font-black uppercase tracking-tight text-[var(--primary-text)]/40 mt-2">
                  {b.progress} من {b.total} صفحة • {b.lastSeen}
                </p>
              </div>

              {/* ACTION */}
              <button className="btn-premium flex items-center gap-2 px-6 py-3 rounded-xl text-white text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                متابعة
                <ArrowLeftCircle size={18} strokeWidth={3} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
