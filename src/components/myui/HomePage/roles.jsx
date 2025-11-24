/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  GraduationCap,
  Building2,
} from "lucide-react";

const roles = [
  {
    id: "reader",
    label: "قارئ",
    summary: "تجربة قراءة جذابة وسهلة للأطفال واليافعين.",
    icon: BookOpen,
  },
  {
    id: "parent",
    label: "أهل",
    summary: "متابعة دقيقة لسلوك أطفالك القرائي.",
    icon: Users,
  },
  {
    id: "teacher",
    label: "معلّم",
    summary: "أدوات متقدمة لإدارة القراءة داخل الصف.",
    icon: GraduationCap,
  },
  {
    id: "school",
    label: "مدرسة",
    summary: "رؤية مؤسسية واضحة لمستوى القراءة.",
    icon: Building2,
  },
];

// Seamless loop data
const loopData = [...roles, ...roles];

export default function RolesSection() {
  return (
    <section
      id="roles"
      dir="rtl"
      className="w-full py-24 bg-[#faf7f2] border-t border-[var(--earth-sand)]/30 overflow-hidden"
    >
      {/* 1. Define the CSS Scroll Animation */}
      <style>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-loop {
          animation: infinite-scroll 15s linear infinite;
        }
        /* PAUSE ON HOVER */
        .animate-scroll-loop:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* HEADER */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--earth-brown)]">
          أدوار مختلفة. منصة واحدة.
        </h2>
        <p className="mt-4 text-lg text-[var(--earth-brown)]/65 max-w-2xl mx-auto">
          تجربة مصمّمة لتناسب القارئ، الأهل، المعلّم، والمدرسة.
        </p>
      </div>

      {/* INFINITE LOOP CONTAINER */}
      <div className="relative w-full overflow-hidden py-10" dir="ltr">
        
        {/* THE TRACK */}
        <div className="flex gap-10 w-max animate-scroll-loop">
          {loopData.map((role, index) => {
            const Icon = role.icon;

            return (
              <motion.div
                dir="rtl"
                key={index}
                // --- UPDATED ANIMATION ---
                whileHover={{
                  scale: 1.02, // Slightly less zoom for a cleaner feel
                  rotate: [0, -0.5, 0.5, -0.5, 0], // Much smaller degrees (subtle wobble)
                  transition: {
                    rotate: {
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 0.4, // Slower duration for a "floating" feel rather than "shaking"
                      ease: "easeInOut"
                    },
                    scale: { duration: 0.2 }
                  }
                }}
                className="
                  min-w-[380px] md:min-w-[420px] lg:min-w-[480px]
                  bg-[var(--earth-paper)] /* Used paper color from index.css */
                  p-10 
                  rounded-[2rem] /* More modern rounded corners */
                  shadow-lg
                  
                  /* --- NEW BORDER STYLING --- */
                  border-2 
                  border-[var(--earth-sand)] 
                  hover:border-[var(--earth-olive)] /* Transitions to Olive */
                  hover:shadow-2xl 
                  hover:shadow-[var(--earth-olive)]/10 /* Subtle colored glow */
                  transition-colors duration-300 /* Smooths the border color change */
                  
                  cursor-pointer group relative
                  flex flex-col items-center
                "
              >
                {/* HOVER GLOW EFFECT */}
                <div
                  className="
                    absolute inset-0 rounded-[2rem] 
                    opacity-0 group-hover:opacity-100 
                    blur-xl 
                    bg-gradient-to-br 
                    from-[var(--earth-olive)]/10 
                    to-[var(--earth-brown)]/5
                    transition-all duration-500 pointer-events-none
                  "
                />

                {/* ICON */}
                <div className="flex justify-center mb-6 relative z-10">
                  <div className="
                    w-20 h-20 flex items-center justify-center
                    rounded-2xl 
                    bg-[var(--earth-cream)] /* Contrast against paper bg */
                    border border-[var(--earth-sand)]
                    group-hover:scale-110 transition-transform duration-300
                  ">
                    <Icon className="h-10 w-10 text-[var(--earth-brown)] group-hover:text-[var(--earth-olive)] transition-colors duration-300" />
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="text-3xl font-bold text-[var(--earth-brown-dark)] text-center relative z-10">
                  {role.label}
                </h3>

                {/* SUMMARY */}
                <p className="text-[var(--earth-brown)]/80 text-lg mt-3 text-center relative z-10">
                  {role.summary}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}