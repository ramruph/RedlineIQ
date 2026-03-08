"use client";

import React from "react";
import GaragePanel from "@/components/panels/GaragePanel";
import { useDashboard } from "@/components/shell/DashboardProvider";

export default function Page() {
  const { selectedCarId, setSelectedCarId } = useDashboard();
  return <GaragePanel selectedId={selectedCarId} onSelect={setSelectedCarId} />;
}
