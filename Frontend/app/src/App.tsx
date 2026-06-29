import { useEffect, useMemo, useState } from 'react';
import { redlineApi, API_BASE_URL } from './lib/api';
import type { RecommendResponse, Vehicle, VehicleVariant } from './types/api';
import type { ApiStatus, AppScreen } from './types/navigation';
import { Shell } from './components/Shell';
import { BuildPlanner } from './components/BuildPlanner';
import { PartsCatalog } from './components/PartsCatalog';
import { EvidencePanel } from './components/EvidencePanel';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { LandingPage } from './components/LandingPage';
import { HomeDashboard } from './components/HomeDashboard';
import { IntakePage } from './components/IntakePage';
import { LearnPage } from './components/LearnPage';
import { Panel } from './components/ui';
import { ServiceUnavailablePanel } from './components/ServiceUnavailablePanel';

const DEFAULT_VEHICLE_ID = 'toyota_gr_supra_a90';
const DEFAULT_VARIANT_ID = 'toyota_gr_supra_a90_3_0_auto_2024_2025';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('landing');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [variants, setVariants] = useState<VehicleVariant[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(DEFAULT_VEHICLE_ID);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(DEFAULT_VARIANT_ID);
  const [recommendation, setRecommendation] = useState<RecommendResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadInitialData() {
    setApiStatus('checking');
    setApiError(null);

    try {
      await redlineApi.health();
      const vehicleRows = await redlineApi.vehicles();
      setVehicles(vehicleRows);

      const defaultVehicle = vehicleRows.find((vehicle) => vehicle.vehicle_id === DEFAULT_VEHICLE_ID) ?? vehicleRows[0];

      if (defaultVehicle) {
        setSelectedVehicleId(defaultVehicle.vehicle_id);
      }

      setApiStatus('online');
    } catch (err) {
      setVehicles([]);
      setVariants([]);
      setSelectedVehicleId(DEFAULT_VEHICLE_ID);
      setSelectedVariantId(DEFAULT_VARIANT_ID);
      setApiStatus('offline');
      setApiError(err instanceof Error ? err.message : 'Unable to connect to RedlineIQ API');
    }
  }

  useEffect(() => {
    void loadInitialData();
  }, []);

  useEffect(() => {
    async function loadVariants() {
      if (!selectedVehicleId || apiStatus !== 'online') return;

      try {
        const variantRows = await redlineApi.variants(selectedVehicleId);
        setVariants(variantRows);

        const defaultVariant =
          variantRows.find((variant) => variant.variant_id === DEFAULT_VARIANT_ID) ?? variantRows[0] ?? null;

        setSelectedVariantId(defaultVariant?.variant_id ?? null);
      } catch (err) {
        setVariants([]);
        setSelectedVariantId(null);
        setApiStatus('degraded');
        setApiError(err instanceof Error ? err.message : 'Unable to load vehicle variants');
      }
    }

    void loadVariants();
  }, [selectedVehicleId, apiStatus]);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.variant_id === selectedVariantId) ?? null,
    [variants, selectedVariantId],
  );

  function handleVehicleChange(vehicleId: string) {
    setSelectedVehicleId(vehicleId);
    setRecommendation(null);
  }

  const backendReady = apiStatus === 'online';

  function renderScreen() {
    if (activeScreen === 'home') {
      return (
        <HomeDashboard
          vehicles={vehicles}
          variants={variants}
          selectedVehicleId={selectedVehicleId}
          selectedVariant={selectedVariant}
          apiStatus={apiStatus}
          onStartBuild={() => setActiveScreen('build')}
          onOpenIntake={() => setActiveScreen('intake')}
          onOpenLearn={() => setActiveScreen('learn')}
        />
      );
    }

    if (activeScreen === 'build') {
      if (!backendReady) {
        return (
          <ServiceUnavailablePanel
            title="Build Planner is in limited mode"
            message="The recommendation API is unavailable or still waking up. You can still request a vehicle, submit your current build, or read how RedlineIQ works."
            detail={apiError}
            onRetry={loadInitialData}
          />
        );
      }

      if (!selectedVehicleId) {
        return <Panel>No vehicles were returned by the API. Check the database load and /api/v1/vehicles endpoint.</Panel>;
      }

      return (
        <BuildPlanner
          vehicles={vehicles}
          variants={variants}
          selectedVehicleId={selectedVehicleId}
          selectedVariantId={selectedVariantId}
          onVehicleChange={handleVehicleChange}
          onVariantChange={setSelectedVariantId}
          onRecommendation={setRecommendation}
        />
      );
    }

    if (activeScreen === 'parts') {
      if (!backendReady) {
        return (
          <ServiceUnavailablePanel
            title="Parts Catalog is temporarily unavailable"
            message="The parts catalog depends on the backend database connection. The Learn and Intake pages remain available."
            detail={apiError}
            onRetry={loadInitialData}
          />
        );
      }

      return <PartsCatalog vehicleId={selectedVehicleId} variant={selectedVariant} />;
    }

    if (activeScreen === 'evidence') {
      if (!backendReady) {
        return (
          <ServiceUnavailablePanel
            title="Evidence browser is temporarily unavailable"
            message="Evidence retrieval depends on the backend API. You can still use the Learn and Intake pages while the service reconnects."
            detail={apiError}
            onRetry={loadInitialData}
          />
        );
      }

      return <EvidencePanel vehicleId={selectedVehicleId} variant={selectedVariant} recommendation={recommendation} />;
    }

    if (activeScreen === 'intake') {
      return <IntakePage apiStatus={apiStatus} />;
    }

    if (activeScreen === 'learn') {
      return <LearnPage onStartBuild={() => setActiveScreen('build')} onOpenIntake={() => setActiveScreen('intake')} />;
    }

    if (activeScreen === 'analytics') {
      if (!backendReady) {
        return (
          <ServiceUnavailablePanel
            title="Analytics are temporarily unavailable"
            message="Analytics depend on the backend API. Product information, roadmap content, and intake remain available."
            detail={apiError}
            onRetry={loadInitialData}
          />
        );
      }

      return <AnalyticsSummary />;
    }

    return null;
  }

  if (activeScreen === 'landing') {
    return (
      <LandingPage
        apiStatus={apiStatus}
        onOpenHome={() => setActiveScreen('home')}
        onOpenBuild={() => setActiveScreen('build')}
        onOpenIntake={() => setActiveScreen('intake')}
        onOpenLearn={() => setActiveScreen('learn')}
      />
    );
  }

  return (
    <Shell
      activeScreen={activeScreen}
      onScreenChange={setActiveScreen}
      apiStatus={apiStatus}
      apiError={apiError}
      apiBaseUrl={API_BASE_URL}
      onRetryApi={loadInitialData}
    >
      {renderScreen()}
    </Shell>
  );
}
