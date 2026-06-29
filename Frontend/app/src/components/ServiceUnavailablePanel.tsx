import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Panel } from './ui';

export function ServiceUnavailablePanel({
  title = 'This feature is temporarily unavailable',
  message = 'The backend service is unavailable or waking up. You can still use the Learn and Intake pages while it reconnects.',
  detail,
  onRetry,
}: {
  title?: string;
  message?: string;
  detail?: string | null;
  onRetry?: () => void;
}) {
  return (
    <Panel>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-yellow-300" />
          <div>
            <p className="font-headline text-lg font-black uppercase italic">{title}</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant">{message}</p>
            {detail && (
              <p className="mt-3 max-w-3xl break-words font-mono text-[11px] leading-5 text-yellow-300/90">
                {detail}
              </p>
            )}
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 border border-outline-variant/60 px-4 py-2 font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        )}
      </div>
    </Panel>
  );
}
