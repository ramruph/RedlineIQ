"use client";

export default function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="text-[10px] text-white/50">{label}</div>
      <div className="text-xs font-semibold text-white">{value}</div>
    </div>
  );
}
