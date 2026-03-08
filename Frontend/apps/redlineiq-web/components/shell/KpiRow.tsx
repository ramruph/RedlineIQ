"use client";

import React from "react";
import Dial from "@/components/ui-kit/Dial";
import { useDashboard } from "@/components/shell/DashboardProvider";

export default function KpiRow() {
  const { perf } = useDashboard();

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-4">
        <Dial label="Predicted Power" value={perf.powerWhp} unit="whp" max={550} goodMin={75} />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <Dial label="Predicted Weight" value={perf.weightLb} unit="lb" max={3600} goodMin={70} />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <Dial label="Lap Delta" value={Number(perf.lapDeltaSec.toFixed(2))} unit="s" max={10} goodMin={55} />
      </div>
    </div>
  );
}
