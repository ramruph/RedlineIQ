import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { redlineApi } from '../lib/api';
import type { AnalyticsSummary as AnalyticsSummaryType } from '../types/api';
import { EmptyState, ErrorBanner, Panel, SectionTitle } from './ui';

export function AnalyticsSummary() {
  const [summary, setSummary] = useState<AnalyticsSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSummary() {
    setIsLoading(true);
    setError(null);
    try {
      setSummary(await redlineApi.analytics());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadSummary();
  }, []);

  return (
    <div className="space-y-6">
      <Panel>
        <SectionTitle
          eyebrow="Step 05"
          title="Data Product Analytics"
          subtitle="A deployable product analytics view showing catalog size, evidence size, and product category distribution from PostgreSQL."
        />
      </Panel>

      {error && <ErrorBanner message={error} />}

      <Panel>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-on-surface-variant">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading analytics...
          </div>
        ) : !summary ? (
          <EmptyState title="No Analytics" message="The analytics endpoint has not returned data yet." />
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <Metric label="Products" value={summary.product_count} />
              <Metric label="Vehicles" value={summary.vehicle_count} />
              <Metric label="Variants" value={summary.variant_count} />
              <Metric label="Evidence" value={summary.evidence_count} />
              <Metric label="HPA Chunks" value={summary.hpacademy_chunk_count} />
              <Metric label="Product Chunks" value={summary.product_chunk_count} />
            </div>

            <div className="mt-6 overflow-hidden border border-outline-variant/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-high text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Products</th>
                    <th className="p-3 text-right">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.category_counts.map((row) => (
                    <tr key={row.system_category ?? 'unknown'} className="border-t border-outline-variant/30">
                      <td className="p-3 font-headline font-black uppercase italic">{row.system_category ?? 'unknown'}</td>
                      <td className="p-3 text-right font-mono">{row.product_count}</td>
                      <td className="p-3 text-right font-mono">{row.avg_price ? currency(row.avg_price) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-outline-variant/30 bg-surface-container-low p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant">{label}</p>
      <p className="mt-2 font-headline text-2xl font-black uppercase italic text-primary">{value}</p>
    </div>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
