"use client";

import React, { useState } from "react";
import { Activity, ChevronRight, DollarSign, Flame, ShieldCheck, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { mock } from "@/lib/data/mock";
import ConstraintSlider from "@/components/small/ConstraintSlider";
import KpiCard from "@/components/small/KpiCard";
import MiniKpi from "@/components/ui-kit/MiniKpi";

export default function OptimizerPanel() {
  const [budget, setBudget] = useState(mock.optimizer.constraints.budgetUsd);
  const [minRel, setMinRel] = useState(Math.round(mock.optimizer.constraints.minReliability * 100));
  const [tireWidth, setTireWidth] = useState(mock.optimizer.constraints.tireWidthMm);
  const [powerCap, setPowerCap] = useState(mock.optimizer.constraints.powerCapWhp);

  const packages = mock.optimizer.recommendedPackages;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Optimizer</CardTitle>
          <div className="text-[11px] text-white/50">Maximize pace under budget + reliability.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <ConstraintSlider
              label="Budget"
              icon={DollarSign}
              value={budget}
              min={3000}
              max={25000}
              step={250}
              fmt={(v) => `$${v.toLocaleString()}`}
              onChange={setBudget}
            />
            <ConstraintSlider
              label="Min Reliability"
              icon={ShieldCheck}
              value={minRel}
              min={55}
              max={90}
              step={1}
              fmt={(v) => `${v}%`}
              onChange={setMinRel}
            />
            <ConstraintSlider
              label="Tire Width Limit"
              icon={Activity}
              value={tireWidth}
              min={225}
              max={315}
              step={5}
              fmt={(v) => `${v} mm`}
              onChange={setTireWidth}
            />
            <ConstraintSlider
              label="Power Cap"
              icon={Flame}
              value={powerCap}
              min={250}
              max={650}
              step={10}
              fmt={(v) => `${v} whp`}
              onChange={setPowerCap}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="bg-white text-zinc-950 hover:bg-white/90">Optimize Build</Button>
            <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
              Save Scenario
            </Button>
            <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
              Compare Packages
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Recommended Packages</div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {packages.map((p: any) => (
                <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <Badge className="bg-white/5 text-white/70" variant="secondary">
                      ${p.cost.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <MiniKpi label="Pace Gain" value={`${p.paceGainSec.toFixed(1)}s`} />
                    <MiniKpi label="Reliability" value={`${Math.round(p.reliability * 100)}%`} />
                  </div>
                  <div className="mt-2 text-[11px] text-white/55">Highlights</div>
                  <ul className="mt-1 space-y-1 text-[12px] text-white/65">
                    {p.highlights.map((h: string) => (
                      <li key={h} className="flex gap-2">
                        <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-3 w-full bg-white text-zinc-950 hover:bg-white/90">
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Decision Reasoning</CardTitle>
          <div className="text-[11px] text-white/50">Explain why a combo wins (trust).</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Top Constraints Binding</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Budget: keeps you from drivetrain risk.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Reliability: forces cooling + brake focus.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Tire cap: limits max grip → prioritize braking + balance.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={Sparkles} label="Objective" value="Max pace" sub="w/ constraints" />
            <KpiCard icon={ShieldCheck} label="Safety" value="Guardrails" sub="rules + reliab" />
          </div>

          <Button variant="secondary" className="w-full bg-white/5 text-white hover:bg-white/10">
            View Optimization Trace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
