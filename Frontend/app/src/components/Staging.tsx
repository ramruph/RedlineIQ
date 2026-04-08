import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertTriangle, Play, Settings, ShieldAlert, Cpu, Database } from 'lucide-react';
import { CARS } from '../constants';

const checklistItems = [
  { id: 1, label: 'ENGINE_MAP_CALIBRATION', status: 'COMPLETE', icon: Cpu },
  { id: 2, label: 'TIRE_PRESSURE_SYNC', status: 'PENDING', icon: Circle },
  { id: 3, label: 'AERO_BALANCE_VERIFICATION', status: 'COMPLETE', icon: CheckCircle2 },
  { id: 4, label: 'DATA_LOGGING_INITIALIZATION', status: 'COMPLETE', icon: Database },
  { id: 5, label: 'FUEL_LOAD_VERIFICATION', status: 'WARNING', icon: AlertTriangle },
  { id: 6, label: 'BRAKE_SYSTEM_PURGE', status: 'PENDING', icon: Circle },
  { id: 7, label: 'TELEMETRY_UPLINK_STABILITY', status: 'COMPLETE', icon: CheckCircle2 },
  { id: 8, label: 'SAFETY_SYSTEMS_ARMED', status: 'COMPLETE', icon: ShieldAlert },
];

export const Staging: React.FC = () => {
  const activeCar = CARS.find(c => c.active) || CARS[0];
  const [isIgnitionStarted, setIsIgnitionStarted] = useState(false);

  return (
    <div className="p-8 h-full overflow-y-auto hide-scrollbar bg-surface-dim">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Checklist */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
            <div>
              <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.3em]">PRE_RACE_STAGING // SEQUENCE_01</span>
              <h1 className="font-headline text-4xl font-black tracking-tighter italic uppercase">MISSION_CONTROL // CHECKLIST</h1>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container-high text-[10px] font-bold text-outline border border-outline-variant/30">STATUS: READY_FOR_IGNITION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 bg-surface-container-low border-l-4 flex items-center justify-between transition-all hover:bg-surface-container-high cursor-pointer ${
                  item.status === 'COMPLETE' ? 'border-secondary' : 
                  item.status === 'WARNING' ? 'border-primary' : 'border-outline-variant'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`w-5 h-5 ${
                    item.status === 'COMPLETE' ? 'text-secondary' : 
                    item.status === 'WARNING' ? 'text-primary' : 'text-outline'
                  }`} />
                  <span className="font-headline text-sm font-bold tracking-tight">{item.label}</span>
                </div>
                <span className={`font-mono text-[9px] font-black tracking-widest ${
                  item.status === 'COMPLETE' ? 'text-secondary' : 
                  item.status === 'WARNING' ? 'text-primary' : 'text-outline'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* System Logs (Staging Specific) */}
          <div className="bg-surface-container-low p-6 border border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label text-[10px] text-outline font-black uppercase tracking-widest">STAGING_SEQUENCE_LOGS</span>
              <Settings className="w-3 h-3 text-outline" />
            </div>
            <div className="h-48 overflow-y-auto font-mono text-[10px] space-y-2 text-outline-variant leading-relaxed">
              <div>[03:14:37] INITIALIZING_STAGING_PROTOCOL_01...</div>
              <div>[03:14:38] CONNECTING_TO_VEHICLE_ECU... <span className="text-secondary">SUCCESS</span></div>
              <div>[03:14:39] FETCHING_MAPPINGS_FROM_CLOUD... <span className="text-secondary">SUCCESS</span></div>
              <div>[03:14:40] VERIFYING_TIRE_SENSORS... <span className="text-primary">WARNING: LOW_PRESSURE_FL</span></div>
              <div>[03:14:41] CALIBRATING_AERO_FLAPS... <span className="text-secondary">SUCCESS</span></div>
              <div>[03:14:42] READY_FOR_IGNITION_SEQUENCE...</div>
            </div>
          </div>
        </div>

        {/* Right Column: Ignition & Status */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-surface-container-high p-8 border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 text-center mb-8">
              <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.4em] block mb-2">CRITICAL_ACTION</span>
              <h2 className="font-headline text-3xl font-black tracking-tighter italic">IGNITION_INITIATION</h2>
            </div>

            <button 
              onClick={() => setIsIgnitionStarted(!isIgnitionStarted)}
              className={`w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500 relative ${
                isIgnitionStarted 
                ? 'bg-primary border-primary shadow-[0_0_60px_rgba(224,30,34,0.6)] animate-pulse' 
                : 'bg-surface-container-highest border-outline-variant/30 hover:border-primary/50'
              }`}
            >
              <Play className={`w-16 h-16 transition-all ${isIgnitionStarted ? 'text-white scale-110' : 'text-outline group-hover:text-primary'}`} fill={isIgnitionStarted ? "currentColor" : "none"} />
              <span className={`font-headline font-black text-xl mt-4 tracking-widest ${isIgnitionStarted ? 'text-white' : 'text-outline'}`}>
                {isIgnitionStarted ? 'ACTIVE' : 'START'}
              </span>
              
              {/* Circular Progress (Simulated) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="50%" cy="50%" r="48%" 
                  fill="none" 
                  stroke="rgba(224,30,34,0.2)" 
                  strokeWidth="4" 
                />
                <circle 
                  cx="50%" cy="50%" r="48%" 
                  fill="none" 
                  stroke="#ffb4ab" 
                  strokeWidth="4" 
                  strokeDasharray="301.59" 
                  strokeDashoffset={isIgnitionStarted ? "0" : "301.59"}
                  className="transition-all duration-[2000ms] ease-out"
                />
              </svg>
            </button>

            <div className="mt-12 w-full space-y-4">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-outline uppercase">SEQUENCE_STATUS</span>
                <span className={isIgnitionStarted ? 'text-primary font-bold' : 'text-white'}>
                  {isIgnitionStarted ? 'ENGAGED' : 'STANDBY'}
                </span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-outline uppercase">EST_LAUNCH_TIME</span>
                <span className="text-white">00:04:12</span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-outline uppercase">WEATHER_CONDITIONS</span>
                <span className="text-secondary">DRY // 24°C</span>
              </div>
            </div>
          </div>

          {/* Vehicle Profile Summary */}
          <div className="bg-surface-container-low p-6 border border-outline-variant/10">
            <span className="font-label text-[10px] text-outline font-black uppercase tracking-widest block mb-4">VEHICLE_PROFILE // ACTIVE</span>
            <div className="flex gap-4 items-center">
              <div className="w-24 h-16 bg-surface-container-highest overflow-hidden">
                <img className="w-full h-full object-cover grayscale opacity-60" src={activeCar.image} alt={activeCar.name} />
              </div>
              <div>
                <h4 className="font-headline text-lg font-bold uppercase">{activeCar.name}</h4>
                <p className="text-[10px] text-outline font-mono">{activeCar.specs.engine} // {activeCar.specs.displacement}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
