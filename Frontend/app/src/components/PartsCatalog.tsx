import { useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { redlineApi } from '../lib/api';
import type { Product, VehicleVariant } from '../types/api';
import { Badge, EmptyState, ErrorBanner, FieldLabel, Panel, SectionTitle } from './ui';

const CATEGORIES = [
  '',
  'engine_power',
  'exhaust',
  'tuning',
  'fueling',
  'cooling',
  'brakes',
  'aero',
  'suspension',
  'wheels_tires',
];

export function PartsCatalog({
  vehicleId,
  variant,
}: {
  vehicleId: string;
  variant: VehicleVariant | null;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await redlineApi.products({
        vehicle_id: vehicleId,
        variant_id: variant?.variant_id,
        engine_id: variant?.engine_id,
        category: category || undefined,
        limit,
      });
      setProducts(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (vehicleId) void loadProducts();
  }, [vehicleId, variant?.variant_id, category, limit]);

  const totalValue = useMemo(
    () => products.reduce((sum, product) => sum + (Number(product.price) || 0), 0),
    [products],
  );

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="Step 03"
            title="Parts Catalog"
            subtitle="Real products filtered by vehicle, variant, engine, and category from the FastAPI products endpoint."
          />
          <div className="grid gap-3 md:grid-cols-3 lg:min-w-[520px]">
            <div className="space-y-2">
              <FieldLabel>Category</FieldLabel>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full bg-surface-container-low p-3 text-sm outline-none technical-border-b"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat || 'all'} value={cat}>
                    {cat ? cat : 'all categories'}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <FieldLabel>Limit</FieldLabel>
              <select
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="w-full bg-surface-container-low p-3 text-sm outline-none technical-border-b"
              >
                {[25, 50, 100, 150].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <button
              onClick={loadProducts}
              className="flex items-center justify-center gap-2 bg-primary px-4 py-3 font-headline text-xs font-black uppercase tracking-widest text-white"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Stat label="Loaded Products" value={products.length} />
          <Stat label="Visible Catalog Value" value={currency(totalValue)} />
          <Stat label="Engine Filter" value={variant?.engine_id ?? 'Any'} />
        </div>
      </Panel>

      {error && <ErrorBanner message={error} />}

      <Panel>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-on-surface-variant">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading catalog...
          </div>
        ) : products.length === 0 ? (
          <EmptyState title="No Products" message="Try removing the category filter or checking vehicle fitments in Postgres." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="border border-outline-variant/40 bg-surface-container-low p-4 transition-colors hover:border-primary/60">
      <div className="mb-3 flex flex-wrap gap-2">
        {product.system_category && <Badge>{product.system_category}</Badge>}
        {product.subsystem && <Badge tone="secondary">{product.subsystem}</Badge>}
        {product.requires_tune && <Badge tone="warning">Tune</Badge>}
        {product.requires_fueling && <Badge tone="warning">Fueling</Badge>}
        {product.requires_cooling && <Badge tone="warning">Cooling</Badge>}
      </div>
      <h3 className="font-headline text-lg font-black uppercase italic tracking-tight">{product.product_name}</h3>
      <p className="mt-1 text-sm text-on-surface-variant">{product.brand ?? 'Unknown brand'}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Stat label="Price" value={product.price ? currency(product.price) : 'N/A'} />
        <Stat label="Install" value={product.install_complexity ?? 'unknown'} />
        <Stat label="Reliability" value={product.reliability_risk ?? 'unknown'} />
        <Stat label="Emissions" value={product.emissions_risk ?? 'unknown'} />
      </div>
      {product.product_url && (
        <a
          href={product.product_url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
        >
          View Product →
        </a>
      )}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-outline-variant/30 bg-surface p-3">
      <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant">{label}</p>
      <p className="mt-1 truncate font-headline text-sm font-black uppercase italic text-white">{value}</p>
    </div>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
