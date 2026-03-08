"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function NavItem({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={
        "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition " +
        (active ? "border-white/15 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/10")
      }
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-white/70" />
        <span className="text-sm text-white/85">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-white/35" />
    </Link>
  );
}
