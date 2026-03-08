"use client";

import React from "react";
import { Target, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { mock } from "@/lib/data/mock";
import MiniKpi from "@/components/ui-kit/MiniKpi";
import Tag from "@/components/ui-kit/Tag";
import KpiCard from "@/components/small/KpiCard";

export default function GoalsPanel() {
  const g = mock.goalWizard;
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Build Goals Wizard</CardTitle>
          <div className="text-[11px] text-white/50">Define intent + constraints → generate target spec.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55">Goal Type</div>
              <div className="mt-1 text-lg font-semibold">{g.goalType}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.priorities.map((p: string) => (
                  <Tag key={p} text={p} />
                ))}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55">Hard Constraints</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <MiniKpi label="Budget" value={`$${g.constraints.budgetUsd.toLocaleString()}`} />
                <MiniKpi label="Fuel" value={g.constraints.fuel} />
                <MiniKpi label="Power Cap" value={`${g.constraints.powerCapWhp} whp`} />
                <MiniKpi label="Tire Width" value={`${g.constraints.tireWidthMm} mm`} />
                <MiniKpi label="Session" value={`${g.constraints.sessionMins} min`} />
                <MiniKpi label="Noise" value={`${g.constraints.noiseDb} dB`} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">Generated Target Spec</div>
              <Button className="bg-white text-zinc-950 hover:bg-white/90">Regenerate</Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniKpi label="Target Power" value={`${g.targetSpec.powerWhp} whp`} />
              <MiniKpi label="Target Weight" value={`${g.targetSpec.weightLb} lb`} />
              <MiniKpi label="Balance" value={g.targetSpec.balance} />
              <MiniKpi label="Aero" value={g.targetSpec.aero} />
              <MiniKpi label="Reliability" value={g.targetSpec.reliability} />
              <MiniKpi label="Intent" value={g.goalType} />
            </div>
          </div>

          <Button className="w-full bg-white text-zinc-950 hover:bg-white/90">Create Build Plan</Button>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Goal Inputs</CardTitle>
          <div className="text-[11px] text-white/50">(UI-only) — wire to backend later.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/55">Budget (USD)</div>
            <div className="mt-2">
              <Slider value={[g.constraints.budgetUsd / 500]} min={4} max={60} step={1} />
            </div>
            <div className="mt-2 text-[11px] text-white/45">Drag in v0; persist later.</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={Target} label="Focus" value="Time Attack" sub="Goal" />
            <KpiCard icon={ShieldCheck} label="Constraint" value="20-min" sub="Reliability" />
          </div>

          <Button className="w-full bg-white text-zinc-950 hover:bg-white/90">Create Build Plan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
