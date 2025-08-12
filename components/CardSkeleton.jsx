export default function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10">
      <div className="aspect-[2/3] bg-white/10 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
}