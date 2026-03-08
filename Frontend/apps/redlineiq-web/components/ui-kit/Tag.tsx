"use client";

export default function Tag({ text }: { text: string }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-2 py-[2px] text-[10px] text-white/70">{text}</span>;
}
