import React from 'react';
import { Wind, ArrowDown, ArrowUp, Zap, Sparkles } from 'lucide-react';
import { BuildGoals } from '../types';

interface AeroProps {
  goals: BuildGoals;
}

export const Aero: React.FC<AeroProps> = ({ goals }) => {
  const isRecommended = (type: string) => {
    if (goals.activity === 'TIME_ATTACK' && (type === 'FRONT' || type === 'REAR')) return true;
    if (goals.activity === 'DRAG_RACING' && type === 'UNDERBODY') return true;
    if (goals.activity === 'CIRCUIT_RACING' && type === 'SIDES') return true;
    return false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full overflow-y-auto md:overflow-hidden p-4 md:p-8 hide-scrollbar">
      <div className="col-span-1 md:col-span-8 flex flex-col gap-6 overflow-hidden">
        <div className="flex justify-between items-end border-b-2 border-primary-container pb-2">
          <div className="flex flex-col">
            <span className="font-headline text-3xl font-black uppercase tracking-tighter">AERO_DYNAMICS</span>
            <span className="font-headline text-[10px] tracking-widest text-primary font-bold">WIND_TUNNEL_SIMULATION_V2.4</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-4 hide-scrollbar pb-20">
          {/* Front Wing */}
          <div className={`bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden ${isRecommended('FRONT') ? 'ring-1 ring-primary/30' : ''}`}>
            {isRecommended('FRONT') && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
              </div>
            )}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Wind className="w-24 h-24" />
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">FRONT_SPLITTER_V4</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">DOWNFORCE</span>
                <span className="font-mono text-primary font-bold">+124 KGF</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">DRAG_COEFF</span>
                <span className="font-mono text-secondary font-bold">0.024</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[85%] h-full bg-primary shadow-[0_0_10px_rgba(224,30,34,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-primary text-primary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all">
              CALIBRATE_ANGLE
            </button>
          </div>

          {/* Rear Wing */}
          <div className={`bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden ${isRecommended('REAR') ? 'ring-1 ring-primary/30' : ''}`}>
            {isRecommended('REAR') && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
              </div>
            )}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <ArrowDown className="w-24 h-24" />
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">REAR_DIFFUSER_GT</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">DOWNFORCE</span>
                <span className="font-mono text-primary font-bold">+342 KGF</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">DRAG_COEFF</span>
                <span className="font-mono text-secondary font-bold">0.082</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[92%] h-full bg-primary shadow-[0_0_10px_rgba(224,30,34,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-primary text-primary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all">
              ADJUST_FLAPS
            </button>
          </div>

          {/* Side Skirts */}
          <div className={`bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden ${isRecommended('SIDES') ? 'ring-1 ring-primary/30' : ''}`}>
            {isRecommended('SIDES') && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
              </div>
            )}
            <h3 className="font-headline text-xl font-bold mb-4">VORTEX_GENERATORS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">STABILITY</span>
                <span className="font-mono text-primary font-bold">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">AIR_FLOW</span>
                <span className="font-mono text-secondary font-bold">LAMINAR</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[74%] h-full bg-secondary shadow-[0_0_10px_rgba(1,81,255,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-secondary text-secondary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-secondary hover:text-white transition-all">
              OPTIMIZE_FLOW
            </button>
          </div>

          {/* Underbody */}
          <div className={`bg-surface-container-low p-6 border border-outline-variant/30 relative group overflow-hidden ${isRecommended('UNDERBODY') ? 'ring-1 ring-primary/30' : ''}`}>
            {isRecommended('UNDERBODY') && (
              <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
              </div>
            )}
            <h3 className="font-headline text-xl font-bold mb-4">GROUND_EFFECT_PANELS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">SUCTION</span>
                <span className="font-mono text-primary font-bold">HIGH</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase">PRESSURE</span>
                <span className="font-mono text-secondary font-bold">LOW_ZONE</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4">
                <div className="w-[88%] h-full bg-primary shadow-[0_0_10px_rgba(224,30,34,0.5)]"></div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 border border-primary text-primary font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all">
              SEAL_CHECK
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 flex flex-col h-full border-l border-primary-container/20">
          <h2 className="font-headline text-2xl font-black tracking-tighter italic text-primary mb-8">AERO_BALANCE</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-48 h-80 border-2 border-outline-variant/30 relative flex items-center justify-center">
              <div className="absolute top-0 w-full h-1/2 bg-primary/10 flex items-center justify-center font-mono text-[10px] text-primary font-bold">FRONT: 42%</div>
              <div className="absolute bottom-0 w-full h-1/2 bg-secondary/10 flex items-center justify-center font-mono text-[10px] text-secondary font-bold">REAR: 58%</div>
              <div className="w-1 h-full bg-outline-variant/20 absolute left-1/2 -translate-x-1/2"></div>
              <div className="w-full h-1 bg-outline-variant/20 absolute top-1/2 -translate-y-1/2"></div>
              <Wind className="w-12 h-12 text-white/20 animate-pulse" />
            </div>
            <div className="mt-8 text-center">
              <span className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase block mb-2">TOTAL_DOWNFORCE</span>
              <span className="text-5xl font-black font-headline italic">842 <span className="text-xl text-primary">KGF</span></span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-surface-container-highest/50 border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">DRS_STATUS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg font-bold text-secondary">AVAILABLE</span>
                <span className="text-[10px] font-mono text-outline">ACT_TIME: 0.12S</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
