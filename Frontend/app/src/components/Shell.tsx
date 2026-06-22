import { Activity, BarChart3, Boxes, CarFront, Github, Gauge, Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AppScreen } from '../types/navigation';

const navItems: Array<{ id: AppScreen; label: string; icon: typeof Gauge }> = [
  { id: 'build', label: 'Build Planner', icon: Gauge },
  { id: 'parts', label: 'Parts Catalog', icon: Boxes },
  { id: 'evidence', label: 'Evidence', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Shell({
  activeScreen,
  onScreenChange,
  children,
}: {
  activeScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-dim text-on-surface">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-outline-variant/40 bg-surface-container-low/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <button
            onClick={() => onScreenChange('build')}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="font-headline text-lg font-black uppercase italic tracking-tight">RedlineIQ</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary">MVP Build Intelligence</p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeScreen;
              return (
                <button
                  key={item.id}
                  onClick={() => onScreenChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-headline text-[10px] font-black uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <a
            href="https://github.com/ramruph/RedlineIQ"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 border border-outline-variant/50 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary md:flex"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>

        <div className="grid grid-cols-4 border-t border-outline-variant/30 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeScreen;
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 font-mono text-[8px] uppercase tracking-widest ${
                  isActive ? 'bg-primary text-white' : 'text-on-surface-variant'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </header>

      <main className="scanline min-h-screen px-4 pb-10 pt-32 md:px-8 md:pt-24">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
