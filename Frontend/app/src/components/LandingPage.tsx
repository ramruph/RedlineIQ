import { ArrowRight, Database, Gauge, Network, Sparkles } from 'lucide-react';
import { Badge } from './ui';

export function LandingPage({
  onOpenHome,
  onOpenBuild,
  onOpenIntake,
  onOpenLearn,
}: {
  onOpenHome: () => void;
  onOpenBuild: () => void;
  onOpenIntake: () => void;
  onOpenLearn: () => void;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-dim text-on-surface">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(112,151,117,0.20),transparent_34%),radial-gradient(circle_at_70%_70%,rgba(212,175,55,0.10),transparent_30%)]" />
      <div className="scanline relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-8">
        <header className="flex items-center justify-between border-b border-outline-variant/40 pb-5">
          <div>
            <p className="font-headline text-2xl font-black uppercase italic tracking-[0.25em] text-primary">RedlineIQ</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-on-surface-variant">Build Intelligence MVP</p>
          </div>
          <button
            onClick={onOpenHome}
            className="hidden items-center gap-2 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-white hover:bg-primary-container md:flex"
          >
            Enter App <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="primary">FastAPI</Badge>
              <Badge tone="secondary">PostgreSQL</Badge>
              <Badge>Evidence-backed</Badge>
              <Badge>pgvector-ready</Badge>
            </div>

            <h1 className="font-headline text-5xl font-black uppercase italic leading-[0.9] tracking-tighter md:text-7xl">
              A90 Supra<br />Build Intelligence
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-on-surface-variant md:text-lg">
              Plan performance builds with structured vehicle data, parts fitment, budget-aware scoring, and an
              evidence-ready AI architecture. Current MVP focus: Toyota GR Supra A90/B58.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <Feature icon={Database} title="Real catalog" text="Products and fitments pulled from PostgreSQL." />
              <Feature icon={Gauge} title="Build scoring" text="Budget, power target, risk, and use-case scoring." />
              <Feature icon={Network} title="User signals" text="Request cars and submit builds to shape the roadmap." />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onOpenBuild}
                className="flex items-center justify-center gap-2 bg-primary px-6 py-4 font-headline text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-primary-container"
              >
                Try A90 Planner <Sparkles className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenIntake}
                className="border border-outline-variant/70 px-6 py-4 font-headline text-xs font-black uppercase tracking-[0.25em] text-on-surface-variant hover:border-primary hover:text-primary"
              >
                Request a Car
              </button>

              <button
                onClick={onOpenLearn}
                className="border border-outline-variant/70 px-6 py-4 font-headline text-xs font-black uppercase tracking-[0.25em] text-on-surface-variant hover:border-secondary hover:text-secondary"
              >
                How It Works
              </button>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-6 bg-primary/10 blur-3xl" />
            <div className="relative border border-primary/40 bg-surface-container-low p-3 shadow-[0_0_80px_rgba(112,151,117,0.18)]">
              <img
                src="/images/supra-dashboard.png"
                alt="RedlineIQ A90 Supra dashboard preview"
                className="h-auto w-full object-cover grayscale contrast-125"
              />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 bg-surface/80 p-4 backdrop-blur-md">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary">Active platform</p>
                  <p className="font-headline text-xl font-black uppercase italic">Toyota GR Supra A90</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-on-surface-variant">MVP Status</p>
                  <p className="font-headline text-xl font-black uppercase italic text-secondary">Public Preview</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Database; title: string; text: string }) {
  return (
    <div className="border border-outline-variant/40 bg-surface-container-low p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-headline text-sm font-black uppercase italic">{title}</p>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{text}</p>
    </div>
  );
}
