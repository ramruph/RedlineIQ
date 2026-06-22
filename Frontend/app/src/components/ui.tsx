import type { ReactNode } from 'react';

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`glass-panel p-5 ${className}`}>{children}</section>;
}

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      {eyebrow && <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">{eyebrow}</p>}
      <h2 className="font-headline text-2xl md:text-3xl font-black uppercase italic tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-on-surface-variant max-w-3xl">{subtitle}</p>}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'primary' | 'secondary' | 'warning' | 'danger' | 'neutral' }) {
  const classes = {
    primary: 'border-primary/50 text-primary bg-primary/10',
    secondary: 'border-secondary/50 text-secondary bg-secondary/10',
    warning: 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10',
    danger: 'border-red-500/50 text-red-300 bg-red-500/10',
    neutral: 'border-outline-variant text-on-surface-variant bg-surface-container-low',
  }[tone];

  return <span className={`inline-flex items-center border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${classes}`}>{children}</span>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">{children}</label>;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="border border-outline-variant/40 bg-surface-container-low p-6 text-center">
      <p className="font-headline text-lg font-black uppercase italic">{title}</p>
      <p className="mt-2 text-sm text-on-surface-variant">{message}</p>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return <div className="border border-red-500/50 bg-red-950/50 p-3 text-sm text-red-200">{message}</div>;
}
