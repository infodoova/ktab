/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import interactivevideo from "../../../assets/videos/interactive.mp4";
import ebookvideo from "../../../assets/videos/ebook.mp4";
import audiobookvideo from "../../../assets/videos/audiobook.mp4";
const FEATURES = [
  {
    id: "interactive",
    title: "القصص التفاعلية ",
    desc: "استمتع بتجربة قراءة فريدة حيث يمكن للقارئ اختيار مسار القصة. مع القصص التفاعلية، تتحول القراءة إلى مغامرة شخصية. يمكن للقارئ تحديد مسارات مختلفة تتضمن مؤامرات جديدة ونهايات غير متوقعة، مما يجعل كل تجربة قراءة مميزة.",
    video: interactivevideo,
    color: "#5de3ba",
  },
  {
    id: "digital",
    title: " الرف الرقمي",
    desc:"مكتبتك الرقمية على بعد خطوة واحدة. من خلال الرف الرقمي، يمكنك إضافة الكتب إلى قائمة الأمنيات، التحقق من التوصيات المخصصة، ومتابعة قراءتك حيث توقفت. كما يمكنك تتبع إنجازاتك وتقييم الكتب التي قرأتها لتحصل دائمًا على الأفضل.",
    video: ebookvideo,
    color: "#34d399",
  },
  {
    id: "audio",
    title: " النصوص الصوتية",
    desc: "اجعل القراءة أكثر سهولة وإمتاعًا مع النصوص الصوتية الغامرة. يمكن للقارئ الاستماع إلى الكتاب بدقة وجودة عالية، مع أصوات طبيعية تجعل من النصوص تجربة ممتعة وغنية. استمتع برواية القصص بتجربة صوتية غامرة تشعر وكأنك في قلب الحدث.",
    video: audiobookvideo,
    color: "#10b981",
  },
  // {
  //   id: "ai",
  //   title: " المساعد الذكي ",
  //   desc:  "مع مساعد الكاتب، يمكنك كتابة أول قصة تفاعلية لك حيث يمكنك تحديد المسار البصري والقصصي بينما يتولى الذكاء الاصطناعي باقي التفاصيل. إذا لم تكن راضيًا عن النهاية، يمكنك توليد نهايات جديدة بسهولة. كما يمكنك تلخيص النص وتحويله إلى نقاط رئيسية مما يسهل عليك إنشاء محتوى مرن يتكيف مع رؤيتك.",
  //   image: imgAI,
  //   color: "#059669",
  // },
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
      <div className="w-full px-6 py-28 md:py-40 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight text-[var(--secondary-text)] tracking-tight antialiased"
        >
          كيف تبدو <span className="text-[var(--primary-button)]">التجربة؟</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto font-medium text-[var(--secondary-text)]/60 leading-relaxed"
        >
          رحلة قراءة مصمّمة بهدوء، تتكشف خطوةً خطوة عبر مسارات تفاعلية مذهلة.
        </motion.p>
      </div>

      <div ref={containerRef} className="relative flex flex-col lg:flex-row max-w-[1920px] mx-auto items-start">
        
        {/* ==============================================
            LEFT SIDE: STICKY VISUALS (The Modern Part)
           ============================================== */}
        <div className="hidden lg:flex w-1/2 h-[calc(100vh-80px)] sticky top-20 items-center justify-center p-12 overflow-hidden">
          
          {/* Ambient Glow */}
          <div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 opacity-20"
             style={{ backgroundColor: FEATURES[activeIndex].color }}
          />

          {/* video Frame */}
          <div className="relative w-full aspect-[4/5] max-w-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-[#0f0f0f]">
            
            {/* The video Animation: Liquid Ripple Reveal */}
            <AnimatePresence initial={false}>
              {FEATURES.map((feature, index) => (
                index === activeIndex && (
                  <motion.div
                    key={feature.id}
                    initial={{ 
                      clipPath: "circle(0% at 50% 50%)",
                      scale: 1.1,
                      opacity: 0
                    }}
                    animate={{ 
                      clipPath: "circle(150% at 50% 50%)",
                      scale: 1,
                      opacity: 1
                    }}
                    exit={{ 
                      clipPath: "circle(0% at 50% 50%)",
                      opacity: 0,
                      scale: 0.9,
                    }}
                    transition={{ 
                       duration: 0.8,
                       ease: [0.65, 0, 0.35, 1],
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <video
                      src={feature.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )
              ))}
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
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px", amount: "some" });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  return (
    <div ref={ref} className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-24">
       
       <div className="lg:hidden mb-12 aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 relative shadow-2xl">
           <video
               src={feature.video}
               autoPlay
               loop
               muted
               playsInline
               className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
       </div>

       <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         viewport={{ once: true, margin: "-20%" }}
       >
         {/* Subtitle Tag */}
         <div className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-[var(--primary-button)]" />
            
         </div>
         
         <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight antialiased">
           {feature.title}
         </h3>

         <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-12 max-w-2xl font-medium tracking-tight">
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
      case 'digital':
        navigate('/reader/library');
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