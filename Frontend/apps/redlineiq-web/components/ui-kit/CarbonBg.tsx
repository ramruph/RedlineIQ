"use client";

export default function CarbonBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_40%),linear-gradient(315deg,rgba(255,255,255,0.06)_0%,transparent_38%)]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_12px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(99,102,241,0.25),transparent_45%)]" />
    </div>
  );
}
