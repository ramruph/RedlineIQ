export const fmtMs = (ms: number) => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return `${m}:${String(s).padStart(2, "0")}.${String(r).padStart(3, "0")}`;
};

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function ringColor(value: number, goodMin = 70) {
  if (value >= goodMin) return "from-emerald-400/30 to-emerald-400/5";
  if (value >= goodMin * 0.85) return "from-amber-400/30 to-amber-400/5";
  return "from-rose-400/30 to-rose-400/5";
}

export function scoreTone(value: number) {
  if (value >= 85) return "emerald";
  if (value >= 70) return "indigo";
  if (value >= 55) return "amber";
  return "rose";
}
