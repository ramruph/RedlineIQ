"use client";

import React from "react";
import { Activity, ChevronRight, Flame, ShieldCheck, Wind, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { mock } from "@/lib/data/mock";
import KpiCard from "@/components/small/KpiCard";
import { TableHeader, TableRow } from "@/components/ui-kit/Table";

export default function BuildPanel() {
  const perf = mock.buildPlanner.predicted;
  const parts = mock.buildPlanner.parts;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Build Planner</CardTitle>
          <div className="text-[11px] text-white/50">Select parts → predict performance → flag bottlenecks.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard icon={Flame} label="Power" value={`${perf.powerWhp} whp`} sub={`±${perf.uncertainty.power}`} />
            <KpiCard icon={Activity} label="Grip" value={`${Math.round(perf.gripIndex * 100)}`} sub="Index" />
            <KpiCard icon={ShieldCheck} label="Reliability" value={`${Math.round(perf.reliability * 100)}%`} sub="Score" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">Parts in Plan</div>
              <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
                Add Part
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              <TableHeader cols={["Category", "Part", "Brand", "Est. Cost", "Status"]} />
              <div className="space-y-2 pt-2">
                {parts.map((p: any) => (
                  <TableRow key={p.id} cols={5}>
                    <div className="text-white/70">{p.category}</div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-white/70">{p.brand}</div>
                    <div>${p.estCost.toLocaleString()}</div>
                    <div>
                      <Badge className="bg-white/5 text-white/70" variant="secondary">
                        {p.status}
                      </Badge>
                    </div>
                  </TableRow>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Bottleneck Flags</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              {perf.bottlenecks.map((b: string) => (
                <li key={b} className="flex gap-2">
                  <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Insights Panel</CardTitle>
          <div className="text-[11px] text-white/50">Quick explanation + confidence band (UI mock).</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/55">Lap Impact</div>
              <Badge className="bg-white/5 text-white/70" variant="secondary">
                {perf.lapDeltaSec.toFixed(2)}s
              </Badge>
            </div>
            <div className="mt-2 text-[12px] text-white/65">
              Biggest gains are coming from <span className="text-white">brakes + tires</span>, not more power.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={Wrench} label="Brake Index" value={`${Math.round(perf.brakeIndex * 100)}`} sub="Score" />
            <KpiCard icon={Wind} label="Aero" value="Basic" sub="Assumed" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Why this result?</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Tire width & compound strongly affect lap delta on technical tracks.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Brake thermal capacity is the limiter in 20-min sessions.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Cooling headroom prevents heat-soak power drop.
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-white text-zinc-950 hover:bg-white/90">Re-run</Button>
            <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
              Compare
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
