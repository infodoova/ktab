import React from "react";
import { Bot } from "lucide-react";

export default function AiGeneratingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center 
                    backdrop-blur-xl bg-white/70 
                    overflow-hidden z-[100]">

      {/* Animated Box */}
      <div className="relative w-48 h-48 rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)]
                      border border-black/5 bg-white">

        {/* Diagonal Filling Wave */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="
            absolute w-[200%] h-[200%]
            bg-gradient-to-br
            from-[#5de3ba]/10 
            via-[#5de3ba]/30 
            to-[#5de3ba]/5
            animate-waveFill
            "
          />
        </div>

        {/* Same-size BOT ICON (72px) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">

            {/* Glow behind icon */}
            <div className="
              absolute inset-0 rounded-full 
              bg-[#5de3ba]/20 blur-3xl
              animate-pulse
            " />

            <Bot
              size={80}
              className="relative text-black drop-shadow-2xl opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="mt-10 text-center animate-fadeIn">
        <p className="text-black text-2xl md:text-3xl font-black tracking-tight">
          جاري توليد الخاتمة الذكية
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
           <div className="w-1.5 h-1.5 rounded-full bg-[#5de3ba] animate-bounce" style={{ animationDelay: '0ms' }} />
           <div className="w-1.5 h-1.5 rounded-full bg-[#5de3ba] animate-bounce" style={{ animationDelay: '200ms' }} />
           <div className="w-1.5 h-1.5 rounded-full bg-[#5de3ba] animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
        <p className="text-black/40 text-sm font-bold mt-4 uppercase tracking-widest">
          يُرجى الانتظار، نحن نقرأ كتابك بعناية...
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes waveFill {
          0% {
            transform: translate(-80%, 80%) rotate(12deg);
          }
          100% {
            transform: translate(20%, -20%) rotate(12deg);
          }
        }

        .animate-waveFill {
          animation: waveFill 3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
