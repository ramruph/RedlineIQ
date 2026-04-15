import React from 'react';
import { ShieldAlert, Activity, Thermometer, Droplets, Zap } from 'lucide-react';
import type { BuildAnalysisResult } from '../types/api';

interface ReliabilityProps {
  analysis?: BuildAnalysisResult | null;
}


const components = [
  { name: 'TURBOCHARGER_UNIT_A', wear: 12, temp: 84, status: 'OPTIMAL' },
  { name: 'PISTON_ASSEMBLY_V8', wear: 45, temp: 92, status: 'MONITOR' },
  { name: 'TRANSMISSION_GEARSET', wear: 28, temp: 78, status: 'OPTIMAL' },
  { name: 'BRAKE_PADS_CERAMIC', wear: 62, temp: 420, status: 'WARNING' },
  { name: 'FUEL_INJECTORS_S3', wear: 8, temp: 45, status: 'OPTIMAL' },
  { name: 'COOLING_RADIATOR', wear: 15, temp: 88, status: 'OPTIMAL' },
];

export const Reliability: React.FC<ReliabilityProps> = ({ analysis }) => {
  const reliabilityScore = analysis?.score.reliability_score ?? 28.3;
  const warnings = analysis?.warnings ?? [];
  return (
    <div className="p-8 h-full overflow-y-auto hide-scrollbar bg-surface-dim">
      <div className="grid grid-cols-12 gap-8">
        {/* Header */}
        <div className="col-span-12 flex justify-between items-end border-b border-outline-variant/20 pb-4">
          <div>
            <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.3em]">COMPONENT_INTEGRITY // ANALYSIS</span>
            <h1 className="font-headline text-4xl font-black tracking-tighter italic uppercase">RELIABILITY_CORE // MONITOR</h1>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-surface-container-high border border-outline-variant/30">
            <span className="text-[9px] text-outline uppercase block">RELIABILITY_SCORE</span>
            <span className="font-headline text-xl font-black text-secondary italic">
              {reliabilityScore.toFixed(1)}
            </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map((comp, i) => (
            <div key={i} className="bg-surface-container-low p-6 border border-outline-variant/10 relative group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline text-lg font-bold tracking-tight">{comp.name}</h3>
                  <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 mt-1 inline-block ${
                    comp.status === 'OPTIMAL' ? 'bg-secondary/20 text-secondary' : 
                    comp.status === 'WARNING' ? 'bg-primary/20 text-primary' : 'bg-on-surface/20 text-on-surface'
                  }`}>
                    {comp.status}
                  </span>
                </div>
                <Activity className={`w-5 h-5 ${comp.status === 'WARNING' ? 'text-primary animate-pulse' : 'text-outline'}`} />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-outline mb-1">
                    <span>WEAR_LEVEL</span>
                    <span>{comp.wear}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest w-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${comp.wear > 50 ? 'bg-primary' : 'bg-secondary'}`} 
                      style={{ width: `${comp.wear}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-3 h-3 text-outline" />
                    <span className="font-mono text-[10px]">{comp.temp}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-outline" />
                    <span className="font-mono text-[10px]">NOMINAL</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Failure Probability Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-high p-6 border-l-4 border-primary shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h3 className="font-headline text-xl font-bold uppercase tracking-tight">FAILURE_PROBABILITY</h3>
            </div>
            
            <div className="space-y-6">
              <div className="relative h-48 flex items-center justify-center">
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(224,30,34,0.1)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#ffb4ab" 
                    strokeWidth="8" 
                    strokeDasharray="282.7" 
                    strokeDashoffset="240" 
                    className="animate-pulse"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-4xl font-black text-primary italic">15%</span>
                  <span className="text-[9px] text-outline font-bold uppercase">TOTAL_RISK</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-outline uppercase">CRITICAL_FAILURE_EST</span>
                  <span className="text-primary">LOW</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-outline uppercase">MTBF_PROJECTION</span>
                  <span className="text-white">42.5 HRS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 border border-outline-variant/10">
            <span className="font-label text-[10px] text-outline font-black uppercase tracking-widest block mb-4">MAINTENANCE_SCHEDULE</span>
            <div className="space-y-4">
              <div className="p-3 bg-surface-container-high border-l-2 border-secondary">
                <p className="text-[10px] font-bold uppercase">OIL_CHANGE_REQUIRED</p>
                <p className="text-[9px] text-outline mt-1 font-mono">T-MINUS 4.2 HRS</p>
              </div>
              <div className="p-3 bg-surface-container-high border-l-2 border-outline">
                <p className="text-[10px] font-bold uppercase">TIRE_ROTATION_SYNC</p>
                <p className="text-[9px] text-outline mt-1 font-mono">T-MINUS 12.0 HRS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
