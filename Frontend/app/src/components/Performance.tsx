import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { CARS } from '../constants';
import { Gauge, Zap, Wind, ShieldCheck, Cpu } from 'lucide-react';

const performanceData = [
  { rpm: 1000, torque: 200, power: 50 },
  { rpm: 2000, torque: 350, power: 120 },
  { rpm: 3000, torque: 480, power: 210 },
  { rpm: 4000, torque: 550, power: 320 },
  { rpm: 5000, torque: 580, power: 450 },
  { rpm: 6000, torque: 560, power: 580 },
  { rpm: 7000, torque: 520, power: 690 },
  { rpm: 8000, torque: 450, power: 742 },
  { rpm: 9000, torque: 380, power: 720 },
];

export const Performance: React.FC = () => {
  const activeCar = CARS.find(c => c.active) || CARS[0];

  return (
    <div className="p-8 h-full overflow-y-auto hide-scrollbar bg-surface-dim">
      <div className="grid grid-cols-12 gap-6">
        {/* Header Section */}
        <div className="col-span-12 flex justify-between items-end border-b border-outline-variant/20 pb-4">
          <div>
            <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.3em]">PERFORMANCE_ANALYSIS // V8_CORE</span>
            <h1 className="font-headline text-4xl font-black tracking-tighter italic uppercase">{activeCar.name} // DYNO_RESULTS</h1>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-surface-container-high border border-outline-variant/30">
              <span className="text-[9px] text-outline uppercase block">PEAK_POWER</span>
              <span className="font-headline text-xl font-black text-primary italic">{activeCar.specs.hp} HP</span>
            </div>
            <div className="px-4 py-2 bg-surface-container-high border border-outline-variant/30">
              <span className="text-[9px] text-outline uppercase block">MAX_TORQUE</span>
              <span className="font-headline text-xl font-black text-secondary italic">580 LB-FT</span>
            </div>
          </div>
        </div>

        {/* Main Dyno Chart */}
        <div className="col-span-8 bg-surface-container-low p-6 border border-outline-variant/10 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline text-lg font-bold uppercase tracking-tight">DYNO_CURVE_VISUALIZATION</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary"></div>
                <span className="text-[9px] font-black uppercase text-outline">HORSEPOWER (HP)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary"></div>
                <span className="text-[9px] font-black uppercase text-outline">TORQUE (LB-FT)</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb4ab" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffb4ab" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTorque" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b7c4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#b7c4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="rpm" 
                  stroke="#666" 
                  fontSize={10} 
                  tickFormatter={(val) => `${val/1000}K`}
                  label={{ value: 'ENGINE_RPM', position: 'insideBottom', offset: -5, fontSize: 9, fill: '#888' }}
                />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid #444', fontSize: '10px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="power" stroke="#ffb4ab" strokeWidth={3} fillOpacity={1} fill="url(#colorPower)" />
                <Area type="monotone" dataKey="torque" stroke="#b7c4ff" strokeWidth={3} fillOpacity={1} fill="url(#colorTorque)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency & Stress Metrics */}
        <div className="col-span-4 space-y-6">
          <div className="bg-surface-container-high p-6 border-l-4 border-primary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[9px] text-outline font-black uppercase tracking-widest">THERMAL_EFFICIENCY</span>
                <h4 className="font-headline text-3xl font-black italic">94.2%</h4>
              </div>
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="h-1 bg-surface-container-highest w-full mb-2">
              <div className="h-full bg-primary" style={{ width: '94.2%' }}></div>
            </div>
            <p className="text-[9px] text-outline uppercase">OPTIMAL_OPERATING_TEMP: 92°C - 105°C</p>
          </div>

          <div className="bg-surface-container-high p-6 border-l-4 border-secondary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[9px] text-outline font-black uppercase tracking-widest">AERO_STABILITY</span>
                <h4 className="font-headline text-3xl font-black italic">0.28 CD</h4>
              </div>
              <Wind className="w-6 h-6 text-secondary" />
            </div>
            <div className="h-1 bg-surface-container-highest w-full mb-2">
              <div className="h-full bg-secondary" style={{ width: '85%' }}></div>
            </div>
            <p className="text-[9px] text-outline uppercase">DRAG_COEFFICIENT_TARGET: 0.26 CD</p>
          </div>

          <div className="bg-surface-container-high p-6 border-l-4 border-on-surface">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[9px] text-outline font-black uppercase tracking-widest">SYSTEM_INTEGRITY</span>
                <h4 className="font-headline text-3xl font-black italic">NOMINAL</h4>
              </div>
              <ShieldCheck className="w-6 h-6 text-on-surface" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 bg-surface-dim border border-outline-variant/10">
                <span className="text-[8px] text-outline uppercase block">CPU_LOAD</span>
                <span className="text-xs font-bold font-mono">12%</span>
              </div>
              <div className="p-2 bg-surface-dim border border-outline-variant/10">
                <span className="text-[8px] text-outline uppercase block">MEM_USAGE</span>
                <span className="text-xs font-bold font-mono">4.2GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Charts Section */}
        <div className="col-span-12 grid grid-cols-3 gap-6 mt-4 pb-20">
          <div className="bg-surface-container-low p-4 border border-outline-variant/10">
            <span className="font-label text-[10px] text-outline font-black uppercase tracking-widest block mb-4">G-FORCE_DISTRIBUTION</span>
            <div className="h-40 flex items-center justify-center relative">
              <div className="absolute inset-0 border border-outline-variant/20 rounded-full"></div>
              <div className="absolute inset-[25%] border border-outline-variant/20 rounded-full"></div>
              <div className="absolute inset-[50%] border border-outline-variant/20 rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#ffb4ab]"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] text-outline">1.5G</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-outline">-1.5G</div>
            </div>
          </div>

          <div className="bg-surface-container-low p-4 border border-outline-variant/10">
            <span className="font-label text-[10px] text-outline font-black uppercase tracking-widest block mb-4">FUEL_FLOW_RATE</span>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="power" stroke="#ffb4ab" strokeWidth={2} dot={false} />
                  <CartesianGrid stroke="#333" vertical={false} />
                  <XAxis hide />
                  <YAxis hide />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-container-low p-4 border border-outline-variant/10">
            <span className="font-label text-[10px] text-outline font-black uppercase tracking-widest block mb-4">TIRE_WEAR_PROJECTION</span>
            <div className="space-y-4 mt-2">
              {['FL', 'FR', 'RL', 'RR'].map((tire) => (
                <div key={tire} className="flex items-center gap-4">
                  <span className="font-mono text-[10px] w-6">{tire}</span>
                  <div className="flex-1 h-2 bg-surface-container-highest">
                    <div className="h-full bg-secondary" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
