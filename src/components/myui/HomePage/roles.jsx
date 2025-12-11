/* eslint-disable */
import React from "react";
import { motion } from "framer-motion";

const rolesData = [
  {
    id: "reader",
    heading: "قارئ",
    description:
      "القارئ يحتاج إلى تجربة قراءة واضحة ومريحة تُساعده على الاستمرار. المنصّة تجمع بين تصميم نظيف وأدوات ذكية مثل تتبّع التقدّم، الإشارات المرجعية، والمكتبة الشخصية.",
    images: [
      "https://images.pexels.com/photos/3494806/pexels-photo-3494806.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/3095621/pexels-photo-3095621.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6549631/pexels-photo-6549631.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    id: "author",
    heading: "مؤلّف",
    description:
      "المؤلّف يحتاج إلى بيئة نشر تدعم الإبداع وتُسهّل الوصول إلى الجمهور. المنصّة توفّر أدوات لعرض الكتب، متابعة تفاعل القرّاء، وتحليل الأداء.",
    images: [
      "https://images.pexels.com/photos/8717959/pexels-photo-8717959.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6037566/pexels-photo-6037566.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6752320/pexels-photo-6752320.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/11025214/pexels-photo-11025214.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    id: "educator",
    heading: "معلّم",
    description:
      "المعلّم يحتاج إلى أدوات تُبسّط إدارة الصف وتُعزّز من جودة التفاعل. المنصّة تقدّم نظامًا لتعيين الواجبات، قياس مستوى الطلاب، وتحليل النتائج مباشرة.",
    images: [
      "https://images.pexels.com/photos/6266987/pexels-photo-6266987.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/7582590/pexels-photo-7582590.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6326377/pexels-photo-6326377.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/5212682/pexels-photo-5212682.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    id: "student",
    heading: "طالب",
    description:
      "الطالب يحتاج إلى أدوات تُساعده على الدراسة بذكاء وليس بكثرة. المنصّة توفّر ملخصات ذكية، تتبّع للإنجاز، ومحتوى تعليمي مبسّط يمكّنه من الفهم بسرعة.",
    images: [
      "https://images.pexels.com/photos/1251861/pexels-photo-1251861.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1326947/pexels-photo-1326947.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/261895/pexels-photo-261895.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
];


// Section wrapper fade animation
const sectionFade = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};


// Grid stagger animation
const gridStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const gridItem = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
};


// Image grid component
const ImageGrid = ({ images }) => {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      variants={gridStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {images.map((src, i) => (
        <motion.div
          key={i}
          variants={gridItem}
          whileHover={{ scale: 1.04, rotate: 1 }}
          className="relative overflow-hidden rounded-2xl shadow-md will-change-transform"
          style={{ aspectRatio: "1/1" }}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

const RoleSection = ({ role, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.section
      variants={sectionFade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 border-t border-[var(--earth-brown)]/10"
    >
      <div
        className="
          grid grid-cols-1 md:grid-cols-2 
          gap-12 items-center 
          px-6 md:px-16
        "
      >
        {/* TEXT SIDE - Now centered on all screens */}
        <div
          className={`
            w-full
            flex flex-col justify-center
            items-center text-center
            ${isEven ? "md:order-1" : "md:order-2"}
          `}
        >
          <h2 className="text-[32px] md:text-[42px] font-black text-[var(--earth-brown-dark)] mb-4">
            {role.heading}
          </h2>

          <p className="italic text-[18px] md:text-[20px] leading-[1.9] text-[var(--earth-brown)]/85 mb-8">
            {role.description}
          </p>
        </div>

        {/* IMAGES SIDE */}
        <div
          className={`
            w-full
            ${isEven ? "md:order-2" : "md:order-1"}
          `}
        >
          <ImageGrid images={role.images} />
        </div>
      </div>
    </motion.section>
  );
};

// Main page
export default function RolesPage() {
  return (
    <div dir="rtl" className="bg-[var(--earth-cream)] min-h-screen" id="roles">
      
      {/* HEADER */}
      <header className="pt-24 pb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block px-6 py-2 rounded-full border border-[var(--earth-brown)]/20 bg-[var(--earth-paper)] text-[var(--earth-brown)] text-sm mb-6"
        >
          منظومة متكاملة
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-black text-[var(--earth-brown-dark)] mb-4"
        >
          أدوار تتناغم معاً
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "96px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="h-1 bg-[var(--earth-olive)] mx-auto rounded-full"
        />
      </header>


      {/* SECTIONS */}
   {rolesData.map((role, index) => (
  <RoleSection key={role.id} role={role} index={index} />
))}


      <div className="h-24"></div>
    </div>
  );
}
