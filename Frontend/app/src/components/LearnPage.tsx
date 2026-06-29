import { ArrowRight, BrainCircuit, Database, Gauge, Layers3, Mail, ShieldCheck } from 'lucide-react';
import { Badge, Panel, SectionTitle } from './ui';

export function LearnPage({
  onStartBuild,
  onOpenIntake,
}: {
  onStartBuild: () => void;
  onOpenIntake: () => void;
}) {
  return (
    <div className="space-y-6">
      <Panel>
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge tone="primary">How it works</Badge>
          <Badge>Recommendation engine</Badge>
          <Badge>RAG-ready architecture</Badge>
          <Badge tone="secondary">MVP roadmap</Badge>
        </div>

        <h1 className="font-headline text-4xl font-black uppercase italic leading-none tracking-tight md:text-6xl">
          Why RedlineIQ exists
        </h1>

        <p className="mt-5 max-w-4xl text-sm leading-7 text-on-surface-variant md:text-base">
          Performance builds are usually planned across scattered forum threads, product pages, social posts,
          dyno screenshots, and tuner recommendations. RedlineIQ is designed to turn that fragmented information
          into a structured, evidence-aware build planning workflow.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onStartBuild}
            className="flex items-center justify-center gap-2 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-white"
          >
            Try Planner <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenIntake}
            className="border border-outline-variant/70 px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
          >
            Help Shape Roadmap
          </button>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <ExplainCard
          icon={Database}
          title="1. Normalize the data"
          text="Vehicle specs, variants, parts, categories, fitment rules, and evidence chunks are stored in PostgreSQL instead of scattered across hardcoded UI data."
        />
        <ExplainCard
          icon={Gauge}
          title="2. Score build candidates"
          text="The recommendation API ranks parts based on budget, target WHP, use case, fitment confidence, and category relevance."
        />
        <ExplainCard
          icon={BrainCircuit}
          title="3. Explain with evidence"
          text="The RAG/LLM layer retrieves supporting chunks and generates grounded build explanations. Production hosting is being optimized for memory and scale."
        />
        <ExplainCard
          icon={ShieldCheck}
          title="4. Improve with user signals"
          text="Requested cars, submitted builds, clicked parts, and saved recommendations become the feedback loop for future ranking and onboarding."
        />
      </div>

      <Panel>
        <SectionTitle
          eyebrow="Roadmap"
          title="Future Rollouts"
          subtitle="This MVP validates the workflow before expanding to user accounts and broader car coverage."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <RoadmapStep title="Garage Profiles" text="Users save vehicles, current mods, goals, and budgets." />
          <RoadmapStep title="More Platforms" text="Prioritize cars based on requests: A80, R35, R34, 240SX, F8X, C6/C7, and more." />
          <RoadmapStep title="Better AI Layer" text="Hosted embeddings, evaluation sets, prompt/model logging, and source-grounded explanations." />
          <RoadmapStep title="Build Comparisons" text="Compare street vs track vs drag recommendations with cost/risk tradeoffs." />
          <RoadmapStep title="Watchlists" text="Track parts, pricing, and availability for planned builds." />
          <RoadmapStep title="Community Data" text="Use submitted builds and outcomes to improve recommendations over time." />
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-headline text-2xl font-black uppercase italic">Want updates?</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Use the intake page to request a car, submit a build, or leave your email for future testing.
            </p>
          </div>
          <button
            onClick={onOpenIntake}
            className="flex items-center justify-center gap-2 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-white"
          >
            Join MVP List <Mail className="h-4 w-4" />
          </button>
        </div>
      </Panel>
    </div>
  );
}

function ExplainCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Database;
  title: string;
  text: string;
}) {
  return (
    <div className="glass-panel p-5">
      <Icon className="h-6 w-6 text-primary" />
      <p className="mt-4 font-headline text-lg font-black uppercase italic">{title}</p>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p>
    </div>
  );
}

function RoadmapStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-outline-variant/40 bg-surface-container-low p-4">
      <Layers3 className="h-5 w-5 text-secondary" />
      <p className="mt-3 font-headline text-sm font-black uppercase italic">{title}</p>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{text}</p>
    </div>
  );
}
