"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { mock } from "@/lib/data/mock";
import MiniKpi from "@/components/ui-kit/MiniKpi";
import { useDashboard } from "@/components/shell/DashboardProvider";

export default function CarSwitcher() {
  const { selectedCarId, setSelectedCarId, car } = useDashboard();

  return (
    <Card className="mt-4 border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Active Car</CardTitle>
        <div className="text-[11px] text-white/50">Switch profiles (multi-build support)</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedCarId} onValueChange={(v) => setSelectedCarId(v)}>
          <SelectTrigger className="border-white/10 bg-white/5 text-white">
            <SelectValue placeholder="Select car" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-zinc-950 text-white">
            {mock.garage.cars.map((c) => (
              <SelectItem key={c.id} value={c.id} className="focus:bg-white/10">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <MiniKpi label="Power" value={`${car.powerWhp} whp`} />
          <MiniKpi label="Weight" value={`${car.weightLb} lb`} />
          <MiniKpi label="Tires" value={car.tire} />
          <MiniKpi label="Rules" value={car.classRules} />
        </div>
      </CardContent>
    </Card>
  );
}
