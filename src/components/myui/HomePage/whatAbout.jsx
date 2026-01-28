/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imgAI from "../../../assets/images/ai.png";
import imgListen from "../../../assets/images/listen.png";
import imgInteractive from "../../../assets/images/interactive.png";
import imgProgress from "../../../assets/images/progress.png";
import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";

const FEATURES = [
  {
    id: "ai",
    title: "بصيرة كتاب",
    subtitle: "الذكاء الاصطناعي",
    desc: "استمتع بتجربة قراءة ذكية تتجاوز مجرد الكلمات. بصيرة كُتّاب هي رفيقك المعرفي الذي يحلل النصوص العميقة بدقة متناهية، ويبسط المفاهيم اللغوية المعقدة بلمح البصر، ليفتح أمامك آفاقاً غير مسبوقة للحوار وفهم المعاني المخفية بين السطور.",
    image: imgAI,
    color: "#5de3ba",
  },
  {
    id: "interactive",
    title: "الرواية الحية",
    subtitle: "مسارك الخاص",
    desc: "تحول من مجرد قارئ إلى بطل حقيقي في قلب القصة. في عالم الرواية الحية، كل قرار تتخذه هو مفتاح لمسار جديد كلياً. عش تجربة سردية ديناميكية تتغير فيها الأحداث وفق خياراتك، مما يجعل كل كتاب رحلة فريدة تخصك أنت وحدك مع نهايات مذهلة ومتعددة.",
    image: imgInteractive,
    color: "#34d399",
  },
  {
    id: "audio",
    title: "أثير المعرفة",
    subtitle: "تجربة صوتية",
    desc: "استمع إلى كتبك المفضلة بأصوات طبيعية ودافئة تلامس الوجدان. تقنية 'أثير' المتطورة تحول القراءة إلى تجربة سينمائية مسموعة، حيث يتم التركيز على جمالية الإيقاع اللغوي السليم، لتغوص في بحر المعرفة أينما كنت وفي أي وقت بتركيز كامل وعميق.",
    image: imgListen,
    color: "#10b981",
  },
  {
    id: "progress",
    title: "أثرك الباقي",
    subtitle: "رحلة الإنجاز",
    desc: "رؤية واضحة لنموك المعرفي بلمسات تصميمية فاخرة. 'أثرك الباقي' ليست مجرد لوحة تحكم، بل هي سجل لإنجازاتك القرائية التي ترصد تطورك مستوى بمستوى. حول شغفك بالقراءة إلى أرقام ملموسة ونجاحات باهرة تدفعك دائماً نحو القمة.",
    image: imgProgress,
    color: "#059669",
  },
];

export default function WhatAbout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  return (
    <section 
      id="what-about" 
      dir="rtl"
      className="relative bg-[var(--bg-dark)] py-32"
    >
      {/* 1. SECTION HEADER */}
     <div className="text-center mb-24 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[var(--secondary-text)] tracking-tight">
            كيف تبدو{" "}
            <span className=" bg-clip-text text-[var(--primary-button)]">
              التجربة؟
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-[var(--secondary-text)]/60 font-medium leading-relaxed">
            رحلة قراءة مصمّمة بهدوء، تتكشف خطوةً خطوة عبر مسارات تفاعلية مذهلة.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="relative flex flex-col lg:flex-row max-w-[1920px] mx-auto">
        
        {/* ==============================================
            LEFT SIDE: STICKY VISUALS (The Modern Part)
           ============================================== */}
        <div className="hidden lg:flex w-1/2 h-screen sticky top-0 items-center justify-center p-12 overflow-hidden">
          
          {/* Ambient Glow */}
          <div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 opacity-20"
             style={{ backgroundColor: FEATURES[activeIndex].color }}
          />

          {/* Image Frame */}
          <div className="relative w-full aspect-[4/5] max-w-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-[#0f0f0f]">
            
            {/* The Image Animation: Liquid Ripple Reveal */}
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ 
                  clipPath: "circle(0% at 50% 50%)",
                  scale: 1.1,
                }}
                animate={{ 
                  clipPath: "circle(150% at 50% 50%)",
                  scale: 1,
                }}
                transition={{ 
                   duration: 0.6,
                   ease: [0.65, 0, 0.35, 1], // Fast and smooth
                   scale: {
                     duration: 0.6,
                     ease: "easeOut"
                   }
                }}
                className="absolute inset-0 w-full h-full"
              >
                <ResponsiveImageSkeleton
                  src={FEATURES[activeIndex].image}
                  alt={FEATURES[activeIndex].title}
                  className="w-full h-full"
                  imgClassName="object-cover w-full h-full"
                />
              </motion.div>
            </AnimatePresence>


          </div>
        </div>

        {/* ==============================================
            RIGHT SIDE: SCROLLING CONTENT
           ============================================== */}
        <div className="w-full lg:w-1/2">
          {FEATURES.map((feature, index) => (
            <FeatureTextSection 
               key={feature.id} 
               feature={feature} 
               index={index} 
               setActiveIndex={setActiveIndex} 
            />
          ))}
          {/* Spacer for bottom scroll */}
          <div className="h-[20vh]" />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Sub-Component: Text Section with Trigger
// ------------------------------------------------------------------
function FeatureTextSection({ feature, index, setActiveIndex }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) setActiveIndex(index);
  }, [isInView, index, setActiveIndex]);

  return (
    <div ref={ref} className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-24">
       
       {/* Mobile-Only Image Card */}
       <div className="lg:hidden mb-12 aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 relative shadow-2xl">
           <ResponsiveImageSkeleton
               src={feature.image}
               alt={feature.title}
               className="w-full h-full"
               imgClassName="object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
           <div className="absolute bottom-6 right-6">
              <span className="text-[var(--primary-button)] font-bold text-xs uppercase tracking-widest">{feature.subtitle}</span>
           </div>
       </div>

       <motion.div
         initial={{ opacity: 0, x: 50 }}
         whileInView={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         viewport={{ once: true, margin: "-20%" }}
       >
         {/* Number */}
         <div className="flex items-center gap-4 mb-8">
            <span className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 font-mono">
              {feature.number}
            </span>
            <div className="h-[2px] w-20 bg-[var(--primary-button)]" />
         </div>

         <h3 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
           {feature.title}
         </h3>

         {/* UPDATED: Bigger, more legible body text */}
         <p className="text-xl md:text-3xl text-gray-300 leading-[1.6] mb-12 max-w-2xl font-medium tracking-tight">
           {feature.desc}
         </p>

         <ModernButton feature={feature} />
       </motion.div>
    </div>
  );
}

// ------------------------------------------------------------------
// Sub-Component: Modern Smooth Button
// ------------------------------------------------------------------
function ModernButton({ feature }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate based on feature ID
    switch (feature.id) {
      case 'ai':
        navigate('/reader/library');
        break;
      case 'audio':
        navigate('/reader/library');
        break;
      case 'interactive':
        navigate('/reader/interactive-stories');
        break;
      case 'progress':
        navigate('/reader/Achievements');
        break;
      default:
        break;
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="group relative px-8 py-4 bg-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_0_0_rgba(255,255,255,0.7)] hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
    >
      {/* Liquid Fill Effect */}
      <div 
        className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"
        style={{ backgroundColor: feature.color }}
      />
      
      <div className="relative z-10 flex items-center gap-2">
        <span className="font-bold text-black group-hover:text-white transition-colors duration-300">
          اكتشف المزيد
        </span>
        <svg 
           width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
           className="text-black group-hover:text-white transition-all duration-300 rotate-180 group-hover:-translate-x-1"
        >
           <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}