"use client";

import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export default function ConstraintSlider({
  label,
  icon: Icon,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  icon: any;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
            <Icon className="h-4 w-4 text-white/70" />
          </div>
          <div>
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-[11px] text-white/50">{fmt(value)}</div>
          </div>
        </div>
        <Badge className="bg-white/5 text-white/70" variant="secondary">
          {fmt(value)}
        </Badge>
      </div>
      <div className="mt-3">
        <Slider value={[value]} min={min} max={max} step={step} onValueChange={(arr) => onChange(arr?.[0] ?? value)} />
        <div className="mt-2 flex justify-between text-[11px] text-white/45">
          <span>{fmt(min)}</span>
          <span>{fmt(max)}</span>
        </div>
      </div>
    </div>
  );
}
