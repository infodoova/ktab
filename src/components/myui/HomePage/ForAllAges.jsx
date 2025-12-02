import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import owl2 from "../../../assets/character/owl2.png";

const steps = [
  { title: "للأطفال", text: "قصص بسيطة ومصوّرة تساعدهم على حب القراءة." },
  { title: "لليافعين", text: "كتب وروايات تواكب فضولهم وتدعم مهاراتهم." },
  { title: "للكبار", text: "مكتبة عربية متنوّعة تناسب وقت الراحة والعمل." },
  { title: "للمعلّمين", text: "متابعة تقدّم القرّاء وإعداد تقارير سهلة." },
];

export default function ForAllAges() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const index = Number(e.target.getAttribute("data-index"));
            setActive(index);
          }
        });
      },
      { threshold: 0.4 }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="for-all-ages"
      dir="rtl"
      className="
        relative w-full py-20 md:py-32 
        bg-gradient-to-b from-[#f7f3ec] to-[#e8ddd0]
        overflow-hidden
      "
    >

 <div
  className="
    pointer-events-none absolute inset-0 
    opacity-[0.22]     /* increased from 0.09 → more visible */
    bg-no-repeat bg-center bg-contain
    scale-105
  "
  style={{
    backgroundImage: `url(${owl2})`,
    lazy: "loading",
    filter: "blur(2px)", 
    maskImage: "radial-gradient(circle, rgba(0,0,0,1) 40%, transparent 80%)",
    WebkitMaskImage:
      "radial-gradient(circle, rgba(0,0,0,1) 40%, transparent 80%)",
  }}
      />

      {/* Title */}
      <div className="relative text-center mb-16 z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--earth-brown)]">
          رحلة لكل الأعمار
        </h2>
        <p className="text-[var(--earth-brown)]/70 mt-3 text-lg">
          تجربة مصممة لتناسب كل قارئ.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 z-10">

        {/* Vertical line */}
        <div className="
          absolute top-0 left-1/2 -translate-x-1/2 
          w-[4px] h-full bg-[var(--earth-olive)]/30 rounded-full
        " />

        <div className="flex flex-col gap-20 relative">

          {steps.map((step, i) => (
            <div
              key={i}
              data-index={i}
              ref={(el) => (refs.current[i] = el)}
              className="relative flex flex-col md:flex-row items-center md:items-start gap-6"
            >
              {/* Dot */}
              <div className="
                absolute left-1/2 -translate-x-1/2 
                w-6 h-6 rounded-full
                bg-[var(--earth-olive)] 
                shadow-md z-10
              " />

              {/* Card */}
              <Card
                className={`
                  w-full md:w-[45%]
                  p-8 
                  bg-white/80 backdrop-blur-md 
                  shadow-lg rounded-2xl border
                  transition-all duration-500
                  ${
                    active === i
                      ? "scale-[1.04] border-[var(--earth-olive)] shadow-xl"
                      : "opacity-70"
                  }
                  ${
                    i % 2 === 0
                      ? "md:mr-auto md:translate-x-[-20px]"
                      : "md:ml-auto md:translate-x-[20px]"
                  }
                `}
              >
                <h3 className="text-2xl font-bold text-[var(--earth-brown)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--earth-brown)]/70 text-lg leading-relaxed">
                  {step.text}
                </p>
              </Card>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
