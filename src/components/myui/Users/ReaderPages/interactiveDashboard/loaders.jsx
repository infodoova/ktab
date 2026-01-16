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
      <div className="h-full flex flex-col p-4 max-w-4xl mx-auto w-full gap-2 md:gap-3">
        {/* Image skeleton - matched to image size */}
        <div className="mb-1 w-full max-w-lg mx-auto aspect-video bg-gradient-to-r from-[var(--earth-sand)]/20 via-[var(--earth-cream)]/50 to-[var(--earth-sand)]/20 rounded-lg animate-pulse" />
        
        {/* Text skeleton */}
        <div className="mb-1 glass rounded-lg p-3 border border-[var(--earth-sand)]/10">
          <div className="space-y-1.5">
            <div className="h-2 bg-[var(--earth-sand)]/30 rounded animate-pulse w-full" />
            <div className="h-2 bg-[var(--earth-sand)]/30 rounded animate-pulse w-5/6" />
          </div>
        </div>

        {/* Nodes skeleton */}
        <div className="grid grid-cols-2 gap-2">
          <div className="glass h-12 rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
          <div className="glass h-12 rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
          <div className="glass h-12 rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
          <div className="glass h-12 rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
        </div>
      </div>
    );
  }

  // Generating next scene (skeleton overlay on nodes area)
  if (type === "generating") {
    return (
      <div className="flex flex-col h-full">
        <div className="text-center mb-1 flex-shrink-0">
          <p className="text-[var(--earth-brown-dark)] text-[10px] font-medium opacity-60">
            🤖 جاري التحميل...
          </p>
        </div>
        
        {/* Skeleton nodes while generating */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div className="glass rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
          <div className="glass rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
          <div className="glass rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
          <div className="glass rounded-lg border border-[var(--earth-sand)]/10 animate-pulse" />
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
