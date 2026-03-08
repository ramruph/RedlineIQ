"use client";

import React from "react";

export function TableHeader({ cols }: { cols: string[] }) {
  return (
    <div
      className="grid gap-2 border-b border-white/10 pb-2 text-[11px] font-semibold text-white/55"
      style={{ gridTemplateColumns: cols.map(() => "1fr").join(" ") }}
    >
      {cols.map((c) => (
        <div key={c}>{c}</div>
      ))}
    </div>
  );
}

export function TableRow({ cols, children }: { cols: number; children: React.ReactNode }) {
  return (
    <div
      className="grid items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/80"
      style={{ gridTemplateColumns: Array.from({ length: cols }).map(() => "1fr").join(" ") }}
    >
      {children}
    </div>
  );
}
