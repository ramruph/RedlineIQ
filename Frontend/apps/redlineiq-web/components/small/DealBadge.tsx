"use client";

import { scoreTone } from "@/lib/utils/format";

export default function DealBadge({ score }: { score: number }) {
  const tone = scoreTone(score);
  const map: Record<string, string> = {
    emerald: "border-emerald-300/20 bg-emerald-400/15 text-emerald-200",
    indigo: "border-indigo-300/20 bg-indigo-400/15 text-indigo-200",
    amber: "border-amber-300/20 bg-amber-400/15 text-amber-200",
    rose: "border-rose-400/15 text-rose-200 border-rose-300/20",
  };
  return (
    <span className={`inline-flex items-center justify-center rounded-full border px-2 py-[2px] text-[11px] font-semibold ${map[tone]}`}>
      {score}
    </span>
  );
}
