"use client";

import React from "react";
import PartsScoutPanel from "@/components/panels/PartsScoutPanel";
import { useDashboard } from "@/components/shell/DashboardProvider";

export default function Page() {
  const {
    searchText,
    setSearchText,
    scoutCategory,
    setScoutCategory,
    scoutChassis,
    setScoutChassis,
    maxPrice,
    setMaxPrice,
    filteredListings,
  } = useDashboard();

  return (
    <PartsScoutPanel
      searchText={searchText}
      setSearchText={setSearchText}
      scoutCategory={scoutCategory}
      setScoutCategory={setScoutCategory}
      scoutChassis={scoutChassis}
      setScoutChassis={setScoutChassis}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      listings={filteredListings}
    />
  );
}
