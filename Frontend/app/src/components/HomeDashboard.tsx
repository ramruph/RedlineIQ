import { ArrowRight, BrainCircuit, CarFront, Database, Gauge, Target, Wrench } from 'lucide-react';
import type { Vehicle, VehicleVariant } from '../types/api';
import { Badge, Panel, SectionTitle } from './ui';

export function HomeDashboard({
  vehicles,
  variants,
  selectedVehicleId,
  selectedVariant,
  onStartBuild,
  onOpenIntake,
  onOpenLearn,
}: {
  vehicles: Vehicle[];
  variants: VehicleVariant[];
  selectedVehicleId: string;
  selectedVariant: VehicleVariant | null;
  onStartBuild: () => void;
  onOpenIntake: () => void;
  onOpenLearn: () => void;
}) {
  const activeVehicle = vehicles.find((vehicle) => vehicle.vehicle_id === selectedVehicleId) ?? null;

  return (
    <div className="space-y-6">
      <Panel className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(112,151,117,0.18),transparent_32%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge tone="primary">MVP Live</Badge>
              <Badge>Current Platform: A90 Supra</Badge>
              <Badge tone="secondary">Build Intelligence</Badge>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">
              RedlineIQ Command Center
            </p>

            <h1 className="mt-3 font-headline text-4xl font-black uppercase italic leading-none tracking-tight md:text-6xl">
              Performance build planning with evidence.
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-on-surface-variant md:text-base">
              RedlineIQ helps performance enthusiasts plan smarter builds by combining structured vehicle data,
              parts fitment, budget-aware recommendation logic, and evidence retrieval. The current MVP focuses on
              the Toyota GR Supra A90/B58 platform.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onStartBuild}
                className="flex items-center justify-center gap-2 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-white hover:bg-primary-container"
              >
                Open Build Planner <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenIntake}
                className="border border-outline-variant/70 px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
              >
                Request / Submit Build
              </button>

              <button
                onClick={onOpenLearn}
                className="border border-outline-variant/70 px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant hover:border-secondary hover:text-secondary"
              >
                Learn How It Works
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <MetricCard
              icon={CarFront}
              label="Active Vehicle"
              value={activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : 'Toyota GR Supra'}
              detail={activeVehicle?.platform_code ?? 'A90 / B58'}
            />

            <MetricCard
              icon={Gauge}
              label="Stock Baseline"
              value={`${selectedVariant?.stock_hp ?? 382} HP`}
              detail={`${selectedVariant?.drivetrain ?? 'RWD'} · ${selectedVariant?.transmission ?? 'Auto'}`}
            />

            <MetricCard
              icon={Database}
              label="Data Coverage"
              value={`${vehicles.length} vehicles / ${variants.length} variants`}
              detail="Products, fitments, evidence chunks"
            />
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        <SystemCard
          icon={Wrench}
          title="Structured Recommender"
          status="Live"
          text="Scores parts using use case, budget, target WHP, fitment, and category rules."
        />
        <SystemCard
          icon={Database}
          title="Postgres Catalog"
          status="Live"
          text="Vehicle, variant, product, fitment, and evidence tables are loaded in production."
        />
        <SystemCard
          icon={BrainCircuit}
          title="AI Explanation"
          status="Scaling"
          text="RAG + LLM layer works locally. Production hosting is being optimized for memory."
        />
        <SystemCard
          icon={Target}
          title="User Intake"
          status="New"
          text="Collects requested cars and current builds to guide platform onboarding."
        />
      </div>

      <Panel>
        <SectionTitle
          eyebrow="MVP Scope"
          title="Current A90 Data"
          subtitle="The first public version focuses on validating the recommendation workflow before expanding to more platforms."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <InfoBlock label="Primary platform" value="Toyota GR Supra A90 / Mk5" />
          <InfoBlock label="Engine" value="BMW B58 turbo inline-six" />
          <InfoBlock label="Use cases" value="Street, drag, track, time attack" />
          <InfoBlock label="Recommendation inputs" value="Budget, target WHP, risk tolerance" />
          <InfoBlock label="Data sources" value="Parts catalog, fitment data, technical/evidence chunks" />
          <InfoBlock label="Future" value="User garage, saved builds, more vehicle platforms" />
        </div>
      </Panel>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof CarFront;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border border-outline-variant/40 bg-surface-container-low p-4">
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary" />
        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-on-surface-variant">{label}</span>
      </div>
      <p className="font-headline text-xl font-black uppercase italic">{value}</p>
      <p className="mt-1 text-xs text-on-surface-variant">{detail}</p>
    </div>
  );
}

function SystemCard({
  icon: Icon,
  title,
  status,
  text,
}: {
  icon: typeof Wrench;
  title: string;
  status: 'Live' | 'Scaling' | 'New';
  text: string;
}) {
  return (
    <div className="glass-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary" />
        <Badge tone={status === 'Live' ? 'primary' : status === 'New' ? 'secondary' : 'warning'}>{status}</Badge>
      </div>
      <p className="font-headline text-sm font-black uppercase italic">{title}</p>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{text}</p>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant/40 bg-surface-container-low p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary">{label}</p>
      <p className="mt-2 text-sm leading-6 text-on-surface">{value}</p>
    </div>
  );
}
