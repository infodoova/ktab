import { cn } from "@/lib/utils";

function Loaders({ type = "initial", isDarkMode = true }) {
  // Styles based on theme
  const bgSubtle = isDarkMode ? "bg-white/5" : "bg-black/5";
  const bgPulse = isDarkMode ? "bg-white/10" : "bg-black/10";
  const borderSubtle = isDarkMode ? "border-white/5" : "border-black/5";
  const borderPulse = isDarkMode ? "border-white/10" : "border-black/10";
  const shimmerColor = isDarkMode ? "via-white/5" : "via-black/5";

  // Initial loading (full page skeleton)
  if (type === "initial") {
    return (
      <div className="flex-1 w-full p-4 md:p-8 animate-in fade-in duration-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Sidebar Skeletons */}
          <div className="lg:col-span-5 space-y-8">
            {/* Image Box Skeleton - Simplified */}
            <div className={cn(
              "relative w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden border flex flex-col items-center justify-center",
              bgSubtle, borderPulse
            )}>
              <div className="w-12 h-12 border-4 border-[#5de3ba]/10 border-t-[#5de3ba] rounded-full animate-spin" />
            </div>
            
            {/* Journey History Skeleton */}
            <div className={cn("rounded-2xl p-6 border space-y-4", bgSubtle, borderPulse)}>
              <div className="flex justify-between">
                <div className={cn("h-3 rounded-full w-24 animate-pulse", bgPulse)} />
                <div className={cn("h-3 rounded-full w-16 animate-pulse", bgPulse)} />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-10 h-10 bg-[#5de3ba]/5 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>

            {/* Progress Skeleton */}
            <div className={cn("hidden lg:block rounded-2xl p-6 border space-y-4", bgSubtle, borderPulse)}>
              <div className={cn("h-3 rounded-full w-20 animate-pulse", bgPulse)} />
              <div className={cn("w-full h-1.5 rounded-full overflow-hidden", bgPulse)} />
            </div>
          </div>
          
          {/* Main Content Skeletons */}
          <div className="lg:col-span-7 space-y-8">
            {/* Narrative Skeleton */}
            <div className={cn("rounded-[2.5rem] p-8 md:p-12 space-y-6 border", bgSubtle, borderPulse)}>
              <div className="h-6 bg-[#5de3ba]/10 rounded-full w-24 animate-pulse" />
              <div className="space-y-4 text-right">
                <div className={cn("h-3.5 rounded-full w-full animate-pulse", bgPulse)} />
                <div className={cn("h-3.5 rounded-full w-[95%] animate-pulse", bgPulse)} />
                <div className={cn("h-3.5 rounded-full w-[98%] animate-pulse", bgPulse)} />
                <div className={cn("h-3.5 rounded-full w-4/5 animate-pulse", bgPulse)} />
              </div>
            </div>

            {/* Choice Nodes Skeleton */}
            <div className="space-y-4">
              <div className={cn("h-3 rounded-full w-24 mb-6 animate-pulse", bgPulse)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={cn("h-20 rounded-2xl border-2 animate-pulse relative overflow-hidden", bgSubtle, borderPulse)}>
                    <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full animate-[shimmer_2s_infinite]", shimmerColor)} />
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
            <div className="w-1.5 h-1.5 bg-[#5de3ba] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-[#5de3ba] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-[#5de3ba] rounded-full animate-bounce" />
          </div>
          <p className="text-[#5de3ba] text-sm font-black opacity-80 tracking-widest uppercase font-tajawal">
            يرسم الذكاء الاصطناعي ملامح طريقك...
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-24 rounded-2xl border-2 animate-pulse flex flex-col justify-center px-6 space-y-3", isDarkMode ? "bg-white/10 border-white/5" : "bg-black/5 border-black/5")}>
              <div className={cn("h-3 rounded-full w-3/4", isDarkMode ? "bg-white/10" : "bg-black/10")} />
              <div className={cn("h-2 rounded-full w-1/2", isDarkMode ? "bg-white/5" : "bg-black/5")} />
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
        <div className="h-6 bg-[#5de3ba]/10 rounded-full w-24 animate-pulse" />
        <div className="space-y-4">
          <div className={cn("h-3.5 rounded-full w-full animate-pulse", bgPulse)} />
          <div className={cn("h-3.5 rounded-full w-[95%] animate-pulse", bgPulse)} />
          <div className={cn("h-3.5 rounded-full w-[98%] animate-pulse", bgPulse)} />
          <div className={cn("h-3.5 rounded-full w-4/5 animate-pulse", bgPulse)} />
        </div>
      </div>
    );
  }

  // Generic loader
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="relative">
        <div className={cn("absolute inset-0 -m-4 border rounded-full animate-pulse", isDarkMode ? "border-white/10" : "border-black/5")} />
        <div className={cn("absolute inset-0 -m-8 border rounded-full animate-pulse delay-700", isDarkMode ? "border-white/5" : "border-black/5")} />
        <div className="w-8 h-8 border-2 border-[#5de3ba]/30 border-t-[#5de3ba] rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default Loaders;
