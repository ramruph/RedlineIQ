import { ExternalLink, ShieldCheck } from 'lucide-react';
import type { RecommendResponse, RecommendedProduct } from '../types/api';
import { Badge, EmptyState, Panel, SectionTitle } from './ui';

export function RecommendationResults({
  result,
  isLoading,
}: {
  result: RecommendResponse | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Panel>
        <EmptyState title="Running Recommendation Engine" message="Scoring fitment, category relevance, power band, risk, dependencies, and budget." />
      </Panel>
    );
  }

  if (!result) {
    return (
      <Panel>
        <EmptyState title="No Build Generated Yet" message="Set your build target and click Generate Build to pull real recommendations from FastAPI/Postgres." />
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <SectionTitle
          eyebrow="Step 02"
          title="Recommended Build"
          subtitle="Ranked parts returned from the recommendation API. Each result includes fitment confidence, category relevance, and an explainable reason."
        />
        <div className="grid grid-cols-2 gap-2 text-right md:min-w-72">
          <SummaryCard label="Estimated Cost" value={currency(result.estimated_total_cost)} />
          <SummaryCard label="Confidence" value={`${Math.round(result.confidence_score * 100)}%`} />
          <SummaryCard label="Target" value={`${result.target_whp} WHP`} />
          <SummaryCard label="Power Bands" value={result.power_bands.join(', ')} />
        </div>
      </div>

      {result.recommended_products.length === 0 ? (
        <EmptyState title="No Parts Found" message="Try increasing budget, reducing target WHP, or using a broader vehicle/engine-level fitment." />
      ) : (
        <div className="mt-5 space-y-4">
          {result.recommended_products.map((product, index) => (
            <ProductCard key={product.product_id} product={product} index={index + 1} />
          ))}
        </div>
      )}
    </Panel>
  );
}

function ProductCard({ product, index }: { product: RecommendedProduct; index: number }) {
  return (
    <article className="border border-outline-variant/40 bg-surface-container-low p-4 transition-colors hover:border-primary/60 hover:bg-surface-container-high">
      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="primary">#{index}</Badge>
            {product.system_category && <Badge>{product.system_category}</Badge>}
            {product.subsystem && <Badge tone="secondary">{product.subsystem}</Badge>}
            {product.fitment_scope && <Badge tone="primary">{product.fitment_scope}</Badge>}
          </div>

          <h3 className="font-headline text-xl font-black uppercase italic tracking-tight">
            {product.product_name}
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">{product.brand ?? 'Unknown brand'}</p>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">{product.reason}</p>
        </div>

        <div className="grid min-w-56 grid-cols-2 gap-2 text-right lg:grid-cols-1">
          <Score label="Price" value={product.price ? currency(product.price) : 'N/A'} />
          <Score label="Score" value={`${Math.round(product.recommendation_score * 100)}%`} />
          <Score label="Fitment" value={`${Math.round((product.fitment_confidence ?? 0) * 100)}%`} />
          <Score label="Category" value={`${Math.round((product.category_relevance ?? 0) * 100)}%`} />
        </div>
      </div>
    </article>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 bg-surface-container-low p-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-on-surface-variant">{label}</p>
      <p className="mt-1 truncate font-headline text-sm font-black uppercase italic text-white">{value}</p>
    </div>
  );
}

function Score({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 bg-surface p-3">
      <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant">{label}</p>
      <p className="mt-1 font-headline text-sm font-black uppercase italic text-primary">{value}</p>
    </div>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
