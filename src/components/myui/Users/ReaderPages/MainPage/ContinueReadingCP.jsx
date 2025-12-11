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
      <h2 className="text-xl font-bold mb-4 text-[var(--earth-brown)]">متابعة القراءة</h2>

      <div className="space-y-3">
        {books.map((b, i) => {
          const percent = Math.round((b.progress / b.total) * 100);

          return (
            <div
              key={i}
              className="bg-white p-4 shadow-md border border-[var(--earth-olive)/20] rounded-xl flex items-center gap-4"
            >
              {/* COVER */}
              <img
                src={b.cover}
                alt={b.title}
                className="w-16 h-20 object-cover rounded-md shadow-sm"
              />

              {/* TEXT */}
              <div className="flex-1">
                <h3 className="text-[var(--earth-brown)] font-semibold">{b.title}</h3>
                <p className="text-xs text-[var(--earth-brown)]/60">{b.author}</p>

                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <p className="text-xs text-[var(--earth-brown)]/60 mt-1">
                  {b.progress} من {b.total} صفحة • {b.lastSeen}
                </p>
              </div>

              {/* ACTION */}
              <button className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                متابعة
                <ArrowLeftCircle size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
