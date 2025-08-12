export default function RatingBadge({ value }) {
  if (!value && value !== 0) return null;
  const v = Math.round(value * 10) / 10;
  return (
    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 ring-1 ring-green-500/30">
      {v}
    </span>
  );
}