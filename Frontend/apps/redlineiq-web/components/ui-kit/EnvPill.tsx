"use client";

export default function EnvPill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-white/65" />
        <div className="min-w-0">
          <div className="text-[10px] text-white/50">{label}</div>
          <div className="truncate text-xs font-semibold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}
