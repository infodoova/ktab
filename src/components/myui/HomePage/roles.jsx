/* eslint-disable */
import React from "react";
import { motion } from "framer-motion";
import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";

// Role data
const rolesData = [
  {
    id: "reader",
    heading: "القارئ",
    subHeading: "عالم من الخيال في انتظارك",
    description: "تجربة قراءة واضحة ومريحة تُساعده على الاستمرار مع أدوات ذكية لتتبّع التقدّم والمكتبة الشخصية.",
    image: "https://images.pexels.com/photos/3494806/pexels-photo-3494806.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "author",
    heading: "المؤلّف",
    subHeading: "أطلق العنان لإبداعك",
    description: "بيئة نشر تدعم الإبداع وتُسهّل الوصول إلى الجمهور مع أدوات احترافية لعرض الكتب وتحليل الأداء.",
    image: "https://images.pexels.com/photos/8717959/pexels-photo-8717959.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "educator",
    heading: "المعلّم",
    subHeading: "إدارة تعليمية بلمسة ذكية",
    description: "أدوات تُبسّط إدارة الصف وتُعزّز التفاعل من خلال نظام تعيين الواجبات وقياس مستوى الطلاب.",
    image: "https://images.pexels.com/photos/6266987/pexels-photo-6266987.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "student",
    heading: "الطالب",
    subHeading: "تعلّم بذكاء وسرعة",
    description: "أدوات تُساعدك على الدراسة بذكاء من خلال ملخصات ذكية وتتبّع دقيق للإنجاز الأكاديمي.",
    image: "https://images.pexels.com/photos/1251861/pexels-photo-1251861.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const RoleCard = ({ role, index }) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-[#111111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[var(--primary-button)]/30 transition-all duration-500"
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <ResponsiveImageSkeleton
          src={role.image}
          alt={role.heading}
          className="w-full h-full"
          imgClassName="object-cover" // Removed hover scaling
          rounded="rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
      </div>

      <div className="p-8 md:p-10">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-2">{role.heading}</h3>
        <p className="text-[var(--primary-button)] text-xs font-black tracking-[0.2em] uppercase mb-4 opacity-80">
          {role.subHeading}
        </p>
        <p className="text-white/50 text-lg leading-relaxed font-medium">
          {role.description}
        </p>
      </div>
    </motion.div>
  );
};



export default function RolesPage() {
  return (
    <section id="roles" dir="rtl" className="py-24 md:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center relative">
          {/* Subtle background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-button)]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.h2
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter relative z-10"
          >
            أدوار <span className="text-[var(--primary-button)] text-glow">تتناغم</span> معاً
          </motion.h2>
          <motion.p
             initial={{ opacity: 1, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-50px" }}
             transition={{ delay: 0.2 }}
             className="mt-6 text-xl md:text-2xl text-white/30 max-w-2xl mx-auto leading-relaxed relative z-10 font-medium"
          >
            بيئة رقمية شاملة تجمع كل أطراف العملية الإبداعية والتعليمية في فضاء واحد.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {rolesData.map((role, index) => (
            <RoleCard key={role.id} role={role} index={index} />
          ))}
        </div>
      </div>
      
      <style>{`
        .text-glow {
          text-shadow: 0 0 30px rgba(93, 227, 186, 0.2);
        }
      `}</style>
    </section>
  );
}
