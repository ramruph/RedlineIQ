"use client";

import { scoreTone } from "@/lib/utils/format";

export default function ScoreChip({ label, value }: { label: string; value: number }) {
  const tone = scoreTone(value);
  const map: Record<string, string> = {
    emerald: "bg-emerald-400/15 text-emerald-200 border-emerald-300/20",
    indigo: "bg-indigo-400/15 text-indigo-200 border-indigo-300/20",
    amber: "bg-amber-400/15 text-amber-200 border-amber-300/20",
    rose: "bg-rose-400/15 text-rose-200 border-rose-300/20",
  };
  return (
    <div className={`rounded-xl border px-2 py-2 ${map[tone]}`}>
      <div className="text-[10px] opacity-80">{label}</div>
      <div className="text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}
