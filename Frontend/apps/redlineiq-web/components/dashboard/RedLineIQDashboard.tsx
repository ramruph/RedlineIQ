"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Gauge,
  Activity,
  Timer,
  Flag,
  Settings,
  Wrench,
  Database,
  Play,
  Pause,
  Share2,
  ChevronRight,
  Thermometer,
  Droplets,
  Wind,
  Car,
  Target,
  Sparkles,
  Search,
  Bell,
  KanbanSquare,
  DollarSign,
  ClipboardList,
  ShieldCheck,
  Flame,
} from "lucide-react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * RaceBuildIQ – UI Prototype
 * Gran Turismo–inspired UI: carbon-dark, neon accents, dense panels, crisp hierarchy.
 *
 * Single-file UI prototype (frontend shell) that matches your product modules:
 * - Garage & Car Profiles
 * - Goals Wizard
 * - Build Planner + Performance Prediction (mock)
 * - Optimizer (budget + constraints)
 * - Parts Scout + Deal scoring + Watchlist
 * - Project Board (Kanban) + Budget tracking
 */

// ---------- helpers ----------
const fmtMs = (ms: number) => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return `${m}:${String(s).padStart(2, "0")}.${String(r).padStart(3, "0")}`;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function ringColor(value: number, goodMin = 70) {
  if (value >= goodMin) return "from-emerald-400/30 to-emerald-400/5";
  if (value >= goodMin * 0.85) return "from-amber-400/30 to-amber-400/5";
  return "from-rose-400/30 to-rose-400/5";
}

function scoreTone(value: number) {
  if (value >= 85) return "emerald";
  if (value >= 70) return "indigo";
  if (value >= 55) return "amber";
  return "rose";
}

// ---------- mock data (replace with API calls later) ----------
const mock = {
  user: { name: "Shawn R.", org: "RaceBuildIQ" },

  garage: {
    selectedCarId: "car_1",
    cars: [
      {
        id: "car_1",
        name: "1989 Supra (A70)",
        chassis: "A70",
        buildType: "Street-Track / Time Attack",
        engine: "1UZ (NA) – prototype",
        drivetrain: "RWD",
        weightLb: 3200,
        powerWhp: 260,
        tire: "255/40R17 (TW200)",
        aero: "Splitter + wing (basic)",
        classRules: "Open",
      },
      {
        id: "car_2",
        name: "E36 M3",
        chassis: "E36",
        buildType: "Track Day",
        engine: "S52",
        drivetrain: "RWD",
        weightLb: 3050,
        powerWhp: 240,
        tire: "245/40R17 (TW200)",
        aero: "None",
        classRules: "NASA TT",
      },
      {
        id: "car_3",
        name: "GR86",
        chassis: "ZN8",
        buildType: "HPDE",
        engine: "FA24",
        drivetrain: "RWD",
        weightLb: 2815,
        powerWhp: 205,
        tire: "225/40R18 (TW300)",
        aero: "None",
        classRules: "Stock-ish",
      },
    ],
  },

  session: {
    track: "Sebring Intl Raceway",
    weather: "Clear",
    airTempF: 78,
    trackTempF: 96,
    windMph: 9,
    humidity: 58,
    bestLapMs: 122_384,
    lastLapMs: 123_019,
  },

  goalWizard: {
    goalType: "Time Attack",
    priorities: ["Lap Time", "Reliability", "Drivability"],
    constraints: {
      budgetUsd: 12000,
      fuel: "E85",
      powerCapWhp: 450,
      tireWidthMm: 275,
      sessionMins: 20,
      noiseDb: 98,
    },
    targetSpec: {
      powerWhp: 450,
      weightLb: 2900,
      balance: "Neutral",
      aero: "Efficient (low drag)",
      reliability: "20-min session ready",
    },
  },

  buildPlanner: {
    baseline: {
      powerWhp: 260,
      weightLb: 3200,
      brakeIndex: 0.62,
      gripIndex: 0.68,
      reliability: 0.7,
    },
    predicted: {
      powerWhp: 418,
      weightLb: 3025,
      brakeIndex: 0.78,
      gripIndex: 0.76,
      reliability: 0.74,
      lapDeltaSec: -2.35,
      uncertainty: { power: 18, lapDelta: 0.45 },
      bottlenecks: [
        "Brakes: marginal for 20-min sessions (fluid/pads/ducting)",
        "Cooling: monitor oil temps above 230°F in hot track sessions",
        "Tires: grip is the limiting factor vs adding more boost",
      ],
    },
    parts: [
      { id: "p1", category: "Power", name: "Turbo kit (mid-frame)", brand: "Generic", estCost: 4200, status: "Planned" },
      { id: "p2", category: "Fuel", name: "Injectors 1200cc", brand: "DeatschWerks", estCost: 560, status: "Planned" },
      { id: "p3", category: "Cooling", name: "Oil cooler + sandwich", brand: "Setrab", estCost: 780, status: "Planned" },
      { id: "p4", category: "Chassis", name: "2-way coilovers", brand: "Fortune Auto", estCost: 2100, status: "Planned" },
      { id: "p5", category: "Brakes", name: "Track pads + fluid", brand: "Ferodo/Motul", estCost: 520, status: "Planned" },
      { id: "p6", category: "Tires", name: "TW200 275 set", brand: "RE-71RS", estCost: 1300, status: "Planned" },
    ],
  },

  optimizer: {
    weights: { pace: 0.55, reliability: 0.3, cost: 0.15 },
    constraints: { budgetUsd: 12000, minReliability: 0.7, tireWidthMm: 275, powerCapWhp: 450 },
    recommendedPackages: [
      {
        name: "Balanced TA Package",
        paceGainSec: 2.4,
        reliability: 0.73,
        cost: 11280,
        highlights: ["Coilovers + alignment focus", "Pads/fluid/ducting", "Moderate boost + cooling"],
      },
      {
        name: "Grip-First Package",
        paceGainSec: 2.1,
        reliability: 0.77,
        cost: 10450,
        highlights: ["Tire + brake priority", "Cooling headroom", "Conservative power"],
      },
      {
        name: "Power-Heavy Package",
        paceGainSec: 2.7,
        reliability: 0.66,
        cost: 11990,
        highlights: ["Bigger turbo", "Fuel system", "More risk: heat + drivetrain"],
      },
    ],
  },

  partsScout: {
    queryDefaults: { chassis: "A70", category: "Coilovers", maxPrice: 2000, brand: "Any", condition: "Any" },
    listings: [
      {
        id: "l1",
        part: "2-way coilovers",
        fitment: "E36",
        brand: "KW",
        condition: "Used",
        price: 1650,
        ship: 120,
        score: 92,
        trend: [
          { t: "W-6", p: 2100 },
          { t: "W-5", p: 1980 },
          { t: "W-4", p: 1920 },
          { t: "W-3", p: 1800 },
          { t: "W-2", p: 1750 },
          { t: "W-1", p: 1690 },
          { t: "Now", p: 1650 },
        ],
      },
      {
        id: "l2",
        part: "Big brake kit (front)",
        fitment: "A70",
        brand: "Wilwood",
        condition: "New",
        price: 1899,
        ship: 60,
        score: 74,
        trend: [
          { t: "W-6", p: 2050 },
          { t: "W-5", p: 2050 },
          { t: "W-4", p: 1999 },
          { t: "W-3", p: 1999 },
          { t: "W-2", p: 1949 },
          { t: "W-1", p: 1949 },
          { t: "Now", p: 1899 },
        ],
      },
      {
        id: "l3",
        part: "RE-71RS 275 set",
        fitment: "Universal",
        brand: "Bridgestone",
        condition: "New",
        price: 1240,
        ship: 0,
        score: 66,
        trend: [
          { t: "W-6", p: 1320 },
          { t: "W-5", p: 1295 },
          { t: "W-4", p: 1295 },
          { t: "W-3", p: 1275 },
          { t: "W-2", p: 1260 },
          { t: "W-1", p: 1250 },
          { t: "Now", p: 1240 },
        ],
      },
    ],
    watchlist: [
      { id: "w1", part: "2-way coilovers", fitment: "A70", target: 1800, current: 1995, alert: false },
      { id: "w2", part: "Track pads (front)", fitment: "A70", target: 280, current: 240, alert: true },
      { id: "w3", part: "Oil cooler kit", fitment: "A70", target: 700, current: 740, alert: false },
    ],
  },

  projectBoard: {
    columns: {
      plan: [
        { id: "t1", title: "Finalize goals + class constraints", tag: "Planning" },
        { id: "t2", title: "Baseline dyno + cooling audit", tag: "Data" },
      ],
      order: [
        { id: "t3", title: "Order pads + fluid + ducting", tag: "Brakes" },
        { id: "t4", title: "Source coilovers (deal watch)", tag: "Chassis" },
      ],
      install: [{ id: "t5", title: "Install oil cooler + thermostat", tag: "Cooling" }],
      tune: [{ id: "t6", title: "Base tune + boost ramp", tag: "Power" }],
      test: [{ id: "t7", title: "Track test: 20-min session (heat soak)", tag: "Validation" }],
    },
    budget: {
      planned: 11280,
      actual: 6340,
      byCategory: [
        { name: "Power", v: 4200 },
        { name: "Chassis", v: 2100 },
        { name: "Brakes", v: 520 },
        { name: "Tires", v: 1300 },
        { name: "Cooling", v: 780 },
        { name: "Other", v: 2380 },
      ],
      burn: [
        { t: "W-6", planned: 1500, actual: 0 },
        { t: "W-5", planned: 2500, actual: 560 },
        { t: "W-4", planned: 4300, actual: 560 },
        { t: "W-3", planned: 6200, actual: 2120 },
        { t: "W-2", planned: 8600, actual: 4100 },
        { t: "W-1", planned: 10100, actual: 5400 },
        { t: "Now", planned: 11280, actual: 6340 },
      ],
    },
  },

  driverRadar: [
    { metric: "Braking", value: 78 },
    { metric: "Turn-in", value: 71 },
    { metric: "Mid-corner", value: 75 },
    { metric: "Exit", value: 82 },
    { metric: "Consistency", value: 86 },
  ],
};

// ---------- UI atoms ----------
function NeonFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur " +
        className
      }
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_40%_90%,rgba(244,63,94,0.10),transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function CarbonBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_40%),linear-gradient(315deg,rgba(255,255,255,0.06)_0%,transparent_38%)]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_12px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(99,102,241,0.25),transparent_45%)]" />
    </div>
  );
}

function StatPill({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
        <Icon className="h-5 w-5 text-white/80" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] tracking-wide text-white/60">{label}</div>
        <div className="truncate text-sm font-semibold text-white">{value}</div>
        {hint ? <div className="text-[11px] text-white/40">{hint}</div> : null}
      </div>
    </div>
  );
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  const tone = scoreTone(value);
  const map: Record<string, string> = {
    emerald: "bg-emerald-400/15 text-emerald-200 border-emerald-300/20",
    indigo: "bg-indigo-400/15 text-indigo-200 border-indigo-300/20",
    amber: "bg-amber-400/15 text-amber-200 border-amber-300/20",
    rose: "bg-rose-400/15 text-rose-200 border-rose-300/20",
  };
  return (
    <div className={`rounded-xl border px-2 py-2 ${map[tone]}`}>
      <div className="text-[10px] opacity-80">{label}</div>
      <div className="text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}

function Dial({ label, value, unit, max, goodMin }: { label: string; value: number; unit: string; max: number; goodMin?: number }) {
  const pct = clamp((value / max) * 100, 0, 100);
  const ring = ringColor(pct, goodMin ?? 70);
  return (
    <NeonFrame className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-wide text-white/60">{label}</div>
        <Badge variant="secondary" className="bg-white/5 text-white/70">
          LIVE
        </Badge>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-3xl font-bold text-white">
          {value}
          <span className="ml-1 text-sm font-medium text-white/60">{unit}</span>
        </div>
        <div className="text-xs text-white/50">max {max}</div>
      </div>
      <div className="mt-3">
        <div className={`h-2 w-full rounded-full bg-gradient-to-r ${ring}`}>
          <div className="h-2 rounded-full bg-white/35" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-white/45">
          <span>0</span>
          <span>{Math.round(pct)}%</span>
          <span>{max}</span>
        </div>
      </div>
    </NeonFrame>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
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
    </button>
  );
}

function EnvPill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="text-[10px] text-white/50">{label}</div>
      <div className="text-xs font-semibold text-white">{value}</div>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-2 py-[2px] text-[10px] text-white/70">{text}</span>;
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <div
      className="grid gap-2 border-b border-white/10 pb-2 text-[11px] font-semibold text-white/55"
      style={{ gridTemplateColumns: cols.map(() => "1fr").join(" ") }}
    >
      {cols.map((c) => (
        <div key={c}>{c}</div>
      ))}
    </div>
  );
}

function TableRow({ cols, children }: { cols: number; children: React.ReactNode }) {
  return (
    <div
      className="grid items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/80"
      style={{ gridTemplateColumns: Array.from({ length: cols }).map(() => "1fr").join(" ") }}
    >
      {children}
    </div>
  );
}

// ---------- main ----------
export default function RaceBuildIQDashboard() {
  type View = "overview" | "garage" | "goals" | "build" | "opt" | "scout" | "board";
  const [view, setView] = useState<View>("overview");
  const [isLive, setIsLive] = useState(true);

  const [selectedCarId, setSelectedCarId] = useState(mock.garage.selectedCarId);
  const car = useMemo(() => mock.garage.cars.find((c) => c.id === selectedCarId)!, [selectedCarId]);

  // simple local UI state (wire to API later)
  const [searchText, setSearchText] = useState("");
  const [scoutCategory, setScoutCategory] = useState(mock.partsScout.queryDefaults.category);
  const [scoutChassis, setScoutChassis] = useState(mock.partsScout.queryDefaults.chassis);
  const [maxPrice, setMaxPrice] = useState(mock.partsScout.queryDefaults.maxPrice);

  const best = mock.session.bestLapMs;
  const last = mock.session.lastLapMs;

  const paceIndex = clamp(Math.round(((-mock.buildPlanner.predicted.lapDeltaSec * 18) + 75)), 0, 99);
  const reliabilityIndex = Math.round(mock.buildPlanner.predicted.reliability * 100);
  const budgetIndex = clamp(Math.round((mock.projectBoard.budget.actual / mock.projectBoard.budget.planned) * 100), 0, 100);

  const perf = mock.buildPlanner.predicted;

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

  return (
    <div className="min-h-screen text-white">
      <CarbonBg />

      {/* Top Bar */}
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

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 py-5">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <NeonFrame className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50">Driver / Builder</div>
                <div className="text-lg font-semibold">{mock.user.name}</div>
                <div className="text-[11px] text-white/45">{mock.user.org}</div>
              </div>
              <Badge className="bg-white/5 text-white/70" variant="secondary">
                v0.1
              </Badge>
            </div>

            <Separator className="my-4 bg-white/10" />

            <div className="space-y-2">
              <NavItem icon={Gauge} label="Overview" active={view === "overview"} onClick={() => setView("overview")} />
              <NavItem icon={Database} label="Garage" active={view === "garage"} onClick={() => setView("garage")} />
              <NavItem icon={Target} label="Goals Wizard" active={view === "goals"} onClick={() => setView("goals")} />
              <NavItem icon={Wrench} label="Build Planner" active={view === "build"} onClick={() => setView("build")} />
              <NavItem icon={Sparkles} label="Optimizer" active={view === "opt"} onClick={() => setView("opt")} />
              <NavItem icon={Search} label="Parts Scout" active={view === "scout"} onClick={() => setView("scout")} />
              <NavItem icon={KanbanSquare} label="Project Board" active={view === "board"} onClick={() => setView("board")} />
              <NavItem icon={Settings} label="Integrations" active={false} onClick={() => {}} />
            </div>

            <Separator className="my-4 bg-white/10" />

            <div className="grid grid-cols-2 gap-2">
              <EnvPill icon={Thermometer} label="Air" value={`${mock.session.airTempF}°F`} />
              <EnvPill icon={Thermometer} label="Track" value={`${mock.session.trackTempF}°F`} />
              <EnvPill icon={Wind} label="Wind" value={`${mock.session.windMph} mph`} />
              <EnvPill icon={Droplets} label="Humidity" value={`${mock.session.humidity}%`} />
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">BuildIQ Score</div>
                <Badge className="bg-white/5 text-white/70" variant="secondary">
                  {isLive ? "LIVE" : "PAUSED"}
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <ScoreChip label="Pace" value={paceIndex} />
                <ScoreChip label="Reliab" value={reliabilityIndex} />
                <ScoreChip label="Budget" value={100 - Math.max(0, budgetIndex - 100)} />
              </div>
              <div className="mt-3 text-[11px] text-white/45">
                Tip: for PB attempts, target Pace ≥ 82 with Reliability ≥ 72 and keep Budget burn under control.
              </div>
            </div>
          </NeonFrame>

          {/* quick car switch */}
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
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9">
          {/* Top KPI Row – stays consistent across views */}
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

          <div className="mt-4">
            {view === "overview" ? (
              <OverviewPanel car={car} />
            ) : view === "garage" ? (
              <GaragePanel selectedId={selectedCarId} onSelect={setSelectedCarId} />
            ) : view === "goals" ? (
              <GoalsPanel />
            ) : view === "build" ? (
              <BuildPanel />
            ) : view === "opt" ? (
              <OptimizerPanel />
            ) : view === "scout" ? (
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
            ) : (
              <ProjectBoardPanel />
            )}
          </div>
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

// ---------- Panels ----------
function OverviewPanel({ car }: { car: any }) {
  const perf = mock.buildPlanner.predicted;
  const baseline = mock.buildPlanner.baseline;
  const budget = mock.projectBoard.budget;

  const radar = mock.driverRadar;

  const perfCompare = [
    { metric: "Power (whp)", base: baseline.powerWhp, pred: perf.powerWhp },
    { metric: "Grip", base: Math.round(baseline.gripIndex * 100), pred: Math.round(perf.gripIndex * 100) },
    { metric: "Brakes", base: Math.round(baseline.brakeIndex * 100), pred: Math.round(perf.brakeIndex * 100) },
    { metric: "Reliability", base: Math.round(baseline.reliability * 100), pred: Math.round(perf.reliability * 100) },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Build Snapshot</CardTitle>
          <div className="text-[11px] text-white/50">What changed vs baseline — and what to fix next.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <KpiCard icon={Flame} label="Power" value={`${perf.powerWhp} ±${perf.uncertainty.power} whp`} sub="Predicted" />
            <KpiCard icon={ShieldCheck} label="Reliability" value={`${Math.round(perf.reliability * 100)}%`} sub="20-min focus" />
            <KpiCard icon={Activity} label="Grip Index" value={`${Math.round(perf.gripIndex * 100)}`} sub="Track tires" />
            <KpiCard icon={Timer} label="Lap Delta" value={`${perf.lapDeltaSec.toFixed(2)} ±${perf.uncertainty.lapDelta}s`} sub="vs baseline" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-white">Bottlenecks</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              {perf.bottlenecks.map((b: string) => (
                <li key={b} className="flex gap-2">
                  <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <Card className="col-span-12 md:col-span-7 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Baseline vs Predicted</CardTitle>
              </CardHeader>
              <CardContent className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perfCompare} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="metric" stroke="rgba(255,255,255,0.55)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(9,9,11,0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="base" fill="rgba(255,255,255,0.18)" />
                    <Bar dataKey="pred" fill="rgba(99,102,241,0.55)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-12 md:col-span-5 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Driver Feedback DNA</CardTitle>
                <div className="text-[11px] text-white/50">(Optional) telemetry & balance hooks later.</div>
              </CardHeader>
              <CardContent className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radar} outerRadius={80}>
                    <PolarGrid stroke="rgba(255,255,255,0.10)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} domain={[0, 100]} />
                    <Radar name="Driver" dataKey="value" stroke="rgba(16,185,129,0.95)" fill="rgba(16,185,129,0.25)" strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Budget & Progress</CardTitle>
          <div className="text-[11px] text-white/50">Planned vs actual + category split.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={DollarSign} label="Planned" value={`$${budget.planned.toLocaleString()}`} sub="Build plan" />
            <KpiCard icon={ClipboardList} label="Actual" value={`$${budget.actual.toLocaleString()}`} sub="Receipts" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/55">Spend Burn</div>
              <Badge className="bg-white/5 text-white/70" variant="secondary">
                {Math.round((budget.actual / budget.planned) * 100)}%
              </Badge>
            </div>
            <div className="mt-2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={budget.burn} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="t" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(9,9,11,0.95)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="planned" stroke="rgba(99,102,241,0.75)" fill="rgba(99,102,241,0.15)" />
                  <Area type="monotone" dataKey="actual" stroke="rgba(16,185,129,0.75)" fill="rgba(16,185,129,0.12)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Category Split</div>
            <div className="mt-2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budget.byCategory} dataKey="v" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {budget.byCategory.map((_: any, idx: number) => (
                      <Cell key={idx} fill={`rgba(99,102,241,${0.25 + (idx % 5) * 0.12})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(9,9,11,0.95)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {budget.byCategory.slice(0, 4).map((c: any) => (
                <MiniKpi key={c.name} label={c.name} value={`$${c.v.toLocaleString()}`} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GaragePanel({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Garage</CardTitle>
          <div className="text-[11px] text-white/50">Car profiles, specs, current mods. (MVP: manual inputs)</div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {mock.garage.cars.map((c: any) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={
                "rounded-2xl border p-4 text-left transition " +
                (c.id === selectedId ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/10")
              }
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <Badge className="bg-white/5 text-white/70" variant="secondary">
                  {c.chassis}
                </Badge>
              </div>
              <div className="mt-2 text-[11px] text-white/55">{c.buildType}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <MiniKpi label="Engine" value={c.engine} />
                <MiniKpi label="Drive" value={c.drivetrain} />
                <MiniKpi label="Power" value={`${c.powerWhp} whp`} />
                <MiniKpi label="Weight" value={`${c.weightLb} lb`} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag text={c.tire} />
                <Tag text={c.aero} />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function GoalsPanel() {
  const g = mock.goalWizard;
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Build Goals Wizard</CardTitle>
          <div className="text-[11px] text-white/50">Define intent + constraints → generate target spec.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55">Goal Type</div>
              <div className="mt-1 text-lg font-semibold">{g.goalType}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.priorities.map((p: string) => (
                  <Tag key={p} text={p} />
                ))}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/55">Hard Constraints</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <MiniKpi label="Budget" value={`$${g.constraints.budgetUsd.toLocaleString()}`} />
                <MiniKpi label="Fuel" value={g.constraints.fuel} />
                <MiniKpi label="Power Cap" value={`${g.constraints.powerCapWhp} whp`} />
                <MiniKpi label="Tire Width" value={`${g.constraints.tireWidthMm} mm`} />
                <MiniKpi label="Session" value={`${g.constraints.sessionMins} min`} />
                <MiniKpi label="Noise" value={`${g.constraints.noiseDb} dB`} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">Generated Target Spec</div>
              <Button className="bg-white text-zinc-950 hover:bg-white/90">Regenerate</Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniKpi label="Target Power" value={`${g.targetSpec.powerWhp} whp`} />
              <MiniKpi label="Target Weight" value={`${g.targetSpec.weightLb} lb`} />
              <MiniKpi label="Balance" value={g.targetSpec.balance} />
              <MiniKpi label="Aero" value={g.targetSpec.aero} />
              <MiniKpi label="Reliability" value={g.targetSpec.reliability} />
              <MiniKpi label="Intent" value={g.goalType} />
            </div>
          </div>

          <Button className="w-full bg-white text-zinc-950 hover:bg-white/90">Create Build Plan</Button>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Goal Inputs</CardTitle>
          <div className="text-[11px] text-white/50">(UI-only) — wire to backend later.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/55">Budget (USD)</div>
            <div className="mt-2">
              <Slider value={[g.constraints.budgetUsd / 500]} min={4} max={60} step={1} />
            </div>
            <div className="mt-2 text-[11px] text-white/45">Drag in v0; persist later.</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={Target} label="Focus" value="Time Attack" sub="Goal" />
            <KpiCard icon={ShieldCheck} label="Constraint" value="20-min" sub="Reliability" />
          </div>

          <Button className="w-full bg-white text-zinc-950 hover:bg-white/90">Create Build Plan</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function BuildPanel() {
  const perf = mock.buildPlanner.predicted;
  const parts = mock.buildPlanner.parts;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Build Planner</CardTitle>
          <div className="text-[11px] text-white/50">Select parts → predict performance → flag bottlenecks.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard icon={Flame} label="Power" value={`${perf.powerWhp} whp`} sub={`±${perf.uncertainty.power}`} />
            <KpiCard icon={Activity} label="Grip" value={`${Math.round(perf.gripIndex * 100)}`} sub="Index" />
            <KpiCard icon={ShieldCheck} label="Reliability" value={`${Math.round(perf.reliability * 100)}%`} sub="Score" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">Parts in Plan</div>
              <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
                Add Part
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              <TableHeader cols={["Category", "Part", "Brand", "Est. Cost", "Status"]} />
              <div className="space-y-2 pt-2">
                {parts.map((p: any) => (
                  <TableRow key={p.id} cols={5}>
                    <div className="text-white/70">{p.category}</div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-white/70">{p.brand}</div>
                    <div>${p.estCost.toLocaleString()}</div>
                    <div>
                      <Badge className="bg-white/5 text-white/70" variant="secondary">
                        {p.status}
                      </Badge>
                    </div>
                  </TableRow>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Bottleneck Flags</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              {perf.bottlenecks.map((b: string) => (
                <li key={b} className="flex gap-2">
                  <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Insights Panel</CardTitle>
          <div className="text-[11px] text-white/50">Quick explanation + confidence band (UI mock).</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/55">Lap Impact</div>
              <Badge className="bg-white/5 text-white/70" variant="secondary">
                {perf.lapDeltaSec.toFixed(2)}s
              </Badge>
            </div>
            <div className="mt-2 text-[12px] text-white/65">
              Biggest gains are coming from <span className="text-white">brakes + tires</span>, not more power.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={Wrench} label="Brake Index" value={`${Math.round(perf.brakeIndex * 100)}`} sub="Score" />
            <KpiCard icon={Wind} label="Aero" value="Basic" sub="Assumed" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Why this result?</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Tire width & compound strongly affect lap delta on technical tracks.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Brake thermal capacity is the limiter in 20-min sessions.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Cooling headroom prevents heat-soak power drop.
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-white text-zinc-950 hover:bg-white/90">Re-run</Button>
            <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
              Compare
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OptimizerPanel() {
  const [budget, setBudget] = useState(mock.optimizer.constraints.budgetUsd);
  const [minRel, setMinRel] = useState(Math.round(mock.optimizer.constraints.minReliability * 100));
  const [tireWidth, setTireWidth] = useState(mock.optimizer.constraints.tireWidthMm);
  const [powerCap, setPowerCap] = useState(mock.optimizer.constraints.powerCapWhp);

  const packages = mock.optimizer.recommendedPackages;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Optimizer</CardTitle>
          <div className="text-[11px] text-white/50">Maximize pace under budget + reliability.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <ConstraintSlider
              label="Budget"
              icon={DollarSign}
              value={budget}
              min={3000}
              max={25000}
              step={250}
              fmt={(v) => `$${v.toLocaleString()}`}
              onChange={setBudget}
            />
            <ConstraintSlider
              label="Min Reliability"
              icon={ShieldCheck}
              value={minRel}
              min={55}
              max={90}
              step={1}
              fmt={(v) => `${v}%`}
              onChange={setMinRel}
            />
            <ConstraintSlider
              label="Tire Width Limit"
              icon={Activity}
              value={tireWidth}
              min={225}
              max={315}
              step={5}
              fmt={(v) => `${v} mm`}
              onChange={setTireWidth}
            />
            <ConstraintSlider
              label="Power Cap"
              icon={Flame}
              value={powerCap}
              min={250}
              max={650}
              step={10}
              fmt={(v) => `${v} whp`}
              onChange={setPowerCap}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="bg-white text-zinc-950 hover:bg-white/90">Optimize Build</Button>
            <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
              Save Scenario
            </Button>
            <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
              Compare Packages
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Recommended Packages</div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {packages.map((p: any) => (
                <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <Badge className="bg-white/5 text-white/70" variant="secondary">
                      ${p.cost.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <MiniKpi label="Pace Gain" value={`${p.paceGainSec.toFixed(1)}s`} />
                    <MiniKpi label="Reliability" value={`${Math.round(p.reliability * 100)}%`} />
                  </div>
                  <div className="mt-2 text-[11px] text-white/55">Highlights</div>
                  <ul className="mt-1 space-y-1 text-[12px] text-white/65">
                    {p.highlights.map((h: string) => (
                      <li key={h} className="flex gap-2">
                        <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-3 w-full bg-white text-zinc-950 hover:bg-white/90">Select</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Decision Reasoning</CardTitle>
          <div className="text-[11px] text-white/50">Explain why a combo wins (trust).</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold">Top Constraints Binding</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/65">
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Budget: keeps you from drivetrain risk.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Reliability: forces cooling + brake focus.
              </li>
              <li className="flex gap-2">
                <ChevronRight className="mt-[2px] h-4 w-4 text-white/55" />
                Tire cap: limits max grip → prioritize braking + balance.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={Sparkles} label="Objective" value="Max pace" sub="w/ constraints" />
            <KpiCard icon={ShieldCheck} label="Safety" value="Guardrails" sub="rules + reliab" />
          </div>

          <Button variant="secondary" className="w-full bg-white/5 text-white hover:bg-white/10">
            View Optimization Trace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PartsScoutPanel({
  searchText,
  setSearchText,
  scoutCategory,
  setScoutCategory,
  scoutChassis,
  setScoutChassis,
  maxPrice,
  setMaxPrice,
  listings,
}: {
  searchText: string;
  setSearchText: (v: string) => void;
  scoutCategory: string;
  setScoutCategory: (v: string) => void;
  scoutChassis: string;
  setScoutChassis: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  listings: any[];
}) {
  const watch = mock.partsScout.watchlist;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Parts Scout</CardTitle>
          <div className="text-[11px] text-white/50">Search + filters + deal scoring + price history.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-6">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search (coilovers, oil cooler, pads, turbo...)"
                className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <Select value={scoutChassis} onValueChange={setScoutChassis}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Chassis" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-950 text-white">
                  {["All", "A70", "E36", "ZN8", "Universal"].map((x) => (
                    <SelectItem key={x} value={x} className="focus:bg-white/10">
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6 md:col-span-2">
              <Select value={scoutCategory} onValueChange={setScoutCategory}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-950 text-white">
                  {["Coilovers", "Brakes", "Tires", "Cooling", "Power"].map((x) => (
                    <SelectItem key={x} value={x} className="focus:bg-white/10">
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                <div className="text-[10px] text-white/50">Max Price</div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-xs font-semibold">${maxPrice}</div>
                  <div className="text-[10px] text-white/45">drag</div>
                </div>
                <Slider value={[maxPrice]} min={100} max={4000} step={50} onValueChange={(a) => setMaxPrice(a?.[0] ?? maxPrice)} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">Listings</div>
              <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
                Refresh
              </Button>
            </div>

            <div className="mt-3 space-y-2">
              <TableHeader cols={["Part", "Fitment", "Brand", "Price", "Deal", "Action"]} />
              <div className="space-y-2 pt-2">
                {listings.map((l: any) => (
                  <div key={l.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="grid grid-cols-12 items-center gap-2">
                      <div className="col-span-12 md:col-span-3">
                        <div className="text-sm font-semibold">{l.part}</div>
                        <div className="text-[11px] text-white/55">
                          {l.condition} • ship ${l.ship}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <Tag text={l.fitment} />
                      </div>
                      <div className="col-span-6 md:col-span-2 text-white/75">{l.brand}</div>
                      <div className="col-span-6 md:col-span-2">
                        <div className="text-sm font-semibold">${l.price.toLocaleString()}</div>
                      </div>
                      <div className="col-span-6 md:col-span-1">
                        <DealBadge score={l.score} />
                      </div>
                      <div className="col-span-12 md:col-span-2 flex gap-2">
                        <Button className="flex-1 bg-white text-zinc-950 hover:bg-white/90">Add</Button>
                        <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={l.trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="t" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                          <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(9,9,11,0.95)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 12,
                            }}
                          />
                          <Line type="monotone" dataKey="p" stroke="rgba(16,185,129,0.85)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-2 text-[11px] text-white/55">Deal scoring: compares current price to rolling average + scarcity.</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 lg:col-span-4 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Watchlist</CardTitle>
          <div className="text-[11px] text-white/50">Alerts when below target or “good deal” threshold.</div>
        </CardHeader>
        <CardContent className="space-y-3">
          {watch.map((w: any) => (
            <div key={w.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{w.part}</div>
                  <div className="text-[11px] text-white/55">{w.fitment}</div>
                </div>
                <Badge
                  className={
                    "border " +
                    (w.alert ? "border-emerald-300/20 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70")
                  }
                >
                  {w.alert ? "ALERT" : "WATCH"}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <MiniKpi label="Target" value={`$${w.target}`} />
                <MiniKpi label="Current" value={`$${w.current}`} />
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="flex-1 bg-white text-zinc-950 hover:bg-white/90">Open</Button>
                <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectBoardPanel() {
  const cols = mock.projectBoard.columns;
  const budget = mock.projectBoard.budget;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 border-white/10 bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Project Board</CardTitle>
          <div className="text-[11px] text-white/50">Plan → Order → Install → Tune → Track Test (tasks tied to parts).</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <KanbanCol title="Plan" items={cols.plan} />
            <KanbanCol title="Order Parts" items={cols.order} />
            <KanbanCol title="Install" items={cols.install} />
            <KanbanCol title="Tune" items={cols.tune} />
            <KanbanCol title="Track Test" items={cols.test} />
          </div>

          <div className="grid grid-cols-12 gap-4">
            <Card className="col-span-12 lg:col-span-7 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Budget Burn</CardTitle>
              </CardHeader>
              <CardContent className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budget.burn} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="t" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(9,9,11,0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="planned" stroke="rgba(99,102,241,0.75)" fill="rgba(99,102,241,0.15)" />
                    <Area type="monotone" dataKey="actual" stroke="rgba(16,185,129,0.75)" fill="rgba(16,185,129,0.12)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-12 lg:col-span-5 border-white/10 bg-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Build Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Milestone title="Baseline Dyno" status="done" />
                <Milestone title="Cooling Upgrade" status="active" />
                <Milestone title="Brake Fade Eliminated" status="todo" />
                <Milestone title="20-min Session Pass" status="todo" />
                <Button className="w-full bg-white text-zinc-950 hover:bg-white/90">Add Milestone</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- smaller components ----------
function KpiCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/55">{label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
          <Icon className="h-4 w-4 text-white/70" />
        </div>
      </div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
      {sub ? <div className="text-[11px] text-white/45">{sub}</div> : null}
    </div>
  );
}

function DealBadge({ score }: { score: number }) {
  const tone = scoreTone(score);
  const map: Record<string, string> = {
    emerald: "border-emerald-300/20 bg-emerald-400/15 text-emerald-200",
    indigo: "border-indigo-300/20 bg-indigo-400/15 text-indigo-200",
    amber: "border-amber-300/20 bg-amber-400/15 text-amber-200",
    rose: "border-rose-300/20 bg-rose-400/15 text-rose-200",
  };
  return <span className={`inline-flex items-center justify-center rounded-full border px-2 py-[2px] text-[11px] font-semibold ${map[tone]}`}>{score}</span>;
}

function ConstraintSlider({
  label,
  icon: Icon,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  icon: any;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
            <Icon className="h-4 w-4 text-white/70" />
          </div>
          <div>
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-[11px] text-white/50">{fmt(value)}</div>
          </div>
        </div>
        <Badge className="bg-white/5 text-white/70" variant="secondary">
          {fmt(value)}
        </Badge>
      </div>
      <div className="mt-3">
        <Slider value={[value]} min={min} max={max} step={step} onValueChange={(arr) => onChange(arr?.[0] ?? value)} />
        <div className="mt-2 flex justify-between text-[11px] text-white/45">
          <span>{fmt(min)}</span>
          <span>{fmt(max)}</span>
        </div>
      </div>
    </div>
  );
}

function KanbanCol({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <Badge className="bg-white/5 text-white/70" variant="secondary">
          {items.length}
        </Badge>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
            <div className="text-[12px] font-semibold text-white/90">{t.title}</div>
            <div className="mt-1">
              <Tag text={t.tag} />
            </div>
          </div>
        ))}
        <Button variant="secondary" className="mt-1 w-full bg-white/5 text-white hover:bg-white/10">
          + Add
        </Button>
      </div>
    </div>
  );
}

function Milestone({ title, status }: { title: string; status: "done" | "active" | "todo" }) {
  const map: Record<string, string> = {
    done: "border-emerald-300/20 bg-emerald-400/10",
    active: "border-indigo-300/20 bg-indigo-400/10",
    todo: "border-white/10 bg-white/5",
  };
  const badge: Record<string, string> = {
    done: "DONE",
    active: "ACTIVE",
    todo: "TODO",
  };
  return (
    <div className={`flex items-center justify-between rounded-2xl border p-3 ${map[status]}`}>
      <div className="text-[12px] font-semibold text-white/90">{title}</div>
      <Badge className="bg-white/5 text-white/70" variant="secondary">
        {badge[status]}
      </Badge>
    </div>
  );
}
