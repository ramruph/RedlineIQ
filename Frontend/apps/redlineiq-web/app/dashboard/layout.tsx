import React from "react";
import AppShell from "@/components/shell/AppShell";
import { DashboardProvider } from "@/components/shell/DashboardProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <AppShell>{children}</AppShell>
    </DashboardProvider>
  );
}
