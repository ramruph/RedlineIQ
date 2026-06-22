import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Loader2, Sparkles } from 'lucide-react';
import { redlineApi } from '../lib/api';
import type { BuildExplanationResponse, RecommendRequest, RecommendResponse, RiskTolerance, UseCase, Vehicle, VehicleVariant } from '../types/api';
import { Badge, ErrorBanner, FieldLabel, Panel, SectionTitle } from './ui';
import { RecommendationResults } from './RecommendationResults';
import { AIExplanationPanel } from './AIExplanationPanel';

const USE_CASES: Array<{ value: UseCase; label: string; description: string }> = [
  { value: 'street', label: 'Street', description: 'Daily-friendly power path' },
  { value: 'drag', label: 'Drag', description: 'Power and traction focus' },
  { value: 'track', label: 'Track', description: 'Cooling, braking, repeatability' },
  { value: 'time_attack', label: 'Time Attack', description: 'Lap-time and aero focus' },
];

const RISK_LEVELS: RiskTolerance[] = ['low', 'medium', 'high'];

export function BuildPlanner({
  vehicles,
  variants,
  selectedVehicleId,
  selectedVariantId,
  onVehicleChange,
  onVariantChange,
  onRecommendation,
}: {
  vehicles: Vehicle[];
  variants: VehicleVariant[];
  selectedVehicleId: string;
  selectedVariantId: string | null;
  onVehicleChange: (vehicleId: string) => void;
  onVariantChange: (variantId: string | null) => void;
  onRecommendation: (result: RecommendResponse | null) => void;
}) {
  const [useCase, setUseCase] = useState<UseCase>('track');
  const [targetWhp, setTargetWhp] = useState(400);
  const [budget, setBudget] = useState(5000);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('medium');
  const [maxParts, setMaxParts] = useState(8);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [explanation, setExplanation] = useState<BuildExplanationResponse | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.vehicle_id === selectedVehicleId) ?? null,
    [vehicles, selectedVehicleId],
  );

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.variant_id === selectedVariantId) ?? null,
    [variants, selectedVariantId],
  );

  useEffect(() => {
    setResult(null);
    setExplanation(null);
    setExplanationError(null);
    onRecommendation(null);
  }, [selectedVehicleId, selectedVariantId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setIsExplaining(false);
    setError(null);
    setExplanationError(null);
    setResult(null);
    setExplanation(null);
    onRecommendation(null);

    const payload: RecommendRequest = {
      vehicle_id: selectedVehicleId,
      variant_id: selectedVariantId,
      engine_id: selectedVariant?.engine_id ?? 'bmw_b58',
      use_case: useCase,
      target_whp: targetWhp,
      budget,
      risk_tolerance: riskTolerance,
      max_parts: maxParts,
    };

    try {
      const response = await redlineApi.recommend(payload);

      setResult(response);
      onRecommendation(response);

      if (response.recommended_products.length === 0) {
        return;
      }

      setIsExplaining(true);

      try {
        const explanationResponse = await redlineApi.buildExplanation({
          vehicle_id: response.vehicle_id,
          variant_id: response.variant_id,
          use_case: response.use_case,
          target_whp: response.target_whp,
          budget: response.budget,
          estimated_total_cost: response.estimated_total_cost,
          recommended_products: response.recommended_products,
          top_k: 8,
        });

        setExplanation(explanationResponse);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI explanation failed';
        setExplanationError(message);
      } finally {
        setIsExplaining(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Recommendation failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <Panel>
        <SectionTitle
          eyebrow="Step 01"
          title="Build Planner"
          subtitle="Select the vehicle, build use case, target wheel horsepower, budget, and risk tolerance. The API returns real parts from PostgreSQL."
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <FieldLabel>Vehicle</FieldLabel>
            <select
              value={selectedVehicleId}
              onChange={(event) => onVehicleChange(event.target.value)}
              className="w-full bg-surface-container-low p-3 text-sm outline-none technical-border-b"
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                  {vehicle.make} {vehicle.model} {vehicle.generation ?? ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <FieldLabel>Variant</FieldLabel>
            <select
              value={selectedVariantId ?? ''}
              onChange={(event) => onVariantChange(event.target.value || null)}
              className="w-full bg-surface-container-low p-3 text-sm outline-none technical-border-b"
            >
              <option value="">Vehicle/engine-level recommendation</option>
              {variants.map((variant) => (
                <option key={variant.variant_id} value={variant.variant_id}>
                  {variant.trim ?? variant.variant_id} / {variant.engine_id ?? 'unknown engine'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <FieldLabel>Target WHP</FieldLabel>
              <input
                type="number"
                min={250}
                max={1200}
                value={targetWhp}
                onChange={(event) => setTargetWhp(Number(event.target.value))}
                className="w-full bg-surface-container-low p-3 font-mono text-sm outline-none technical-border-b"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Budget USD</FieldLabel>
              <input
                type="number"
                min={0}
                step={100}
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="w-full bg-surface-container-low p-3 font-mono text-sm outline-none technical-border-b"
              />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Use Case</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {USE_CASES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setUseCase(option.value)}
                  className={`border p-3 text-left transition-colors ${
                    useCase === option.value
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:border-primary/60'
                  }`}
                >
                  <p className="font-headline text-xs font-black uppercase tracking-widest">{option.label}</p>
                  <p className="mt-1 text-[11px] text-on-surface-variant">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <FieldLabel>Risk Tolerance</FieldLabel>
              <select
                value={riskTolerance}
                onChange={(event) => setRiskTolerance(event.target.value as RiskTolerance)}
                className="w-full bg-surface-container-low p-3 text-sm outline-none technical-border-b"
              >
                {RISK_LEVELS.map((risk) => (
                  <option key={risk} value={risk}>
                    {risk.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <FieldLabel>Max Parts</FieldLabel>
              <input
                type="number"
                min={1}
                max={25}
                value={maxParts}
                onChange={(event) => setMaxParts(Number(event.target.value))}
                className="w-full bg-surface-container-low p-3 font-mono text-sm outline-none technical-border-b"
              />
            </div>
          </div>

          {selectedVehicle && (
            <div className="grid grid-cols-2 gap-2 border border-outline-variant/30 bg-surface-container-low p-3 text-xs">
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant">Platform</span>
                <span className="font-bold">{selectedVehicle.platform_code ?? 'Unknown'}</span>
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant">Engine</span>
                <span className="font-bold">{selectedVariant?.engine_id ?? 'Any compatible'}</span>
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant">Stock HP</span>
                <span className="font-bold">{selectedVariant?.stock_hp ?? 'N/A'}</span>
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant">Weight</span>
                <span className="font-bold">{selectedVariant?.curb_weight_lbs ? `${selectedVariant.curb_weight_lbs} lb` : 'N/A'}</span>
              </div>
            </div>
          )}

          {error && <ErrorBanner message={error} />}

          <button
            type="submit"
            disabled={isLoading || !selectedVehicleId}
            className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-4 font-headline text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isLoading ? 'Generating Build' : 'Generate Build'}
          </button>
        </form>
      </Panel>

      <div className="space-y-6">
        <Panel>
          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="Selected Vehicle" value={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'None'} />
            <Metric label="Target" value={`${targetWhp} WHP`} />
            <Metric label="Budget" value={currency(budget)} />
            <Metric label="Mode" value={useCase.replace('_', ' ')} />
          </div>
        </Panel>

        {result?.warnings?.length ? (
          <Panel className="border-yellow-500/40">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 text-yellow-300" />
              <div>
                <p className="font-headline text-sm font-black uppercase tracking-widest text-yellow-200">Build Warnings</p>
                <ul className="mt-2 space-y-1 text-sm text-on-surface-variant">
                  {result.warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        ) : null}

        <RecommendationResults result={result} isLoading={isLoading} />

        <AIExplanationPanel
          explanation={explanation}
          isLoading={isExplaining}
          error={explanationError}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-outline-variant/30 bg-surface-container-low p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant">{label}</p>
      <p className="mt-1 truncate font-headline text-lg font-black uppercase italic">{value}</p>
    </div>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

