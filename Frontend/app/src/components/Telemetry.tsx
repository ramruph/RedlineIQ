import React, { useState, useEffect, useMemo } from 'react';
import { LOGS } from '../constants';
import { Activity, Router, Terminal, Settings, Radar, Gauge, Thermometer, Zap, ChevronDown, Timer, Map as MapIcon, TrendingUp, Weight } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Car } from '../types';

interface TelemetryData {
  time: string;
  rpm: number;
  throttle: number;
  brakeTemp: number;
}

interface Track {
  id: string;
  name: string;
  length: number; // meters
  baseTime: number; // seconds for a 300hp/1500kg car
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  image: string;
}

const TRACKS: Track[] = [
  { 
    id: 'NURBURGRING', 
    name: 'NÜRBURGRING_NORDSCHLEIFE', 
    length: 20832, 
    baseTime: 480, 
    difficulty: 'HARD',
    image: 'https://picsum.photos/seed/nurburgring/800/400?blur=2'
  },
  { 
    id: 'SUZUKA', 
    name: 'SUZUKA_CIRCUIT', 
    length: 5807, 
    baseTime: 135, 
    difficulty: 'MEDIUM',
    image: 'https://picsum.photos/seed/suzuka/800/400?blur=2'
  },
  { 
    id: 'TSUKUBA', 
    name: 'TSUKUBA_CIRCUIT', 
    length: 2045, 
    baseTime: 65, 
    difficulty: 'EASY',
    image: 'https://picsum.photos/seed/tsukuba/800/400?blur=2'
  }
];

interface TelemetryProps {
  activeCar: Car;
  garageCars: Car[];
}

export const Telemetry: React.FC<TelemetryProps> = ({ activeCar, garageCars }) => {
  const [selectedCarId, setSelectedCarId] = useState(activeCar.id);
  const [selectedTrackId, setSelectedTrackId] = useState(TRACKS[0].id);
  const [data, setData] = useState<TelemetryData[]>([]);

  const currentCar = useMemo(() => 
    garageCars.find(c => c.id === selectedCarId) || activeCar
  , [selectedCarId, garageCars, activeCar]);

  const currentTrack = useMemo(() => 
    TRACKS.find(t => t.id === selectedTrackId) || TRACKS[0]
  , [selectedTrackId]);

  // Predicted Lap Time Logic
  const predictionAnalysis = useMemo(() => {
    const { hp, weight } = currentCar.specs;
    const { gripCoefficient } = currentCar.performance;
    
    const baseWeight = 1500;
    const baseHP = 300;
    const baseGrip = 60;

    const weightFactor = Math.pow(weight / baseWeight, 0.4);
    const hpFactor = Math.pow(baseHP / hp, 0.5);
    const gripFactor = Math.pow(baseGrip / gripCoefficient, 0.3);

    const timeInSeconds = currentTrack.baseTime * weightFactor * hpFactor * gripFactor;
    
    const mins = Math.floor(timeInSeconds / 60);
    const secs = (timeInSeconds % 60).toFixed(3);

    return {
      time: `${mins}:${secs.padStart(6, '0')}`,
      impacts: {
        weight: ((weightFactor - 1) * 100).toFixed(1),
        power: ((hpFactor - 1) * 100).toFixed(1),
        grip: ((gripFactor - 1) * 100).toFixed(1)
      }
    };
  }, [currentCar, currentTrack]);

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto bg-surface-dim relative hide-scrollbar">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none scanline opacity-10 z-10 hidden md:block"></div>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col mb-8">
          <span className="font-headline text-4xl font-black uppercase tracking-tighter italic">PERFORMANCE_PREDICTION</span>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-0.5 w-12 bg-primary" />
            <span className="font-headline text-[10px] tracking-[0.3em] text-outline font-bold uppercase">
              HEURISTIC_LAP_SIMULATION // SPEC_BASED_ANALYSIS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-6 border border-outline-variant/20 space-y-6">
              <div>
                <label className="font-label text-[10px] text-secondary font-bold uppercase tracking-[0.2em] mb-2 block">SELECT_CHASSIS</label>
                <div className="relative">
                  <select 
                    value={selectedCarId}
                    onChange={(e) => setSelectedCarId(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 text-white font-headline font-bold text-sm p-3 pr-10 appearance-none cursor-pointer focus:ring-1 focus:ring-secondary outline-none uppercase italic"
                  >
                    {garageCars.map(car => (
                      <option key={car.id} value={car.id}>{car.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="font-label text-[10px] text-secondary font-black uppercase tracking-widest mb-2 block">TRACK_SELECTION</label>
                <div className="grid grid-cols-1 gap-2">
                  {TRACKS.map(track => (
                    <button
                      key={track.id}
                      onClick={() => setSelectedTrackId(track.id)}
                      className={`p-4 text-left border transition-all relative overflow-hidden group ${
                        selectedTrackId === track.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-outline-variant/20 bg-surface-container-high hover:border-primary/50'
                      }`}
                    >
                      <div className="relative z-10">
                        <p className="font-headline text-xs font-black italic uppercase">{track.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[8px] font-black px-1 py-0.5 rounded ${
                            track.difficulty === 'HARD' ? 'bg-primary text-white' : 
                            track.difficulty === 'MEDIUM' ? 'bg-secondary text-white' : 'bg-green-500 text-white'
                          }`}>
                            {track.difficulty}
                          </span>
                          <span className="text-[9px] text-outline font-mono uppercase">{track.length.toLocaleString()}m</span>
                        </div>
                      </div>
                      <img 
                        src={track.image} 
                        className={`absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:scale-110 transition-transform duration-700 ${
                          selectedTrackId === track.id ? 'opacity-20 grayscale-0' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Car Specs Summary */}
            <div className="bg-surface-container-high p-6 border-l-4 border-secondary">
              <span className="text-[9px] text-secondary font-bold uppercase tracking-widest">VEHICLE_CONFIG_SUMMARY</span>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-[8px] text-outline uppercase font-bold">POWER</p>
                  <p className="text-sm font-black italic">{currentCar.specs.hp} HP</p>
                </div>
                <div>
                  <p className="text-[8px] text-outline uppercase font-bold">WEIGHT</p>
                  <p className="text-sm font-black italic">{currentCar.specs.weight} KG</p>
                </div>
                <div>
                  <p className="text-[8px] text-outline uppercase font-bold">GRIP_COEFF</p>
                  <p className="text-sm font-black italic text-primary">{currentCar.performance.gripCoefficient}%</p>
                </div>
                <div>
                  <p className="text-[8px] text-outline uppercase font-bold">AERO_BAL</p>
                  <p className="text-sm font-black italic">{currentCar.performance.downforceBalance}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Results */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-highest p-8 md:p-12 border border-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Timer className="w-32 h-32 text-primary" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Radar className="w-6 h-6 text-primary animate-pulse" />
                  <span className="font-headline text-sm font-black text-primary tracking-[0.3em] uppercase">PREDICTED_LAP_TIME</span>
                </div>
                
                <h1 className="font-headline text-7xl md:text-9xl font-black text-on-surface tracking-tighter tabular-nums italic leading-none mb-4">
                  {predictionAnalysis.time}
                </h1>

                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-outline">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>EST_CONFIDENCE: 94.8%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-outline">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span>SIM_ITERATIONS: 10,000+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-low p-6 border-t-2 border-outline-variant/30">
                <div className="flex items-center gap-2 mb-4">
                  <Weight className="w-4 h-4 text-outline" />
                  <span className="text-[10px] font-black uppercase tracking-widest">MASS_IMPACT</span>
                </div>
                <p className={`text-2xl font-black italic ${parseFloat(predictionAnalysis.impacts.weight) > 0 ? 'text-primary' : 'text-green-500'}`}>
                  {parseFloat(predictionAnalysis.impacts.weight) > 0 ? '+' : ''}{predictionAnalysis.impacts.weight}%
                </p>
                <p className="text-[9px] text-outline mt-2 uppercase font-bold leading-relaxed">
                  PENALTY_DUE_TO_CURB_WEIGHT_VS_BASELINE_1500KG
                </p>
              </div>

              <div className="bg-surface-container-low p-6 border-t-2 border-outline-variant/30">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-outline" />
                  <span className="text-[10px] font-black uppercase tracking-widest">POWER_IMPACT</span>
                </div>
                <p className={`text-2xl font-black italic ${parseFloat(predictionAnalysis.impacts.power) > 0 ? 'text-primary' : 'text-green-500'}`}>
                  {parseFloat(predictionAnalysis.impacts.power) > 0 ? '+' : ''}{predictionAnalysis.impacts.power}%
                </p>
                <p className="text-[9px] text-outline mt-2 uppercase font-bold leading-relaxed">
                  TIME_DELTA_CALCULATED_FROM_PEAK_HP_OUTPUT
                </p>
              </div>

              <div className="bg-surface-container-low p-6 border-t-2 border-outline-variant/30">
                <div className="flex items-center gap-2 mb-4">
                  <Radar className="w-4 h-4 text-outline" />
                  <span className="text-[10px] font-black uppercase tracking-widest">GRIP_IMPACT</span>
                </div>
                <p className={`text-2xl font-black italic ${parseFloat(predictionAnalysis.impacts.grip) > 0 ? 'text-primary' : 'text-green-500'}`}>
                  {parseFloat(predictionAnalysis.impacts.grip) > 0 ? '+' : ''}{predictionAnalysis.impacts.grip}%
                </p>
                <p className="text-[9px] text-outline mt-2 uppercase font-bold leading-relaxed">
                  LATERAL_G_POTENTIAL_BASED_ON_COEFFICIENT
                </p>
              </div>
            </div>

            {/* Track Info Card */}
            <div className="bg-surface-container-high p-6 border border-outline-variant/20 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-48 h-32 bg-surface overflow-hidden border border-outline-variant/30">
                <img src={currentTrack.image} className="w-full h-full object-cover grayscale opacity-50" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-headline text-xl font-black italic uppercase">{currentTrack.name}</h3>
                  <p className="text-[10px] text-outline font-bold uppercase tracking-widest">TRACK_SPECIFICATIONS // DATA_SYNCED</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[8px] text-outline uppercase font-bold">LENGTH</span>
                    <p className="text-xs font-black">{currentTrack.length.toLocaleString()} M</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-outline uppercase font-bold">BASE_TIME</span>
                    <p className="text-xs font-black">{currentTrack.baseTime}S</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-outline uppercase font-bold">DIFFICULTY</span>
                    <p className="text-xs font-black text-primary">{currentTrack.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-outline uppercase font-bold">SECTORS</span>
                    <p className="text-xs font-black">03</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
