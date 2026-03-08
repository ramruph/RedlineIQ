"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { clamp } from "@/lib/utils/format";
import { mock } from "@/lib/data/mock";

type DashboardCtx = {
  isLive: boolean;
  setIsLive: (v: boolean | ((p: boolean) => boolean)) => void;

  selectedCarId: string;
  setSelectedCarId: (id: string) => void;

  car: any;
  perf: any;

  searchText: string;
  setSearchText: (v: string) => void;

  scoutCategory: string;
  setScoutCategory: (v: string) => void;

  scoutChassis: string;
  setScoutChassis: (v: string) => void;

  maxPrice: number;
  setMaxPrice: (v: number) => void;

  filteredListings: any[];

  paceIndex: number;
  reliabilityIndex: number;
  budgetIndex: number;
};

const Ctx = createContext<DashboardCtx | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isLive, setIsLive] = useState(true);

  const [selectedCarId, setSelectedCarId] = useState(mock.garage.selectedCarId);
  const car = useMemo(() => mock.garage.cars.find((c) => c.id === selectedCarId)!, [selectedCarId]);

  const [searchText, setSearchText] = useState("");
  const [scoutCategory, setScoutCategory] = useState(mock.partsScout.queryDefaults.category);
  const [scoutChassis, setScoutChassis] = useState(mock.partsScout.queryDefaults.chassis);
  const [maxPrice, setMaxPrice] = useState(mock.partsScout.queryDefaults.maxPrice);

  const perf = mock.buildPlanner.predicted;

  const paceIndex = clamp(Math.round((-perf.lapDeltaSec * 18 + 75)), 0, 99);
  const reliabilityIndex = Math.round(perf.reliability * 100);
  const budgetIndex = clamp(Math.round((mock.projectBoard.budget.actual / mock.projectBoard.budget.planned) * 100), 0, 100);

  const filteredListings = useMemo(() => {
    return mock.partsScout.listings
      .filter((l) => (scoutChassis === "All" ? true : l.fitment === scoutChassis || l.fitment === "Universal"))
      .filter((l) => l.price <= maxPrice)
      .filter((l) =>
        searchText.trim()
          ? (l.part + " " + l.brand + " " + l.fitment).toLowerCase().includes(searchText.toLowerCase())
          : true
      );
  }, [searchText, scoutChassis, maxPrice]);

  const value: DashboardCtx = {
    isLive,
    setIsLive,
    selectedCarId,
    setSelectedCarId,
    car,
    perf,
    searchText,
    setSearchText,
    scoutCategory,
    setScoutCategory,
    scoutChassis,
    setScoutChassis,
    maxPrice,
    setMaxPrice,
    filteredListings,
    paceIndex,
    reliabilityIndex,
    budgetIndex,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
