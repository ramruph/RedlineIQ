"use client";

import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Activity, ChevronRight, ClipboardList, DollarSign, Flame, ShieldCheck, Timer } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { mock } from "@/lib/data/mock";
import KpiCard from "@/components/small/KpiCard";
import MiniKpi from "@/components/ui-kit/MiniKpi";

export default function OverviewPanel({ car }: { car: any }) {
  const perf = mock.buildPlanner.predicted;
  const baseline = mock.buildPlanner.baseline;
  const budget = mock.projectBoard.budget;

  const radar = mock.driverRadar;

  const perfCompare = [
    { metric: "Power (whp)", base: baseline.powerWhp, pred: perf.powerWhp },
    { metric: "Grip", base: Math.round(baseline.gripIndex * 100), pred: Math.round(perf.gripIndex * 100) },
    { metric: "Brakes", base: Math.round(baseline.brakeIndex * 100), pred: Math.round(perf.brakeIndex * 100) },
    { metric: "Reliability", base: Math.round(baseline.reliability * 100), pred: Math.round(perf.reliability * 100) },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Build Snapshot</CardTitle>
          <div className="text-[11px] text-white/50">What changed vs baseline — and what to fix next.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <KpiCard icon={Flame} label="Power" value={`${perf.powerWhp} ±${perf.uncertainty.power} whp`} sub="Predicted" />
            <KpiCard icon={ShieldCheck} label="Reliability" value={`${Math.round(perf.reliability * 100)}%`} sub="20-min focus" />
            <KpiCard icon={Activity} label="Grip Index" value={`${Math.round(perf.gripIndex * 100)}`} sub="Track tires" />
            <KpiCard icon={Timer} label="Lap Delta" value={`${perf.lapDeltaSec.toFixed(2)} ±${perf.uncertainty.lapDelta}s`} sub="vs baseline" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-white">Bottlenecks</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              {perf.bottlenecks.map((b: string) => (
                <li key={b} className="flex gap-2">
                  <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <Card className="col-span-12 md:col-span-7 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Baseline vs Predicted</CardTitle>
              </CardHeader>
              <CardContent className="h-[240px] min-w-[200px] min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perfCompare} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="metric" stroke="rgba(255,255,255,0.55)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(9,9,11,0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="base" fill="rgba(255,255,255,0.18)" />
                    <Bar dataKey="pred" fill="rgba(99,102,241,0.55)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-12 md:col-span-5 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Driver Feedback DNA</CardTitle>
                <div className="text-[11px] text-white/50">(Optional) telemetry & balance hooks later.</div>
              </CardHeader>
              <CardContent className="h-[240px] min-w-[200px] min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radar} outerRadius={80}>
                    <PolarGrid stroke="rgba(255,255,255,0.10)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} domain={[0, 100]} />
                    <Radar name="Driver" dataKey="value" stroke="rgba(16,185,129,0.95)" fill="rgba(16,185,129,0.25)" strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Budget & Progress</CardTitle>
          <div className="text-[11px] text-white/50">Planned vs actual + category split.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={DollarSign} label="Planned" value={`$${budget.planned.toLocaleString()}`} sub="Build plan" />
            <KpiCard icon={ClipboardList} label="Actual" value={`$${budget.actual.toLocaleString()}`} sub="Receipts" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/55">Spend Burn</div>
              <Badge className="bg-white/5 text-white/70" variant="secondary">
                {Math.round((budget.actual / budget.planned) * 100)}%
              </Badge>
            </div>
            <div className="mt-2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={budget.burn} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="t" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(9,9,11,0.95)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="planned" stroke="rgba(99,102,241,0.75)" fill="rgba(99,102,241,0.15)" />
                  <Area type="monotone" dataKey="actual" stroke="rgba(16,185,129,0.75)" fill="rgba(16,185,129,0.12)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Category Split</div>
            <div className="mt-2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budget.byCategory} dataKey="v" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {budget.byCategory.map((_: any, idx: number) => (
                      <Cell key={idx} fill={`rgba(99,102,241,${0.25 + (idx % 5) * 0.12})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(9,9,11,0.95)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {budget.byCategory.slice(0, 4).map((c: any) => (
                <MiniKpi key={c.name} label={c.name} value={`$${c.v.toLocaleString()}`} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
