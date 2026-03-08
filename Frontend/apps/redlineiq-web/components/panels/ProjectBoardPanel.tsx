"use client";

import React from "react";
import { AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { mock } from "@/lib/data/mock";
import KanbanCol from "@/components/small/KanbanCol";
import Milestone from "@/components/small/Milestone";

export default function ProjectBoardPanel() {
  const cols = mock.projectBoard.columns;
  const budget = mock.projectBoard.budget;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Project Board</CardTitle>
          <div className="text-[11px] text-white/50">Plan → Order → Install → Tune → Track Test (tasks tied to parts).</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <KanbanCol title="Plan" items={cols.plan} />
            <KanbanCol title="Order Parts" items={cols.order} />
            <KanbanCol title="Install" items={cols.install} />
            <KanbanCol title="Tune" items={cols.tune} />
            <KanbanCol title="Track Test" items={cols.test} />
          </div>

          <div className="grid grid-cols-12 gap-4">
            <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Budget Burn</CardTitle>
              </CardHeader>
              <CardContent className="h-[240px]">
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
              </CardContent>
            </Card>

            <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Build Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Milestone title="Baseline Dyno" status="done" />
                <Milestone title="Cooling Upgrade" status="active" />
                <Milestone title="Brake Fade Eliminated" status="todo" />
                <Milestone title="20-min Session Pass" status="todo" />
                <Button className="w-full bg-white text-zinc-950 hover:bg-white/90">Add Milestone</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
