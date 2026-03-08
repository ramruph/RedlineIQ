"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Tag from "@/components/ui-kit/Tag";

export default function KanbanCol({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <Badge className="bg-white/5 text-white/70" variant="secondary">
          {items.length}
        </Badge>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
            <div className="text-[12px] font-semibold text-white/90">{t.title}</div>
            <div className="mt-1">
              <Tag text={t.tag} />
            </div>
          </div>
        ))}
        <Button variant="secondary" className="mt-1 w-full bg-white/5 text-white hover:bg-white/10">
          + Add
        </Button>
      </div>
    </div>
  );
}
