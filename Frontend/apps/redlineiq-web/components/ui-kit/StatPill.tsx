"use client";

import React from "react";

export default function StatPill({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
        <Icon className="h-5 w-5 text-white/80" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] tracking-wide text-white/60">{label}</div>
        <div className="truncate text-sm font-semibold text-white">{value}</div>
        {hint ? <div className="text-[11px] text-white/40">{hint}</div> : null}
      </div>
    </div>
  );
}
