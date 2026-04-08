import React, { useState, useEffect } from 'react';
import { getTuningSuggestions } from '../services/geminiService';
import { Sparkles, RefreshCw, Terminal, Cpu, Zap, Shield, Wind, Gauge, Activity, BrainCircuit, ChevronRight, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Car, BuildGoals, Part } from '../types';
import { DRIVETRAIN_PARTS } from '../constants';

interface ApexIntelligenceProps {
  car: Car;
  goals: BuildGoals;
}

export const ApexIntelligence: React.FC<ApexIntelligenceProps> = ({ car, goals }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<'TUNING' | 'SIMULATION' | 'DIAGNOSTICS'>('TUNING');

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await getTuningSuggestions(car.name, car.specs, car.performance);
      setAnalysis(res);
    } catch (err) {
      setAnalysis("ERROR: Failed to reach Apex Intelligence Core. Check system connectivity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [car.id]);

  const getRecommendedParts = (): Part[] => {
    return DRIVETRAIN_PARTS.filter(part => {
      const activityMatch = part.tags?.includes(goals.activity);
      const budgetFriendly = part.price <= goals.budget * 0.4;
      const hpGainStat = part.stats.find(s => s.label.includes('HP') || s.label.includes('Gain'));
      const significantHpGain = hpGainStat ? parseInt(hpGainStat.value.replace(/[^0-9]/g, '')) > 100 : false;

      if (goals.activity === 'DRAG_RACING') {
        return activityMatch && (significantHpGain || part.id === 'MOTEC_ECU');
      }
      if (goals.activity === 'DRIFT') {
        return activityMatch || part.id === 'MOTEC_ECU';
      }
      return activityMatch && budgetFriendly;
    });
  };

  const recommendedParts = getRecommendedParts();

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto hide-scrollbar bg-surface flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 text-primary border border-primary/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] text-primary tracking-[0.4em] font-black uppercase">APEX_INTELLIGENCE // CORE_v3.1</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-2">INTELLIGENCE_LAB</h1>
            <p className="font-mono text-[11px] text-outline uppercase tracking-widest">NEURAL_NETWORK_TUNING_AND_PERFORMANCE_SIMULATION</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchAnalysis}
              disabled={loading}
              className="bg-surface-container-high border border-outline-variant/30 px-6 py-3 flex items-center gap-3 hover:bg-surface-container-highest transition-all group"
            >
              <RefreshCw className={`w-4 h-4 text-primary ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="font-headline text-sm font-bold uppercase tracking-widest italic">REFRESH_ANALYSIS</span>
            </button>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Left Column: System Status & Modules */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low border border-outline-variant/20 p-6">
              <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-outline mb-6">INTELLIGENCE_MODULES</h3>
              <div className="space-y-2">
                {[
                  { id: 'TUNING', label: 'AI_TUNING_CORE', icon: Sparkles, desc: 'Neural optimization for peak performance.' },
                  { id: 'SIMULATION', label: 'VIRTUAL_DYNO', icon: Activity, desc: 'Simulate performance in virtual environments.' },
                  { id: 'DIAGNOSTICS', label: 'DEEP_DIAGNOSTICS', icon: Cpu, desc: 'Real-time telemetry and error detection.' }
                ].map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id as any)}
                    className={`w-full flex items-start gap-4 p-4 border transition-all text-left group
                      ${activeModule === module.id 
                        ? 'bg-primary-container border-primary shadow-[0_0_20px_rgba(224,30,34,0.1)]' 
                        : 'bg-surface-container-high border-outline-variant/10 hover:border-primary/50'}`}
                  >
                    <div className={`p-2 ${activeModule === module.id ? 'bg-white/10 text-white' : 'bg-surface-container-highest text-outline group-hover:text-primary'}`}>
                      <module.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-headline text-sm font-bold uppercase tracking-widest italic ${activeModule === module.id ? 'text-white' : 'text-on-surface'}`}>
                        {module.label}
                      </div>
                      <div className={`font-mono text-[9px] uppercase tracking-wider mt-1 ${activeModule === module.id ? 'text-white/60' : 'text-outline'}`}>
                        {module.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/20 p-6">
              <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-outline mb-6">CHASSIS_CONTEXT</h3>
              <div className="p-4 bg-surface-container-high border-l-4 border-secondary flex items-center gap-4">
                <img src={car.image} className="w-20 h-12 object-cover grayscale brightness-110" alt="" />
                <div>
                  <div className="font-headline font-bold text-sm uppercase italic">{car.name}</div>
                  <div className="text-[9px] text-outline uppercase font-mono tracking-widest">{car.platform} // STAGE_3</div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-outline font-bold uppercase tracking-widest">SYNC_STABILITY</span>
                  <span className="font-mono text-xs font-bold text-secondary">99.2%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest">
                  <div className="w-[99.2%] h-full bg-secondary"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-outline font-bold uppercase tracking-widest">NEURAL_LOAD</span>
                  <span className="font-mono text-xs font-bold text-primary">12.4%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest">
                  <div className="w-[12.4%] h-full bg-primary"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Module Output */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-1 bg-surface-container-low border border-outline-variant/20 flex flex-col relative overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-surface-container-highest/50 p-4 border-b border-outline-variant/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                    {activeModule}_OUTPUT // SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary/40"></div>
                  <div className="w-2 h-2 rounded-full bg-outline-variant/40"></div>
                </div>
              </div>

              {/* Module Content */}
              <div className="flex-1 p-8 overflow-y-auto hide-scrollbar relative">
                {activeModule === 'TUNING' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4 p-6 bg-primary/5 border border-primary/10">
                      <Sparkles className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-headline text-lg font-bold uppercase tracking-widest italic mb-2">INTELLIGENCE_REPORT</h4>
                        <p className="font-mono text-[11px] text-outline leading-relaxed uppercase">
                          The following parameters have been analyzed using the Gemini 3 Flash model. Recommendations are based on your current build goals: <span className="text-primary font-bold">{goals.activity}</span>.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {loading ? (
                        <div className="space-y-4">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-surface-container-highest w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                          ))}
                        </div>
                      ) : (
                        <div className="font-mono text-xs leading-relaxed text-on-surface/90 whitespace-pre-line p-6 bg-surface-container-highest/20 border border-outline-variant/10">
                          {analysis || "Initializing intelligence core..."}
                        </div>
                      )}
                    </div>

                    {!loading && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-surface-container-high border-l-2 border-primary">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-3 h-3 text-primary" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">POWER_OPTIMIZATION</span>
                            </div>
                            <p className="text-[10px] text-outline uppercase font-mono">Ignition timing and fuel mapping optimized for {goals.activity}.</p>
                          </div>
                          <div className="p-4 bg-surface-container-high border-l-2 border-secondary">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-3 h-3 text-secondary" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">CHASSIS_STABILITY</span>
                            </div>
                            <p className="text-[10px] text-outline uppercase font-mono">Suspension geometry adjusted for maximum lateral grip.</p>
                          </div>
                        </div>

                        {/* Recommended Parts Section */}
                        <div className="bg-surface-container-high/50 border border-outline-variant/10 p-6">
                          <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <h4 className="font-headline text-sm font-bold uppercase tracking-widest italic">AI_RECOMMENDED_COMPONENTS</h4>
                          </div>
                          <div className="space-y-3">
                            {recommendedParts.length > 0 ? (
                              recommendedParts.map(part => (
                                <div key={part.id} className="flex items-center justify-between p-3 bg-surface border border-outline-variant/10 hover:border-primary/30 transition-all group">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-surface-container-highest overflow-hidden">
                                      <img src={part.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-headline font-bold uppercase italic">{part.name}</div>
                                      <div className="text-[8px] text-outline uppercase font-mono">{part.brand} // ${part.price.toLocaleString()}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div className="text-[8px] text-outline uppercase font-bold">CONFIDENCE</div>
                                      <div className="text-xs font-headline font-black text-primary italic">{part.confidence}%</div>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-[10px] text-outline italic uppercase font-mono">NO_SPECIFIC_RECOMMENDATIONS_FOR_CURRENT_GOALS</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeModule === 'SIMULATION' && (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                    <div className="w-24 h-24 bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6 animate-pulse">
                      <Activity className="w-10 h-10 text-secondary" />
                    </div>
                    <h4 className="font-headline text-2xl font-black uppercase italic tracking-tighter mb-2">VIRTUAL_DYNO_OFFLINE</h4>
                    <p className="font-mono text-[11px] text-outline uppercase tracking-widest max-w-sm">
                      Simulation module requires additional telemetry data from a physical test run to calibrate virtual environment.
                    </p>
                    <button className="mt-8 px-8 py-3 bg-secondary text-white font-headline font-bold uppercase tracking-widest italic hover:shadow-[0_0_30px_rgba(255,180,171,0.3)] transition-all">
                      REQUEST_CALIBRATION
                    </button>
                  </div>
                )}

                {activeModule === 'DIAGNOSTICS' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'CPU_TEMP', value: '42°C', status: 'OPTIMAL' },
                        { label: 'NEURAL_LATENCY', value: '12ms', status: 'LOW' },
                        { label: 'DATA_THROUGHPUT', value: '1.2 GB/s', status: 'HIGH' },
                        { label: 'ERROR_RATE', value: '0.001%', status: 'NOMINAL' }
                      ].map((stat) => (
                        <div key={stat.label} className="p-4 bg-surface-container-high border border-outline-variant/10">
                          <div className="text-[9px] text-outline font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                          <div className="flex justify-between items-end">
                            <div className="text-xl font-headline font-bold italic">{stat.value}</div>
                            <div className="text-[8px] font-black text-secondary uppercase tracking-widest">{stat.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-6 bg-surface-container-high border border-outline-variant/10 font-mono text-[10px] space-y-2">
                      <div className="text-primary">[04:22:14] SYSTEM_BOOT_COMPLETE</div>
                      <div className="text-secondary">[04:22:15] NEURAL_LINK_ESTABLISHED</div>
                      <div className="text-white">[04:22:16] CHASSIS_ID: {car.platform}_001_CONNECTED</div>
                      <div className="text-outline">[04:22:17] MONITORING_TELEMETRY_STREAM...</div>
                      <div className="text-outline">[04:22:18] ANALYZING_PERFORMANCE_DELTA...</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest">CORE_STABLE</span>
                  </div>
                  <div className="h-4 w-[1px] bg-outline-variant/20"></div>
                  <span className="text-[9px] text-outline font-bold uppercase tracking-widest">ENCRYPTION: AES_256</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-3 h-3 text-outline" />
                  <span className="text-[8px] text-outline uppercase font-bold">AI_ASSISTED_TUNING_IS_EXPERIMENTAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
