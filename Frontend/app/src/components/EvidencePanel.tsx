import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { redlineApi } from '../lib/api';
import type { EvidenceItem, RecommendResponse, VehicleVariant } from '../types/api';
import { Badge, EmptyState, ErrorBanner, FieldLabel, Panel, SectionTitle } from './ui';

export function EvidencePanel({
  vehicleId,
  variant,
  recommendation,
}: {
  vehicleId: string;
  variant: VehicleVariant | null;
  recommendation: RecommendResponse | null;
}) {
  const [category, setCategory] = useState('');
  const [minQuality, setMinQuality] = useState(60);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadEvidence() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await redlineApi.evidence({
        vehicle_id: vehicleId,
        variant_id: variant?.variant_id,
        category: category || undefined,
        min_quality: minQuality,
        limit: 25,
      });
      setEvidence(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load evidence');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (vehicleId) void loadEvidence();
  }, [vehicleId, variant?.variant_id, category, minQuality]);

  const suggestedCategories = Array.from(
    new Set(recommendation?.recommended_products.map((p) => p.system_category).filter(Boolean) as string[]),
  );

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="Step 04"
            title="Evidence Explorer"
            subtitle="Use this to prove recommendations are grounded in forum, lap-time, dyno, and product/evidence data instead of static mock UI."
          />
          <div className="grid gap-3 md:grid-cols-3 lg:min-w-[520px]">
            <div className="space-y-2">
              <FieldLabel>Category Contains</FieldLabel>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="cooling, brakes, aero..."
                className="w-full bg-surface-container-low p-3 text-sm outline-none technical-border-b"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Min Quality</FieldLabel>
              <input
                type="number"
                min={0}
                max={100}
                value={minQuality}
                onChange={(event) => setMinQuality(Number(event.target.value))}
                className="w-full bg-surface-container-low p-3 font-mono text-sm outline-none technical-border-b"
              />
            </div>
            <button
              onClick={loadEvidence}
              className="flex items-center justify-center gap-2 bg-primary px-4 py-3 font-headline text-xs font-black uppercase tracking-widest text-white"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>

        {suggestedCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">From recommendation:</span>
            {suggestedCategories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}>
                <Badge tone="primary">{cat}</Badge>
              </button>
            ))}
          </div>
        )}
      </Panel>

      {error && <ErrorBanner message={error} />}

      <Panel>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-on-surface-variant">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading evidence...
          </div>
        ) : evidence.length === 0 ? (
          <EmptyState title="No Evidence Found" message="Try lowering min quality or searching a broader category." />
        ) : (
          <div className="space-y-4">
            {evidence.map((item) => (
              <article key={item.evidence_id} className="border border-outline-variant/40 bg-surface-container-low p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {item.evidence_type && <Badge tone="primary">{item.evidence_type}</Badge>}
                  {item.source_dataset && <Badge>{item.source_dataset}</Badge>}
                  {item.track_name && <Badge tone="secondary">{item.track_name}</Badge>}
                  <Badge tone="secondary">Quality {Math.round(item.evidence_quality_score ?? 0)}</Badge>
                </div>
                <p className="text-sm leading-6 text-on-surface-variant">
                  {item.cleaned_content ?? 'No content available.'}
                </p>
                {item.mentioned_categories && (
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-primary">
                    {item.mentioned_categories}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
