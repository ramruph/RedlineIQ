import { ArrowRight, BrainCircuit, Cpu, Database, FileSearch, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-x-hidden bg-surface-dim text-on-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(112,151,117,0.18),transparent_34%),radial-gradient(circle_at_70%_70%,rgba(212,175,55,0.10),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 hidden opacity-5 scanline md:block" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-8">
        <header className="flex items-center justify-between border-b border-outline-variant/40 pb-5">
          <button onClick={onOpenHome} className="text-left">
            <p className="font-headline text-2xl font-black uppercase italic tracking-[0.25em] text-primary">
              RedlineIQ
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-on-surface-variant">
              GenAI Build Intelligence
            </p>
          </button>

          <button
            onClick={onOpenBuild}
            className="hidden items-center gap-2 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-widest text-white hover:bg-primary-container md:flex"
          >
            Enter Planner <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <main className="relative flex flex-1 items-center justify-center py-16 text-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.025] select-none">
            <span className="font-headline text-[10rem] font-black uppercase italic tracking-tighter md:text-[18rem] lg:text-[24rem]">
              RedlineIQ
            </span>
          </div>

          <section className="relative z-10 mx-auto max-w-5xl space-y-8">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge tone="primary">FastAPI</Badge>
              <Badge tone="secondary">PostgreSQL</Badge>
              <Badge>pgvector RAG</Badge>
              <Badge>LLM Explanations</Badge>
            </div>

            <div className="inline-flex items-center gap-3 border border-primary/30 bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                Toyota GR Supra A90 MVP
              </span>
            </div>

            <h1 className="font-headline text-5xl font-black uppercase italic leading-[0.88] tracking-tighter md:text-7xl lg:text-8xl">
              Evidence-Grounded<br />
              <span className="text-primary text-glow-primary">Build Intelligence</span>
            </h1>

            <p className="mx-auto max-w-3xl text-base leading-8 text-on-surface-variant md:text-lg">
              RedlineIQ helps plan performance builds using structured vehicle data, parts fitment,
              budget-aware recommendation logic, semantic evidence retrieval, and LLM-generated
              explanations. The current MVP focuses on the Toyota GR Supra A90/B58 platform.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <button
                onClick={onOpenBuild}
                className="flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 font-headline text-sm font-black uppercase italic tracking-[0.25em] text-white shadow-[0_0_30px_rgba(112,151,117,0.20)] transition hover:scale-[1.02] hover:bg-primary-container active:scale-[0.98] sm:w-auto"
              >
                Start Build Planner <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={onOpenHome}
                className="flex w-full items-center justify-center gap-3 border border-outline-variant/70 bg-surface-container-low px-8 py-4 font-headline text-sm font-black uppercase italic tracking-[0.25em] text-on-surface hover:border-primary hover:text-primary sm:w-auto"
              >
                View App Dashboard <Cpu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.25em] text-on-surface-variant">
              <button onClick={onOpenLearn} className="hover:text-secondary">
                How It Works
              </button>
              <span className="text-outline-variant">/</span>
              <button onClick={onOpenIntake} className="hover:text-primary">
                Request Another Car
              </button>
            </div>

            <div className="mx-auto grid max-w-5xl gap-4 pt-8 md:grid-cols-3">
              <Pillar
                icon={Database}
                title="Structured Data"
                text="Vehicles, variants, engines, products, fitments, and evidence are stored in PostgreSQL for reliable backend queries."
              />
              <Pillar
                icon={FileSearch}
                title="RAG Evidence"
                text="Product text, forum evidence, and technical chunks are embedded and searched with pgvector for grounded context."
              />
              <Pillar
                icon={BrainCircuit}
                title="LLM Explanation"
                text="The LLM explains the selected build path using retrieved evidence, while fitment and budget logic remain deterministic."
              />
            </div>

            <div className="mx-auto flex max-w-3xl items-start gap-3 border border-outline-variant/40 bg-surface-container-low p-4 text-left">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-secondary" />
              <p className="text-sm leading-6 text-on-surface-variant">
                MVP note: recommendations are for planning and research. The system is designed to surface
                evidence, risks, and assumptions; final part selection should still be verified by a qualified
                tuner or builder.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Pillar({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Database;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-outline-variant/40 bg-surface-container-low p-5 text-left transition hover:border-primary/60">
      <div className="mb-4 flex h-10 w-10 items-center justify-center border border-outline-variant/40 bg-surface-container-high">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="font-headline text-sm font-black uppercase italic tracking-widest">{title}</p>
      <p className="mt-3 text-sm leading-6 text-on-surface-variant">{text}</p>
    </div>
  );
}
