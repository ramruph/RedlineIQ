"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { mock } from "@/lib/data/mock";
import MiniKpi from "@/components/ui-kit/MiniKpi";
import Tag from "@/components/ui-kit/Tag";

export default function GaragePanel({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Garage</CardTitle>
          <div className="text-[11px] text-white/50">Car profiles, specs, current mods. (MVP: manual inputs)</div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {mock.garage.cars.map((c: any) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={
                "rounded-2xl border p-4 text-left transition " +
                (c.id === selectedId ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/10")
              }
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <Badge className="bg-white/5 text-white/70" variant="secondary">
                  {c.chassis}
                </Badge>
              </div>
              <div className="mt-2 text-[11px] text-white/55">{c.buildType}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <MiniKpi label="Engine" value={c.engine} />
                <MiniKpi label="Drive" value={c.drivetrain} />
                <MiniKpi label="Power" value={`${c.powerWhp} whp`} />
                <MiniKpi label="Weight" value={`${c.weightLb} lb`} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag text={c.tire} />
                <Tag text={c.aero} />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
