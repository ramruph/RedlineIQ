"use client";

import React from "react";
import {
  Gauge,
  Database,
  Target,
  Wrench,
  Sparkles,
  Search,
  KanbanSquare,
  Settings,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import NeonFrame from "@/components/ui-kit/NeonFrame";
import EnvPill from "@/components/ui-kit/EnvPill";
import ScoreChip from "@/components/ui-kit/ScoreChip";
import NavItem from "@/components/ui-kit/NavItem";

import { mock } from "@/lib/data/mock";
import { useDashboard } from "@/components/shell/DashboardProvider";

export default function Sidebar() {
  const { isLive, paceIndex, reliabilityIndex, budgetIndex } = useDashboard();

  return (
    <aside className="col-span-12 md:col-span-3">
      <NeonFrame className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50">Driver / Builder</div>
            <div className="text-lg font-semibold">{mock.user.name}</div>
            <div className="text-[11px] text-white/45">{mock.user.org}</div>
          </div>
          <Badge className="bg-white/5 text-white/70" variant="secondary">
            v0.1
          </Badge>
        </div>

        <Separator className="my-4 bg-white/10" />

        <div className="space-y-2">
          <NavItem icon={Gauge} label="Overview" href="/" />
          <NavItem icon={Database} label="Garage" href="/garage" />
          <NavItem icon={Target} label="Goals Wizard" href="/goals" />
          <NavItem icon={Wrench} label="Build Planner" href="/build" />
          <NavItem icon={Sparkles} label="Optimizer" href="/optimize" />
          <NavItem icon={Search} label="Parts Scout" href="/parts" />
          <NavItem icon={KanbanSquare} label="Project Board" href="/board" />
          <NavItem icon={Settings} label="Integrations" href="/" />
        </div>

        <Separator className="my-4 bg-white/10" />

        <div className="grid grid-cols-2 gap-2">
          <EnvPill icon={Thermometer} label="Air" value={`${mock.session.airTempF}°F`} />
          <EnvPill icon={Thermometer} label="Track" value={`${mock.session.trackTempF}°F`} />
          <EnvPill icon={Wind} label="Wind" value={`${mock.session.windMph} mph`} />
          <EnvPill icon={Droplets} label="Humidity" value={`${mock.session.humidity}%`} />
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">BuildIQ Score</div>
            <Badge className="bg-white/5 text-white/70" variant="secondary">
              {isLive ? "LIVE" : "PAUSED"}
            </Badge>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <ScoreChip label="Pace" value={paceIndex} />
            <ScoreChip label="Reliab" value={reliabilityIndex} />
            <ScoreChip label="Budget" value={100 - Math.max(0, budgetIndex - 100)} />
          </div>
          <div className="mt-3 text-[11px] text-white/45">
            Tip: for PB attempts, target Pace ≥ 82 with Reliability ≥ 72 and keep Budget burn under control.
          </div>
        </div>
      </NeonFrame>
    </aside>
  );
}
