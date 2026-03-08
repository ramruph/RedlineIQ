"use client";

import { Badge } from "@/components/ui/badge";
import { clamp, ringColor } from "@/lib/utils/format";
import NeonFrame from "@/components/ui-kit/NeonFrame";

export default function Dial({
  label,
  value,
  unit,
  max,
  goodMin,
}: {
  label: string;
  value: number;
  unit: string;
  max: number;
  goodMin?: number;
}) {
  const pct = clamp((value / max) * 100, 0, 100);
  const ring = ringColor(pct, goodMin ?? 70);
  return (
    <NeonFrame className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-wide text-white/60">{label}</div>
        <Badge variant="secondary" className="bg-white/5 text-white/70">
          LIVE
        </Badge>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-3xl font-bold text-white">
          {value}
          <span className="ml-1 text-sm font-medium text-white/60">{unit}</span>
        </div>
        <div className="text-xs text-white/50">max {max}</div>
      </div>
      <div className="mt-3">
        <div className={`h-2 w-full rounded-full bg-gradient-to-r ${ring}`}>
          <div className="h-2 rounded-full bg-white/35" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-white/45">
          <span>0</span>
          <span>{Math.round(pct)}%</span>
          <span>{max}</span>
        </div>
      </div>
    </NeonFrame>
  );
}
