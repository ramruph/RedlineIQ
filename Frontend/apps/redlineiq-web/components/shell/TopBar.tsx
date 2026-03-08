"use client";

import React from "react";
import { Gauge, Flag, Timer, Pause, Play, Share2, Car } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import StatPill from "@/components/ui-kit/StatPill";
import { fmtMs } from "@/lib/utils/format";
import { mock } from "@/lib/data/mock";
import { useDashboard } from "@/components/shell/DashboardProvider";

export default function TopBar() {
  const { isLive, setIsLive, car } = useDashboard();

  const best = mock.session.bestLapMs;
  const last = mock.session.lastLapMs;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/5">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.35),transparent_55%)]" />
            <Gauge className="relative h-5 w-5 text-white/85" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold tracking-wide">RedlineIQ</div>
              <Badge className="bg-white/5 text-white/70" variant="secondary">
                Build Dashboard
              </Badge>
            </div>
            <div className="text-[11px] text-white/55">Build goals → parts → performance → budget</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <StatPill icon={Car} label="Active Car" value={car.name} hint={`${car.engine} • ${car.drivetrain}`} />
          <StatPill icon={Flag} label="Track" value={mock.session.track} hint={mock.session.weather} />
          <StatPill icon={Timer} label="Best Lap" value={fmtMs(best)} hint={`Last ${fmtMs(last)}`} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10" onClick={() => setIsLive((v) => !v)}>
            {isLive ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Live
              </>
            )}
          </Button>
          <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
            <Share2 className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
    </header>
  );
}
