import { Activity, BarChart3, Boxes, CarFront, ClipboardList, Github, Gauge, Home, Info, RefreshCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ApiStatus, AppScreen } from '../types/navigation';

const navItems: Array<{ id: AppScreen; label: string; icon: typeof Gauge; backendRequired?: boolean }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'build', label: 'Build Planner', icon: Gauge, backendRequired: true },
  { id: 'parts', label: 'Parts Catalog', icon: Boxes, backendRequired: true },
  { id: 'evidence', label: 'Evidence', icon: Activity, backendRequired: true },
  { id: 'intake', label: 'Intake', icon: ClipboardList },
  { id: 'learn', label: 'Learn', icon: Info },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, backendRequired: true },
];

export function Shell({
  activeScreen,
  onScreenChange,
  apiStatus,
  apiError,
  apiBaseUrl,
  onRetryApi,
  children,
}: {
  activeScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  apiStatus: ApiStatus;
  apiError: string | null;
  apiBaseUrl: string;
  onRetryApi: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-dim text-on-surface">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-outline-variant/40 bg-surface-container-low/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <button onClick={() => onScreenChange('home')} className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="font-headline text-lg font-black uppercase italic tracking-tight">RedlineIQ</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary">MVP Build Intelligence</p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeScreen;
              const isLimited = item.backendRequired && apiStatus !== 'online';

              return (
                <button
                  key={item.id}
                  onClick={() => onScreenChange(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 font-headline text-[10px] font-black uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-white'
                  }`}
                  title={isLimited ? 'This page may be limited while the API is unavailable.' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {isLimited && <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />}
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

        <div className="grid grid-cols-5 border-t border-outline-variant/30 lg:hidden">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeScreen;
            const isLimited = item.backendRequired && apiStatus !== 'online';

            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 font-mono text-[8px] uppercase tracking-widest ${
                  isActive ? 'bg-primary text-white' : 'text-on-surface-variant'
                }`}
              >
                <span className="relative">
                  <Icon className="h-4 w-4" />
                  {isLimited && <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-yellow-300" />}
                </span>
                {item.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </header>

      <main className="scanline min-h-screen px-4 pb-10 pt-36 md:px-8 md:pt-28 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          {apiStatus === 'checking' && (
            <div className="mb-4 border border-outline-variant/40 bg-surface-container-low p-3 text-sm text-on-surface-variant">
              Checking RedlineIQ API status at <span className="font-mono text-primary">{apiBaseUrl}</span>...
            </div>
          )}

          {(apiStatus === 'offline' || apiStatus === 'degraded') && (
            <div className="mb-4 border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-100">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-headline text-xs font-black uppercase tracking-widest text-yellow-200">
                    {apiStatus === 'offline' ? 'Limited Mode' : 'Degraded Mode'}
                  </p>
                  <p className="mt-1 text-on-surface-variant">
                    Backend-dependent pages may be unavailable. Learn, Intake, and the product overview remain usable.
                  </p>
                  {apiError && <p className="mt-1 break-words font-mono text-[11px] text-yellow-300">{apiError}</p>}
                </div>

                <button
                  onClick={onRetryApi}
                  className="flex items-center justify-center gap-2 border border-yellow-400/60 px-4 py-2 font-headline text-xs font-black uppercase tracking-widest text-yellow-100 hover:bg-yellow-400/10"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Retry API
                </button>
              </div>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
