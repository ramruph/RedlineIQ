"use client";

export default function KpiCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/55">{label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
          <Icon className="h-4 w-4 text-white/70" />
        </div>
      </div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
      {sub ? <div className="text-[11px] text-white/45">{sub}</div> : null}
    </div>
  );
}
