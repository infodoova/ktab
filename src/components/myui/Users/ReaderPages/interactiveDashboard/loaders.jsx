import React from "react";

/**
 * Loaders Component
 * Simple skeleton loading states
 * Pure presentation component - all logic in mainComp
 */
function Loaders({ type = "initial" }) {
  // Initial loading (full page skeleton)
  if (type === "initial") {
    return (
      <div className="flex-1 w-full p-4 md:p-8 animate-in fade-in duration-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Sidebar Skeletons */}
          <div className="lg:col-span-5 space-y-8">
            {/* Image Box Skeleton */}
            <div className="relative w-full aspect-video bg-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--primary-button)]/10 border-t-[var(--primary-button)] rounded-full animate-spin" />
                <div className="h-2 w-24 bg-[var(--primary-button)]/10 rounded-full" />
              </div>
            </div>
            
            {/* Journey History Skeleton */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex justify-between">
                <div className="h-3 bg-white/10 rounded-full w-24 animate-pulse" />
                <div className="h-3 bg-white/10 rounded-full w-16 animate-pulse" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-10 h-10 bg-[var(--primary-button)]/5 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>

            {/* Progress Skeleton */}
            <div className="hidden lg:block bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="h-3 bg-white/10 rounded-full w-20 animate-pulse" />
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden" />
            </div>
          </div>
          
          {/* Main Content Skeletons */}
          <div className="lg:col-span-7 space-y-8">
            {/* Narrative Skeleton */}
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 space-y-6 border border-white/10">
              <div className="h-6 bg-[var(--primary-button)]/10 rounded-full w-24 animate-pulse" />
              <div className="space-y-4">
                <div className="h-3.5 bg-white/10 rounded-full w-full animate-pulse" />
                <div className="h-3.5 bg-white/10 rounded-full w-[95%] animate-pulse" />
                <div className="h-3.5 bg-white/10 rounded-full w-[98%] animate-pulse" />
                <div className="h-3.5 bg-white/10 rounded-full w-4/5 animate-pulse" />
              </div>
            </div>

            {/* Choice Nodes Skeleton */}
            <div className="space-y-4">
              <div className="h-3 bg-white/10 rounded-full w-24 mb-6 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-2xl border-2 border-white/10 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generating next scene
  if (type === "generating") {
    return (
      <div className="w-full space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-[var(--primary-button)] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-[var(--primary-button)] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-[var(--primary-button)] rounded-full animate-bounce" />
          </div>
          <p className="text-[var(--primary-button)] text-sm font-black opacity-80 tracking-widest uppercase">
            يرسم الذكاء الاصطناعي ملامح طريقك...
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/30 rounded-2xl border-2 border-white/20 animate-pulse flex flex-col justify-center px-6 space-y-3">
              <div className="h-3 bg-[var(--earth-brown)]/10 rounded-full w-3/4" />
              <div className="h-2 bg-[var(--earth-brown)]/5 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Text generation skeleton
  if (type === "text") {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="h-6 bg-[var(--earth-olive)]/10 rounded-full w-24 animate-pulse" />
        <div className="space-y-4">
          <div className="h-3.5 bg-[var(--earth-sand)]/20 rounded-full w-full animate-pulse" />
          <div className="h-3.5 bg-[var(--earth-sand)]/20 rounded-full w-[95%] animate-pulse" />
          <div className="h-3.5 bg-[var(--earth-sand)]/20 rounded-full w-[98%] animate-pulse" />
          <div className="h-3.5 bg-[var(--earth-sand)]/20 rounded-full w-4/5 animate-pulse" />
        </div>
      </div>
    );
  }

  // Generic loader
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="relative">
        {/* Subtle background ring matched to image style */}
        <div className="absolute inset-0 -m-4 border border-[var(--earth-sand)]/20 rounded-full animate-pulse" />
        <div className="absolute inset-0 -m-8 border border-[var(--earth-sand)]/10 rounded-full animate-pulse delay-700" />
        
        {/* Simple spinner */}
        <div className="w-8 h-8 border-2 border-[var(--earth-sand)]/30 border-t-[var(--earth-olive)] rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default Loaders;
