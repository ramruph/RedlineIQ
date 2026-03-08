"use client";

import { Badge } from "@/components/ui/badge";

export default function Milestone({ title, status }: { title: string; status: "done" | "active" | "todo" }) {
  const map: Record<string, string> = {
    done: "border-emerald-300/20 bg-emerald-400/10",
    active: "border-indigo-300/20 bg-indigo-400/10",
    todo: "border-white/10 bg-white/5",
  };
  const badge: Record<string, string> = {
    done: "DONE",
    active: "ACTIVE",
    todo: "TODO",
  };
  return (
    <div className={`flex items-center justify-between rounded-2xl border p-3 ${map[status]}`}>
      <div className="text-[12px] font-semibold text-white/90">{title}</div>
      <Badge className="bg-white/5 text-white/70" variant="secondary">
        {badge[status]}
      </Badge>
    </div>
  );
}
