export default function SkeletonBookLoader() {
  return (
    <div className="animate-pulse bg-[var(--earth-paper)] rounded-xl p-4 shadow-sm border border-[var(--earth-sand)]">
      <div className="w-full h-40 bg-[var(--earth-sand)] rounded-md mb-4"></div>
      <div className="h-3 bg-[var(--earth-sand)] rounded mb-2 w-3/4"></div>
      <div className="h-3 bg-[var(--earth-sand)] rounded w-1/2"></div>
    </div>
  );
}
