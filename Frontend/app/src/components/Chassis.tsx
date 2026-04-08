import React from 'react';
import { CircleDot, Settings, Shield, Zap, ChevronDown, Sparkles } from 'lucide-react';
import { BuildGoals } from '../types';

interface ChassisProps {
  goals: BuildGoals;
}

export const Chassis: React.FC<ChassisProps> = ({ goals }) => {
  const [expandedModule, setExpandedModule] = React.useState<string | null>('SUSPENSION');

  const isRecommended = (moduleId: string) => {
    if (goals.activity === 'DRIFT' && moduleId === 'STEERING') return true;
    if (goals.activity === 'CIRCUIT_RACING' && moduleId === 'SUSPENSION') return true;
    if (goals.activity === 'DRAG_RACING' && moduleId === 'BRAKING') return true;
    return false;
  };

  const modules = [
    {
      id: 'SUSPENSION',
      title: 'SUSPENSION_SYSTEM',
      icon: CircleDot,
      stats: [
        { label: 'STIFFNESS', value: '1200 N/MM', color: 'primary' },
        { label: 'DAMPING', value: 'REBOUND_HIGH', color: 'secondary' },
      ],
      progress: 78,
      action: 'TUNE_DAMPERS',
      color: 'primary'
    },
    {
      id: 'BRAKING',
      title: 'BRAKE_CALIBRATION',
      icon: Shield,
      stats: [
        { label: 'BIAS', value: '54% FRONT', color: 'primary' },
        { label: 'PRESSURE', value: 'MAX_LOAD', color: 'secondary' },
      ],
      progress: 94,
      action: 'ADJUST_BIAS',
      color: 'primary'
    },
    {
      id: 'TIRES',
      title: 'TIRE_COMPOUND',
      icon: Zap,
      stats: [
        { label: 'GRIP_LEVEL', value: 'ULTRA_SOFT', color: 'primary' },
        { label: 'TEMP_RANGE', value: '85-110°C', color: 'secondary' },
      ],
      progress: 62,
      action: 'SELECT_COMPOUND',
      color: 'secondary'
    },
    {
      id: 'STEERING',
      title: 'STEERING_GEOMETRY',
      icon: Settings,
      stats: [
        { label: 'TOE_IN', value: '0.12°', color: 'primary' },
        { label: 'CAMBER', value: '-3.2°', color: 'secondary' },
      ],
      progress: 82,
      action: 'ALIGN_SYSTEM',
      color: 'primary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full overflow-y-auto md:overflow-hidden p-4 md:p-8 hide-scrollbar">
      <div className="col-span-1 md:col-span-8 flex flex-col gap-6 overflow-hidden">
        <div className="flex justify-between items-end border-b-2 border-primary-container pb-2">
          <div className="flex flex-col">
            <span className="font-headline text-3xl font-black uppercase tracking-tighter">CHASSIS_INTEGRITY</span>
            <span className="font-headline text-[10px] tracking-widest text-primary font-bold">STRUCTURAL_ANALYSIS_V4.1</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 hide-scrollbar space-y-4 pb-20">
          {modules.map((mod) => (
            <div 
              key={mod.id}
              className={`bg-surface-container-low border border-outline-variant/30 transition-all duration-300 relative ${expandedModule === mod.id ? 'ring-1 ring-primary/50' : ''} ${isRecommended(mod.id) ? 'ring-1 ring-primary/30' : ''}`}
            >
              {isRecommended(mod.id) && (
                <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                  <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
                </div>
              )}
              <button 
                onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                className="w-full p-6 flex justify-between items-center hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-4">
                  <mod.icon className={`w-6 h-6 ${expandedModule === mod.id ? 'text-primary' : 'text-outline'}`} />
                  <h3 className="font-headline text-xl font-bold uppercase tracking-tight">{mod.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  {!expandedModule && (
                    <div className="flex gap-4">
                      {mod.stats.map((s, i) => (
                        <span key={i} className="font-mono text-[10px] font-bold text-outline">{s.value}</span>
                      ))}
                    </div>
                  )}
                  <ChevronDown className={`w-5 h-5 text-outline transition-transform duration-300 ${expandedModule === mod.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expandedModule === mod.id && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-8 pt-4 border-t border-outline-variant/20">
                    <div className="space-y-4">
                      {mod.stats.map((stat, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-outline uppercase">{stat.label}</span>
                          <span className={`font-mono font-bold ${stat.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>{stat.value}</span>
                        </div>
                      ))}
                      <div className="w-full h-1 bg-surface-container-highest mt-4">
                        <div 
                          className={`h-full bg-${mod.color} shadow-[0_0_10px_rgba(224,30,34,0.5)]`} 
                          style={{ width: `${mod.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end">
                      <button className={`w-full py-3 border border-${mod.color} text-${mod.color} font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-${mod.color} hover:text-white transition-all`}>
                        {mod.action}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 flex flex-col h-full border-l border-primary-container/20">
          <h2 className="font-headline text-2xl font-black tracking-tighter italic text-primary mb-8">CHASSIS_LOAD</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-64 h-64 border-2 border-outline-variant/30 rounded-full relative flex items-center justify-center">
              <div className="absolute top-0 w-1 h-8 bg-primary shadow-[0_0_10px_rgba(224,30,34,0.5)]"></div>
              <div className="absolute bottom-0 w-1 h-8 bg-outline-variant/30"></div>
              <div className="absolute left-0 h-1 w-8 bg-outline-variant/30"></div>
              <div className="absolute right-0 h-1 w-8 bg-outline-variant/30"></div>
              <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-primary rounded-full absolute top-1/4 left-1/3"></div>
            </div>
            <div className="mt-8 text-center">
              <span className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase block mb-2">LATERAL_G_MAX</span>
              <span className="text-5xl font-black font-headline italic">1.84 <span className="text-xl text-primary">G</span></span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-surface-container-highest/50 border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">ABS_CALIBRATION</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg font-bold text-secondary">MODE_7_RACE</span>
                <span className="text-[10px] font-mono text-outline">INT: 0.04S</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
