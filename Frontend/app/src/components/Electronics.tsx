import React from 'react';
import { Cpu, Activity, Zap, Terminal, Settings, Sparkles } from 'lucide-react';
import { BuildGoals } from '../types';

interface ElectronicsProps {
  goals: BuildGoals;
}

export const Electronics: React.FC<ElectronicsProps> = ({ goals }) => {
  const isRecommended = (type: string) => {
    if (goals.activity === 'DRAG_RACING' && type === 'ECU') return true;
    if (goals.activity === 'TIME_ATTACK' && type === 'TELEMETRY') return true;
    if (goals.activity === 'DRIFT' && type === 'TC') return true;
    return false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full overflow-y-auto md:overflow-hidden p-4 md:p-8 hide-scrollbar">
      <div className="col-span-1 md:col-span-8 flex flex-col gap-6 overflow-hidden">
        <div className="flex justify-between items-end border-b-2 border-primary-container pb-2">
          <div className="flex flex-col">
            <span className="font-headline text-3xl font-black uppercase tracking-tighter">ELECTRONIC_CONTROL</span>
            <span className="font-headline text-[10px] tracking-widest text-primary font-bold">ECU_MAPPING_V9.2_BETA</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-4 hide-scrollbar pb-20">
          {/* ECU Mapping */}
          <div className={`bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden ${isRecommended('ECU') ? 'ring-1 ring-primary/30' : ''}`}>
            {isRecommended('ECU') && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
              </div>
            )}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Cpu className="w-24 h-24" />
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">ECU_MAP_SELECTOR</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">ACTIVE_MAP</span>
                <span className="font-mono text-primary font-bold">QUALIFYING_V2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">FUEL_MAP</span>
                <span className="font-mono text-secondary font-bold">RICH_BURN</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[96%] h-full bg-primary shadow-[0_0_10px_rgba(224,30,34,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-primary text-primary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all">
              FLASH_ECU
            </button>
          </div>

          {/* Traction Control */}
          <div className={`bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden ${isRecommended('TC') ? 'ring-1 ring-primary/30' : ''}`}>
            {isRecommended('TC') && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
              </div>
            )}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Activity className="w-24 h-24" />
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">TRACTION_CONTROL</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">SENSITIVITY</span>
                <span className="font-mono text-primary font-bold">LEVEL_4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">SLIP_THRESHOLD</span>
                <span className="font-mono text-secondary font-bold">3.2%</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[42%] h-full bg-secondary shadow-[0_0_10px_rgba(1,81,255,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-secondary text-secondary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-secondary hover:text-white transition-all">
              ADJUST_TC
            </button>
          </div>

          {/* Telemetry Module */}
          <div className={`bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden ${isRecommended('TELEMETRY') ? 'ring-1 ring-primary/30' : ''}`}>
            {isRecommended('TELEMETRY') && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
              </div>
            )}
            <h3 className="font-headline text-xl font-bold mb-4">DATA_LOGGING</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">SAMPLE_RATE</span>
                <span className="font-mono text-primary font-bold">1000 HZ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">CHANNELS</span>
                <span className="font-mono text-secondary font-bold">128_ACTIVE</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[88%] h-full bg-primary shadow-[0_0_10px_rgba(224,30,34,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-primary text-primary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all">
              SYNC_DATA
            </button>
          </div>

          {/* Power Management */}
          <div className="bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden">
            <h3 className="font-headline text-xl font-bold mb-4">POWER_DISTRIBUTION</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">BATTERY_V</span>
                <span className="font-mono text-primary font-bold">14.2V</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">LOAD</span>
                <span className="font-mono text-secondary font-bold">OPTIMAL</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[76%] h-full bg-secondary shadow-[0_0_10px_rgba(1,81,255,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-secondary text-secondary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-secondary hover:text-white transition-all">
              POWER_CHECK
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 flex flex-col h-full border-l border-primary-container/20">
          <h2 className="font-headline text-2xl font-black tracking-tighter italic text-primary mb-8">SYSTEM_LOAD</h2>
          
          <div className="flex-1 flex flex-col gap-6">
            {[
              { label: 'CPU_CORE_01', val: 42 },
              { label: 'CPU_CORE_02', val: 38 },
              { label: 'BUS_LOAD', val: 64 },
              { label: 'MEMORY_USAGE', val: 22 },
              { label: 'SENSOR_SYNC', val: 98 },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-outline uppercase">{stat.label}</span>
                  <span className="font-mono text-[10px] text-primary font-bold">{stat.val}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest">
                  <div className="h-full bg-primary" style={{ width: `${stat.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-surface-container-highest/50 border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">KERNEL_STATUS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg font-bold text-secondary">STABLE</span>
                <span className="text-[10px] font-mono text-outline">UPTIME: 42H</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
