"use client";

import React from "react";

export default function NeonFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur " +
        className
      }
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_40%_90%,rgba(244,63,94,0.10),transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
