import { Link } from "react-router-dom";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--earth-cream)] relative overflow-hidden">

      {/* Soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f9f5ee] to-[#f3ebe1] opacity-80" />

      {/* Soft glow circle */}
      <div className="absolute w-96 h-96 bg-[#e8dcc4] rounded-full blur-3xl opacity-40 top-1/3 left-1/2 -translate-x-1/2" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-xl">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Compass size={85} className="text-[var(--earth-brown)] opacity-90" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-[var(--earth-brown-dark)] mb-3">
          404 – ضائع بين الصفحات
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-[#6a5c52] leading-relaxed mb-8">
          الصفحة التي تبحث عنها غير موجودة.
          <br />
          ربما سقطت من بين الأوراق… أو لم تُكتب بعد.
        </p>

        {/* Return Button */}
        <Link
          to="/"
          className="
            inline-flex items-center gap-2 px-6 py-3
            rounded-xl bg-[var(--earth-olive)] text-white font-medium
            hover:bg-[#4d6135] transition 
          "
        >
          العودة للصفحة الرئيسية
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
