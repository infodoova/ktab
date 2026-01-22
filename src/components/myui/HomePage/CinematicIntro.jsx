/* eslint-disable*/
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CinematicIntro({ onComplete }) {
  // simplified phase system: 'gathering' -> 'impact' -> 'exit'
  const [phase, setPhase] = useState("gathering");

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Gathering
      await wait(1200);
      setPhase("impact");
      
      // Phase 2: Impact/Hold (Faster: 0.8s)
      await wait(800); 
      setPhase("exit");
      
      // Phase 3: Fast Exit (0.5s) then callback
      await wait(500);
      onComplete?.();
    };
    sequence();
  }, [onComplete]);

  // --- Animation Variants ---

  // The main container reveal effect (Center Split)
  const containerVariants = {
    initial: { clipPath: "inset(0% 0% 0% 0%)" },
    exit: { 
      clipPath: "inset(50% 0% 50% 0%)",
      transition: { duration: 0.5, ease: [0.8, 0, 0.2, 1] } 
    }
  };

  const letterContainerVariants = {
    gathering: { opacity: 1 },
    impact: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      filter: "blur(20px)", 
      scale: 3, 
      z: 500, // CSS perspective needed on container
      y: 100 
    },
    gathering: (i) => ({
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      z: 0,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], // Custom energetic spring-like curve
        delay: i * 0.1 
      }
    }),
    impact: {
      scale: 1,
      filter: "blur(0px)",
      color: "#ffffff",
      textShadow: "0px 0px 0px rgba(255,255,255,0)"
    }
  };

  // The final word "Fly Through" effect
  const wordVariants = {
    hidden: { opacity: 0 },
    impact: {
      opacity: 1,
      scale: [1.1, 1], 
      filter: ["blur(10px)", "blur(0px)"],
      transition: { duration: 0.2, ease: "circOut" }
    },
    exit: {
      scale: 10, // Fly INTO the camera
      opacity: 0,
      filter: "blur(20px)",
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  // The "RGB Split" Chromatic Aberration effect layers
  const glitchVariants = {
    hidden: { opacity: 0, x: 0 },
    impact: {
      opacity: [0, 0.8, 0],
      x: [-5, 5, -2, 2, 0], // Jitter
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none"
      variants={containerVariants}
      initial="initial"
      animate={phase === "exit" ? "exit" : "initial"}
    >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black opacity-90" />

<div className="absolute inset-0 z-30 flex items-center justify-center perspective-[1000px] relative">
        
        {phase === "gathering" && (
          <motion.div 
            dir="rtl" 
            variants={letterContainerVariants}
            initial="hidden"
            animate="gathering"
            exit="exit"
            className="flex gap-1 md:gap-4 absolute"
          >
            {["ك", "ت", "ا", "ب"].map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                className="text-white font-black text-7xl md:text-9xl leading-none inline-block origin-center"
                style={{ 
                  fontFamily: "'Tajawal', sans-serif",
                  textShadow: "0 0 30px rgba(255,255,255,0.3)"
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* 2. IMPACT PHASE (The Unified Word) */}
        {phase !== "gathering" && (
          <motion.div className="relative">
            
            {/* Red Channel Glitch */}
            <motion.div
              variants={glitchVariants}
              initial="hidden"
              animate="impact"
              className="absolute inset-0 text-red-500 mix-blend-screen select-none"
              style={{ fontFamily: "'Tajawal', sans-serif", fontSize: "clamp(4.5rem, 10vw, 8rem)", fontWeight: 900 }}
            >
              كتاب
            </motion.div>

            {/* Blue Channel Glitch */}
            <motion.div
              variants={glitchVariants}
              initial="hidden"
              animate="impact"
              transition={{ delay: 0.05 }}
              className="absolute inset-0 text-blue-500 mix-blend-screen select-none"
              style={{ fontFamily: "'Tajawal', sans-serif", fontSize: "clamp(4.5rem, 10vw, 8rem)", fontWeight: 900 }}
            >
              كتاب
            </motion.div>

            {/* Main White Text */}
            <motion.h1
              variants={wordVariants}
              initial="hidden"
              animate={phase === "exit" ? "exit" : "impact"}
              className="relative z-10 text-white font-black leading-none"
              style={{ 
                fontFamily: "'Tajawal', sans-serif",
                fontSize: "clamp(4.5rem, 10vw, 8rem)",
                filter: "drop-shadow(0 0 20px rgba(255,255,255,0.5))"
              }}
            >
              كتاب
            </motion.h1>

            {/* Subtitle Reveal */}
            <motion.div
              initial={{ opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
              animate={phase === "impact" ? { opacity: 1, clipPath: "inset(0 0% 0 0%)" } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="absolute -bottom-16 left-0 right-0 text-center"
            >
              <p className="text-gray-400 text-lg md:text-xl tracking-[0.2em] uppercase font-light" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                رحلتك تبدأ الآن
              </p>
            </motion.div>

          </motion.div>
        )}

        {/* 3. FLASH EFFECT (The "Camera Flash") */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={phase === "impact" ? { opacity: [0, 0.8, 0] } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white mix-blend-overlay z-40"
        />
        
        {/* Horizontal Lens Flare Line - Updated to Mint */}
        <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase === "impact" ? { scaleX: [0, 1.5, 0], opacity: [0, 1, 0] } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-1/2 left-0 right-0 h-[1px] bg-[var(--primary-button)] blur-[2px] z-30"
        />
      </div>

    </motion.div>
  );
}