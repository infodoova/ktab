import React from "react";
import { Bot } from "lucide-react";

export default function AiGeneratingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center 
                    backdrop-blur-sm bg-gradient-to-b 
                    from-[var(--earth-paper)]/90 to-[var(--earth-cream)]/95
                    overflow-hidden">

      {/* Animated Box */}
      <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-xl
                      border border-[var(--earth-sand)]/40 bg-[var(--earth-cream)]">

        {/* Diagonal Filling Wave */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="
            absolute w-[200%] h-[200%]
            bg-gradient-to-br
            from-[var(--earth-olive)]/45 
            via-[var(--earth-sand)]/45 
            to-[var(--earth-brown)]/45
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
              bg-[var(--earth-olive)]/40 blur-2xl
              animate-pulse
            " />

            <Bot
              size={72}
              className="relative text-[var(--earth-brown)] drop-shadow-lg opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="mt-6 text-center fade-up">
        <p className="text-[var(--earth-brown-dark)] text-xl font-bold tracking-wide">
          جاري توليد الخلاصة
        </p>
        <p className="text-[var(--earth-brown)]/70 text-sm mt-1">
          يُرجى الانتظار...
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        /* Diagonal fill wave moving up-right */
        @keyframes waveFill {
          0% {
            transform: translate(-80%, 80%) rotate(12deg);
          }
          100% {
            transform: translate(20%, -20%) rotate(12deg);
          }
        }

        .animate-waveFill {
          animation: waveFill 2.5s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
