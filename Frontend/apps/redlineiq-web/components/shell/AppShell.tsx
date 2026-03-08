"use client";

import React from "react";
import CarbonBg from "@/components/ui-kit/CarbonBg";
import TopBar from "@/components/shell/TopBar";
import Sidebar from "@/components/shell/Sidebar";
import CarSwitcher from "@/components/shell/CarSwitcher";
import KpiRow from "@/components/shell/KpiRow";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <CarbonBg />
      <TopBar />

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 py-5">
        <div className="col-span-12 md:col-span-3">
          <Sidebar />
          <CarSwitcher />
        </div>

        <main className="col-span-12 md:col-span-9">
          <KpiRow />
          <div className="mt-4">{children}</div>
        </main>
      </div>

      <footer className="border-t border-white/10 bg-zinc-950/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-[11px] text-white/50">
          <span>RaceBuildIQ • UI Prototype</span>
          <span>Next: wire to backend endpoints</span>
        </div>
      </footer>
    </div>
  );
}
