"use client";

import React from "react";
import { Bell } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { mock } from "@/lib/data/mock";
import Tag from "@/components/ui-kit/Tag";
import DealBadge from "@/components/small/DealBadge";
import { TableHeader } from "@/components/ui-kit/Table";
import MiniKpi from "@/components/ui-kit/MiniKpi";

export default function PartsScoutPanel({
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
