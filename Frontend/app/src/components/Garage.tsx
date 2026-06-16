import React, { useState, useEffect } from 'react';
import { DRIVETRAIN_PARTS } from '../constants';
import {
  Radar,
  Shield,
  Zap,
  Target,
  Info,
} from 'lucide-react';
import { BuildGoals, Car } from '../types';
import type { BuildAnalysisResult } from '../types/api';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-highest text-[9px] font-mono text-white border border-outline-variant shadow-xl animate-in fade-in slide-in-from-bottom-1">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-surface-container-highest" />
        </div>
      )}
    </div>
  );
};

interface GarageProps {
  activeCar: Car;
  goals: BuildGoals;
  onUpdateGoals: (goals: BuildGoals) => void;
  onScreenChange: (screen: any) => void;
  analysis?: BuildAnalysisResult | null;
}

export const Garage: React.FC<GarageProps> = ({
  activeCar,
  goals,
  onUpdateGoals,
  onScreenChange,
  analysis,
}) => {
  const [view, setView] = useState<'DASHBOARD' | 'PROFILE'>('DASHBOARD');
  const [watchlist, setWatchlist] = useState<any[]>([]);

  const equippedParts = DRIVETRAIN_PARTS.filter((p) => p.equipped);
  const totalModPrice = equippedParts.reduce((sum, p) => sum + p.price, 0);

  const displayedHp = analysis?.score.projected_hp ?? activeCar.specs.hp;
  const displayedTorque = analysis?.score.projected_torque_lbft ?? 0;
  const displayedWeight =
    analysis?.score.projected_weight_kg ?? activeCar.specs.weight;
  const displayedCost =
    analysis?.score.projected_cost_usd ?? totalModPrice;

  const selectedParts = analysis?.selected_parts ?? [];

  const profileParts = analysis
    ? selectedParts.map((part) => ({
        id: part.part_id,
        brand: 'REDLINEIQ',
        name: part.name,
        price: part.price_usd,
      }))
    : equippedParts;

  useEffect(() => {
    const saved = localStorage.getItem('apex_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, [view]);

  const hpProgress =
    goals.targetHp > 0 ? Math.min(100, (displayedHp / goals.targetHp) * 100) : 0;

  const weightProgress =
    displayedWeight > 0
      ? Math.min(100, (goals.targetWeight / displayedWeight) * 100)
      : 0;

  const reliabilityScore = analysis?.score.reliability_score ?? null;
  const warnings = analysis?.warnings ?? [];
  const explanation = analysis?.explanation_summary ?? null;

  return (
    <div className="h-full overflow-hidden flex flex-col bg-surface">
      <section className="flex-1 relative overflow-hidden flex flex-col border-b md:border-b-0 border-outline-variant/10">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden flex items-center justify-center">
          <span className="text-[25rem] font-black font-headline tracking-tighter">
            REDLINE
          </span>
        </div>

        <div className="p-8 flex justify-between items-start z-10 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/10 text-primary px-2 py-0.5 font-mono text-[8px] font-bold border border-primary/20 uppercase tracking-widest">
                REDLINE_IQ 
              </span>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                BUILD_ID: {activeCar.platform}-001
              </span>
            </div>

            <h1 className="text-4xl font-headline font-black italic tracking-tighter uppercase mb-1">
              {activeCar.name}_{view === 'DASHBOARD' ? 'DASHBOARD' : 'PROFILE'}
            </h1>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                <Radar className="w-3.5 h-3.5" /> 
              </span>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setView('DASHBOARD')}
                  className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    view === 'DASHBOARD'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container-high text-outline border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  DASHBOARD
                </button>
                <button
                  onClick={() => setView('PROFILE')}
                  className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    view === 'PROFILE'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container-high text-outline border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  CAR_PROFILE
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <label className="text-[10px] text-primary font-bold tracking-widest uppercase">
                  BUILD_STATUS
                </label>
                <Tooltip content="Current computed build status based on backend analysis and selected mission parameters.">
                  <Info className="w-3 h-3 text-outline" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-2 justify-end">
                <span className="text-xl font-headline font-bold tabular-nums">
                  {analysis ? 'ANALYZED' : 'STANDBY'}
                </span>
                {analysis && (
                  <span className="text-[10px] text-primary font-bold">
                    READY
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-outline tracking-widest uppercase mb-1">
                TOTAL_VALUATION
              </div>
              <div className="text-xl font-headline font-bold text-secondary tracking-widest">
                ${(displayedHp * 100 + displayedCost).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 z-10 space-y-8 hide-scrollbar">
          {view === 'DASHBOARD' ? (
            <>
              <div className="relative w-full h-64 flex items-center justify-center bg-surface-container-low/30 border border-outline-variant/10 group">
                <img
                  className="h-full grayscale brightness-110 contrast-125 drop-shadow-[0_0_50px_rgba(112,151,117,0.2)] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  src={activeCar.image}
                  alt={activeCar.name}
                />

                <div className="absolute top-4 left-4 p-4 bg-surface/60 backdrop-blur-md border border-outline-variant/20">
                  <div className="text-[8px] font-bold text-outline uppercase mb-1">
                    CHASSIS_STABILITY
                  </div>
                  <div className="text-lg font-headline font-bold text-primary italic">
                    98.4%
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-4">
                  <div className="text-right p-3 bg-surface/60 backdrop-blur-md border border-outline-variant/20">
                    <span className="text-[8px] font-bold text-outline uppercase block">
                      THERMAL_LOAD
                    </span>
                    <span className="font-mono text-xs font-bold text-primary">
                      {analysis ? 'ANALYZED' : 'OPTIMAL'}
                    </span>
                  </div>
                  <div className="text-right p-3 bg-surface/60 backdrop-blur-md border border-outline-variant/20">
                    <span className="text-[8px] font-bold text-outline uppercase block">
                      IGNITION_SEQ
                    </span>
                    <span className="font-mono text-xs font-bold text-secondary">
                      READY
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-6 border-l-2 border-primary group/card hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="font-headline text-lg font-bold uppercase tracking-widest italic">
                        PROPULSION_UNIT
                      </h3>
                    </div>
                    <Tooltip content="Internal combustion parameters and peak power delivery metrics.">
                      <Info className="w-3 h-3 text-outline opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    </Tooltip>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center group/item">
                      <span className="text-[10px] text-outline font-bold uppercase">
                        ENGINE_TYPE
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {activeCar.specs.engine}
                      </span>
                    </div>

                    <div className="flex justify-between items-center group/item">
                      <span className="text-[10px] text-outline font-bold uppercase">
                        OUTPUT_PEAK
                      </span>
                      <span className="font-mono text-xs font-bold text-primary">
                        {displayedHp} BHP
                      </span>
                    </div>

                    <div className="flex justify-between items-center group/item">
                      <span className="text-[10px] text-outline font-bold uppercase">
                        TORQUE_OUTPUT
                      </span>
                      <span className="font-mono text-xs font-bold text-primary">
                        {displayedTorque} LB-FT
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[8px] font-bold text-outline uppercase">
                          POWER_TARGET_PROGRESS
                        </span>
                        <span className="text-[10px] font-mono font-bold text-primary">
                          {Math.round(hpProgress)}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-full ${
                              i < hpProgress / 5
                                ? 'bg-primary'
                                : 'bg-surface-container-highest'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-outline font-bold uppercase">
                        DISPLACEMENT
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {activeCar.specs.displacement}L
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low p-6 border-l-2 border-secondary group/card hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 text-secondary">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h3 className="font-headline text-lg font-bold uppercase tracking-widest italic">
                        CHASSIS_DYNAMICS
                      </h3>
                    </div>
                    <Tooltip content="Structural integrity and mechanical grip parameters.">
                      <Info className="w-3 h-3 text-outline opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    </Tooltip>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center group/item">
                      <span className="text-[10px] text-outline font-bold uppercase">
                        CURB_WEIGHT
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {displayedWeight} KG
                      </span>
                    </div>

                    <div className="flex justify-between items-center group/item">
                      <span className="text-[10px] text-outline font-bold uppercase">
                        GRIP_COEFF
                      </span>
                      <span className="font-mono text-xs font-bold text-secondary">
                        {activeCar.performance.gripCoefficient}/100
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[8px] font-bold text-outline uppercase">
                          WEIGHT_REDUCTION_TARGET
                        </span>
                        <span className="text-[10px] font-mono font-bold text-secondary">
                          {Math.round(weightProgress)}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-full ${
                              i < weightProgress / 5
                                ? 'bg-secondary'
                                : 'bg-surface-container-highest'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-outline font-bold uppercase">
                        WHEELBASE
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {activeCar.specs.wheelbase} MM
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/20 p-4 mt-6">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest mb-4">
                  SELECTED_BUILD_PARTS
                </h3>
                <div className="space-y-2">
                  {selectedParts.length === 0 ? (
                    <p className="text-sm text-outline">No computed build yet.</p>
                  ) : (
                    selectedParts.map((part) => (
                      <div
                        key={part.part_id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-bold uppercase">
                          {part.name}
                        </span>
                        <span className="font-mono text-xs text-outline">
                          ${part.price_usd.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {analysis && (
                <div className="bg-surface-container-low p-6 border border-outline-variant/20">
                  <h3 className="font-headline text-sm font-bold uppercase tracking-widest mb-4">
                    BUILD_ANALYSIS_SUMMARY
                  </h3>

                  {explanation && (
                    <p className="text-sm text-outline leading-relaxed mb-4">
                      {explanation}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-container-high border border-outline-variant/20">
                      <div className="text-[9px] font-bold uppercase text-outline mb-2">
                        PROJECTED_COST
                      </div>
                      <div className="text-lg font-headline font-bold text-primary">
                        ${displayedCost.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 bg-surface-container-high border border-outline-variant/20">
                      <div className="text-[9px] font-bold uppercase text-outline mb-2">
                        OBJECTIVE_SCORE
                      </div>
                      <div className="text-lg font-headline font-bold text-secondary">
                        {analysis.score.objective_score.toFixed(1)}
                      </div>
                    </div>

                    <div className="p-4 bg-surface-container-high border border-outline-variant/20">
                      <div className="text-[9px] font-bold uppercase text-outline mb-2">
                        RELIABILITY_SCORE
                      </div>
                      <div className="text-lg font-headline font-bold text-white">
                        {reliabilityScore !== null
                          ? reliabilityScore.toFixed(1)
                          : '--'}
                      </div>
                    </div>
                  </div>

                  {warnings.length > 0 && (
                    <div className="mt-6">
                      <div className="text-[9px] font-bold uppercase text-outline mb-3">
                        WARNINGS
                      </div>
                      <div className="space-y-2">
                        {warnings.map((warning) => (
                          <p key={warning} className="text-sm text-outline">
                            {warning}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-surface-container-low p-8 border border-outline-variant/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Target className="w-32 h-32" />
                </div>

                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Target className="w-6 h-6 text-primary" />
                  <h2 className="font-headline text-2xl font-black uppercase tracking-widest italic">
                    MISSION_PARAMETERS
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] text-outline font-bold uppercase tracking-[0.2em]">
                      TARGET_OUTPUT
                    </label>
                    <div className="flex items-end gap-3 border-b border-outline-variant/30 pb-2 focus-within:border-primary transition-colors">
                      <input
                        type="number"
                        value={goals.targetHp}
                        onChange={(e) =>
                          onUpdateGoals({
                            ...goals,
                            targetHp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-transparent text-3xl font-headline font-black italic w-full outline-none tabular-nums text-primary"
                      />
                      <span className="text-xs font-bold text-outline mb-1">
                        BHP
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] text-outline font-bold uppercase tracking-[0.2em]">
                      TARGET_WEIGHT
                    </label>
                    <div className="flex items-end gap-3 border-b border-outline-variant/30 pb-2 focus-within:border-secondary transition-colors">
                      <input
                        type="number"
                        value={goals.targetWeight}
                        onChange={(e) =>
                          onUpdateGoals({
                            ...goals,
                            targetWeight: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-transparent text-3xl font-headline font-black italic w-full outline-none tabular-nums text-secondary"
                      />
                      <span className="text-xs font-bold text-outline mb-1">
                        KG
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] text-outline font-bold uppercase tracking-[0.2em]">
                      MAX_BUDGET
                    </label>
                    <div className="flex items-end gap-3 border-b border-outline-variant/30 pb-2 focus-within:border-white transition-colors">
                      <span className="text-2xl font-bold text-outline mb-1">
                        $
                      </span>
                      <input
                        type="number"
                        value={goals.budget}
                        onChange={(e) =>
                          onUpdateGoals({
                            ...goals,
                            budget: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-transparent text-3xl font-headline font-black italic w-full outline-none tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <label className="text-[10px] text-outline font-bold uppercase tracking-[0.2em]">
                    ACTIVITY_PROFILE_SELECTION
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {['TIME_ATTACK', 'DRAG_RACING', 'CIRCUIT_RACING', 'DRIFT', 'STREET'].map(
                      (profile) => (
                        <button
                          key={profile}
                          onClick={() =>
                            onUpdateGoals({
                              ...goals,
                              activity: profile as any,
                            })
                          }
                          className={`px-4 py-3 text-[10px] font-black border transition-all uppercase tracking-widest italic
                          ${
                            goals.activity === profile
                              ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(112,151,117,0.3)]'
                              : 'bg-surface-container-high border-outline-variant/20 text-outline hover:border-primary/50 hover:text-on-surface'
                          }`}
                        >
                          {profile.replace('_', ' ')}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-surface-container-low p-6 border border-outline-variant/20">
                    <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-primary mb-6 italic">
                      TECHNICAL_SPECIFICATIONS
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'PLATFORM', value: activeCar.platform },
                        { label: 'VERSION', value: `v${activeCar.version}` },
                        { label: 'ENGINE', value: activeCar.specs.engine },
                        {
                          label: 'DISPLACEMENT',
                          value: `${activeCar.specs.displacement}L`,
                        },
                        { label: 'WEIGHT', value: `${displayedWeight} KG` },
                        {
                          label: 'WHEELBASE',
                          value: `${activeCar.specs.wheelbase} MM`,
                        },
                        { label: 'POWER_INDEX', value: activeCar.performance.powerIndex },
                        {
                          label: 'GRIP_INDEX',
                          value: activeCar.performance.gripCoefficient,
                        },
                      ].map((spec) => (
                        <div
                          key={spec.label}
                          className="flex justify-between items-center border-b border-outline-variant/10 pb-2"
                        >
                          <span className="text-[9px] text-outline font-bold uppercase">
                            {spec.label}
                          </span>
                          <span className="font-mono text-xs font-bold">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-6 border border-outline-variant/20">
                    <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-secondary mb-6 italic">
                      PERFORMANCE_METRICS
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                          <span className="text-outline">AERO_BALANCE</span>
                          <span className="text-secondary">
                            {activeCar.performance.downforceBalance}% REAR
                          </span>
                        </div>
                        <div className="h-1.5 bg-surface-container-highest flex">
                          <div
                            className="h-full bg-secondary"
                            style={{ width: `${activeCar.performance.downforceBalance}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                          <span className="text-outline">
                            MECHANICAL_EFFICIENCY
                          </span>
                          <span className="text-secondary">94.2%</span>
                        </div>
                        <div className="h-1.5 bg-surface-container-highest">
                          <div className="h-full bg-secondary w-[94.2%]" />
                        </div>
                      </div>

                      {analysis && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-bold uppercase">
                              <span className="text-outline">PROJECTED_HP</span>
                              <span className="text-primary">{displayedHp}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-bold uppercase">
                              <span className="text-outline">PROJECTED_COST</span>
                              <span className="text-primary">
                                ${displayedCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-surface-container-low p-6 border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-white italic">
                        INSTALLED_COMPONENTS
                      </h3>
                      <span className="text-[10px] font-mono text-outline">
                        {profileParts.length} UNITS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profileParts.length > 0 ? (
                        profileParts.map((part) => (
                          <div
                            key={part.id}
                            className="p-4 bg-surface-container-high border border-outline-variant/10 flex justify-between items-center group"
                          >
                            <div>
                              <div className="text-[10px] font-bold uppercase text-primary mb-1">
                                {part.brand}
                              </div>
                              <div className="text-sm font-headline font-bold uppercase italic">
                                {part.name}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-mono font-bold text-outline">
                                ${part.price.toLocaleString()}
                              </div>
                              <div className="text-[8px] font-bold text-secondary uppercase">
                                VERIFIED
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-12 text-center border border-dashed border-outline-variant/30">
                          <span className="text-[10px] text-outline font-bold uppercase tracking-widest">
                            NO_MODIFICATIONS_INSTALLED
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-6 border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-outline italic">
                        WATCHLIST_&_PLANNED_PARTS
                      </h3>
                      <span className="text-[10px] font-mono text-outline">
                        TRACKING_ACTIVE
                      </span>
                    </div>

                    <div className="space-y-3">
                      {watchlist.length > 0 ? (
                        watchlist.slice(0, 4).map((item, i) => (
                          <div
                            key={i}
                            className="p-4 bg-surface-container-high/50 border border-outline-variant/10 flex items-center justify-between hover:bg-surface-container-high transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-1 h-8 bg-outline-variant/30" />
                              <div>
                                <div className="text-xs font-headline font-bold uppercase italic">
                                  {item.name}
                                </div>
                                <div className="text-[9px] font-mono text-primary font-bold">
                                  {item.brand}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-headline font-bold italic">
                                ${item.currentPrice.toLocaleString()}
                              </div>
                              <div className="text-[8px] font-bold uppercase text-primary">
                                TRACKING
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center border border-dashed border-outline-variant/30">
                          <span className="text-[10px] text-outline font-bold uppercase tracking-widest">
                            WATCHLIST_EMPTY
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 z-10 border-t border-outline-variant/10 bg-surface-container-low/40 backdrop-blur-md">
          <div className="flex flex-col">
            <label className="text-[9px] text-outline font-bold tracking-widest mb-1 uppercase">
              SYSTEM_KERNEL
            </label>
            <div className="text-sm font-headline font-bold text-primary italic">
              REDLINE_OS_v1.0.4
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] text-outline font-bold tracking-widest mb-1 uppercase">
              BUILD_MODE
            </label>
            <div className="text-sm font-headline font-bold text-white tabular-nums">
              {analysis ? 'COMPUTED' : 'MANUAL'}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] text-outline font-bold tracking-widest mb-1 uppercase">
              SYNC_STATUS
            </label>
            <div className="text-sm font-headline font-bold text-secondary italic">
              ENCRYPTED_LINK
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] text-outline font-bold tracking-widest mb-1 uppercase">
              CORE_TEMP
            </label>
            <div className="text-sm font-headline font-bold text-white tabular-nums italic">
              42.4°C
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};