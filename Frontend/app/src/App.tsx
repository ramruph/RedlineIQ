import { useEffect, useMemo, useState } from 'react';
import { redlineApi, API_BASE_URL } from './lib/api';
import type { RecommendResponse, Vehicle, VehicleVariant } from './types/api';
import type { AppScreen } from './types/navigation';
import { Shell } from './components/Shell';
import { BuildPlanner } from './components/BuildPlanner';
import { PartsCatalog } from './components/PartsCatalog';
import { EvidencePanel } from './components/EvidencePanel';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { LandingPage } from './components/LandingPage';
import { ErrorBanner, Panel } from './components/ui';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('build');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [variants, setVariants] = useState<VehicleVariant[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendResponse | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      setIsBooting(true);
      setBootError(null);
      try {
        await redlineApi.health();
        const vehicleRows = await redlineApi.vehicles();
        setVehicles(vehicleRows);

        const defaultVehicle =
          vehicleRows.find((vehicle) => vehicle.vehicle_id === 'toyota_gr_supra_a90') ?? vehicleRows[0];

        if (defaultVehicle) {
          setSelectedVehicleId(defaultVehicle.vehicle_id);
        }
      } catch (err) {
        setBootError(err instanceof Error ? err.message : 'Unable to connect to API');
      } finally {
        setIsBooting(false);
      }
    }

    void loadInitialData();
  }, []);

  useEffect(() => {
    async function loadVariants() {
      if (!selectedVehicleId) return;

      try {
        const variantRows = await redlineApi.variants(selectedVehicleId);
        setVariants(variantRows);

        const defaultVariant =
          variantRows.find((variant) => variant.variant_id === 'toyota_gr_supra_a90_3_0_auto_2024_2025') ??
          variantRows[0] ??
          null;

        setSelectedVariantId(defaultVariant?.variant_id ?? null);
      } catch (err) {
        setVariants([]);
        setSelectedVariantId(null);
        setBootError(err instanceof Error ? err.message : 'Unable to load vehicle variants');
      }
    }

    void loadVariants();
  }, [selectedVehicleId]);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.variant_id === selectedVariantId) ?? null,
    [variants, selectedVariantId],
  );

  function handleVehicleChange(vehicleId: string) {
    setSelectedVehicleId(vehicleId);
    setRecommendation(null);
  }

  function renderScreen() {
    if (isBooting) {
      return (
        <Panel>
          <p className="font-headline text-xl font-black uppercase italic">Connecting to RedlineIQ API...</p>
          <p className="mt-2 text-sm text-on-surface-variant">API base URL: {API_BASE_URL}</p>
        </Panel>
      );
    }

    if (bootError) {
      return (
        <div className="space-y-4">
          <ErrorBanner message={bootError} />
          <Panel>
            <p className="font-headline text-lg font-black uppercase italic">Frontend integration checklist</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-on-surface-variant">
              <li>Confirm FastAPI is running.</li>
              <li>Confirm <code className="text-primary">VITE_API_BASE_URL</code> points to your backend.</li>
              <li>Confirm CORS allows your frontend origin.</li>
              <li>Open <code className="text-primary">{API_BASE_URL}/health</code> in the browser.</li>
            </ul>
          </Panel>
        </div>
      );
    }

    if (!selectedVehicleId) {
      return <Panel>No vehicles found. Check your Postgres load and FastAPI /vehicles endpoint.</Panel>;
    }

    if (activeScreen === 'build') {
      return (
        <BuildPlanner
          vehicles={vehicles}
          variants={variants}
          selectedVehicleId={selectedVehicleId}
          selectedVariantId={selectedVariantId}
          onVehicleChange={handleVehicleChange}
          onVariantChange={setSelectedVariantId}
          onRecommendation={setRecommendation}/>); }

    if (activeScreen === 'parts') {
      return <PartsCatalog vehicleId={selectedVehicleId} variant={selectedVariant} />;
    }

    if (activeScreen === 'evidence') {
      return <EvidencePanel vehicleId={selectedVehicleId} variant={selectedVariant} recommendation={recommendation} />;
    }

    return <AnalyticsSummary />;
  }
  if (activeScreen === 'home') {
    return <LandingPage onStart={() => setActiveScreen('build')} />;
  }
  return (
    <Shell activeScreen={activeScreen} onScreenChange={setActiveScreen}>
      {renderScreen()}
    </Shell>
  );
}
