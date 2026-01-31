/* eslint-disable */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";
import b1 from "../../../assets/images/b1.png";
import b2 from "../../../assets/images/b2.jpeg";
import b3 from "../../../assets/images/b3.png";
import b4 from "../../../assets/images/b4.jpeg";

// Simplified role data focusing on Title and Content for high-end typography
const rolesData = [
  {
    id: "reader",
    heading: "القارئ",
    description:
      "استمتع بتجربة قراءة فريدة مع مكتبتنا الرقمية المتنقلة. يمكنك تتبع تقدمك، استكشاف الكتب الموصى بها بناءً على اهتماماتك السابقة، والتفاعل مع القصص لاختيار مجريات الأحداث. كل كتاب، وكل صفحة، وكل لحظة مصممة خصيصًا لتناسب احتياجاتك.",
    image: b1,
  },
  {
    id: "author",
    heading: "المؤلف",
    description:
      "اكتب أول قصة تفاعلية لك باستخدام الذكاء الاصطناعي، حيث يمكنك تحديد المسار البصري والقصصي، والسماح للتكنولوجيا بتطوير باقي التفاصيل. اجعل قرائك يقررون الأحداث ويختارون النهاية، وتمتع بتجربة مبتكرة تدمج بين إبداعك والتقنية",
    image: b2,
  },
  {
    id: "educator",
    heading: "المعلم",
    description:
      "دعم المعلّم في إدارة الصف، تعيين الكتب والواجبات، وتتبع تقدم الطلاب. قياس التفاعل مع المحتوى وتحويل القراءة إلى تجربة تعليمية نشطة.",
    image: b3,
  },
  {
    id: "student",
    heading: "الطالب",
    description:
      "مساعدة الطلاب على متابعة دراستهم من خلال ملخصات ذكية، تعيين الكتب، وتتبع التقدم الأكاديمي. احصل على دعم مستمر لتحقيق أهدافك الأكاديمية.",
    image: b4,
  },
];

// Custom Typewriter component that preserves Arabic joining by using string slicing
const Typewriter = ({ text, speed = 30, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!isStarted) return;
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [isStarted, text, speed]);

  return (
    <motion.span
      onViewportEnter={() => setTimeout(() => setIsStarted(true), delay)}
      className="inline-block"
    >
      {displayedText}
      {displayedText.length < text.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-[var(--primary-button)] align-middle mr-1"
        />
      )}
    </motion.span>
  );
};

const RolePane = ({ role, index, active, onHover, isMobile }) => {
  return (
    <motion.div
      onMouseEnter={() => !isMobile && onHover(index)}
      onClick={() =>
        isMobile &&
        onHover(index === -1 ? index : index === active ? -1 : index)
      }
      className={`
        relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isMobile ? (active ? "h-[300px]" : "h-[70px]") : active ? "flex-[3]" : "flex-1"}
        ${!isMobile && "border-l border-white/5 first:border-l-0"}
        ${isMobile && "border-b border-white/5 last:border-b-0"}
        bg-[#111]
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ResponsiveImageSkeleton
          src={role.image}
          alt={role.heading}
          className="w-full h-full"
          imgClassName={`object-cover transition-all duration-1000 ${active ? "scale-105 grayscale-0" : "scale-125 grayscale"}`}
          rounded="rounded-none"
        />
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${active ? "bg-black/30" : "bg-black/60"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {/* Title Label (Collapsed) */}
      <motion.div
        animate={{
          opacity: active ? 0 : 1,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span
          className={`text-white/30 font-black tracking-tighter uppercase transition-all duration-500 ${isMobile ? "text-2xl" : "text-4xl rotate-90 whitespace-nowrap"}`}
        >
          {role.heading}
        </span>
      </motion.div>

      {/* Expanded Content */}
      <div
        className={`relative z-10 h-full p-6 md:p-12 flex flex-col justify-end transition-all duration-700 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-4xl">
          <h3 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-4 tracking-tighter">
            {role.heading}
          </h3>

          <div className="max-w-xl">
            <p className="text-white text-base md:text-xl lg:text-2xl leading-relaxed font-medium">
              {active && (
                <Typewriter text={role.description} speed={20} delay={400} />
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function RolesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="roles"
      dir="rtl"
      className="bg-black overflow-hidden relative w-full"
    >
      {/* HEADER SECTION - Adopted from ForAllAges.jsx Design */}
      <div className="w-full px-6 py-28 md:py-40 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight text-[var(--secondary-text)] tracking-tight"
        >
          أدوار <span className="text-[var(--primary-button)]">تتناغم</span>{" "}
          معـاً
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto font-medium text-[var(--secondary-text)] leading-relaxed"
        >
          بيئة رقمية متكاملة تجمع كل أطراف العملية الإبداعية والتعليمية في فضاء
          واحد، مصممة لتعزيز الإبداع وتسهيل الوصول.
        </motion.p>
      </div>

      {/* Accordion Container - Full Width */}
      <div
        className={`
        relative w-full overflow-hidden border-t border-white/10
        flex ${isMobile ? "flex-col h-auto" : "h-[500px] md:h-[600px]"}
      `}
      >
        {rolesData.map((role, index) => (
          <RolePane
            key={role.id}
            role={role}
            index={index}
            active={activeIndex === index}
            onHover={setActiveIndex}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}
