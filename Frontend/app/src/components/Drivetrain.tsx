import React, { useState, useEffect } from 'react';
import { DRIVETRAIN_PARTS } from '../constants';
import { Bolt, Settings2, Terminal, Check, X, Save, FolderOpen, ArrowRightLeft, Eye, Sparkles, Share2 } from 'lucide-react';
import { Part, WatchlistItem, BuildGoals, Car } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import type { BuildAnalysisResult } from '../types/api';

interface DrivetrainProps {
  goals: BuildGoals;
  car: Car;
  analysis?: BuildAnalysisResult | null;
}

export const Drivetrain: React.FC<DrivetrainProps> = ({ goals, car, analysis }) => {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<{ name: string; parts: string[] }[]>([]);
  const backendSelectedPartIds = new Set(
    analysis?.selected_parts.map((p) => p.part_id) ?? []
  );

  // Generate mock curve data for comparison
  const generateCurveData = (parts: Part[]) => {
    const data = [];
    const baseHp = car.specs.hp;
    
    for (let rpm = 2000; rpm <= 8000; rpm += 500) {
      const entry: any = { rpm };
      
      // Base curve for the car itself
      const baseCurveFactor = Math.pow(rpm / 8000, 1.3);
      entry['STOCK_HP'] = Math.round(baseHp * baseCurveFactor);

      parts.forEach(part => {
        const hpGainStat = part.stats.find(s => s.label.includes('Gain') || s.label.includes('HP'));
        const hpGain = hpGainStat ? parseInt(hpGainStat.value.replace(/[^0-9]/g, '')) || 50 : 50;
        
        // Mock curve: (base + gain) * (rpm/8000)^1.5 with some randomness
        const curveFactor = Math.pow(rpm / 8000, 1.5);
        entry[`${part.name}_HP`] = Math.round((baseHp + hpGain) * curveFactor);
      });
      data.push(entry);
    }
    return data;
  };

  const isRecommended = (part: Part) => {
    // AI Recommendation Logic:
    // 1. Activity Match (Primary)
    // 2. Budget Check (Secondary)
    // 3. Performance Alignment (Tertiary)
    const activityMatch = part.tags?.includes(goals.activity);
    const budgetFriendly = part.price <= goals.budget * 0.4; // Don't spend more than 40% of budget on one part unless it's critical
    
    // Check if part helps reach target HP if it's an engine part
    const hpGainStat = part.stats.find(s => s.label.includes('HP') || s.label.includes('Gain'));
    const significantHpGain = hpGainStat ? parseInt(hpGainStat.value.replace(/[^0-9]/g, '')) > 100 : false;
    const needsHp = goals.targetHp > 500;

    if (goals.activity === 'DRAG_RACING') {
      return activityMatch && (significantHpGain || part.id === 'MOTEC_ECU');
    }
    
    if (goals.activity === 'DRIFT') {
      return activityMatch || part.id === 'MOTEC_ECU';
    }

    return activityMatch && budgetFriendly;
  };

  const addToWatchlist = (part: Part) => {
    const saved = localStorage.getItem('apex_watchlist');
    const watchlist: WatchlistItem[] = saved ? JSON.parse(saved) : [];
    
    if (watchlist.some(item => item.partId === part.id)) {
      alert('PART ALREADY IN WATCHLIST');
      return;
    }

    const newItem: WatchlistItem = {
      id: `w_${Date.now()}`,
      partId: part.id,
      name: part.name,
      brand: part.brand,
      currentPrice: part.price,
      marketPrices: [
        { source: 'eBay', price: part.price * 0.92, url: 'https://ebay.com' },
        { source: 'Amazon', price: part.price * 1.05, url: 'https://amazon.com' },
        { source: 'Vendor X', price: part.price * 0.98, url: '#' },
      ],
      addedAt: new Date().toISOString(),
    };

    const updated = [...watchlist, newItem];
    localStorage.setItem('apex_watchlist', JSON.stringify(updated));
    alert('PART ADDED TO WATCHLIST');
  };

  useEffect(() => {
    const saved = localStorage.getItem('drivetrain_configs');
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  }, []);
  
  useEffect(() => {
    if (analysis?.selected_parts?.length) {
      setSelectedParts(analysis.selected_parts.map((p) => p.part_id).slice(0, 4));
    }
  }, [analysis]);
  const togglePartSelection = (id: string) => {
    setSelectedParts(prev => {
      const isSelected = prev.includes(id);
      if (!isSelected && prev.length >= 4) {
        alert('MAXIMUM 4 PARTS FOR COMPARISON');
        return prev;
      }
      return isSelected ? prev.filter(p => p !== id) : [...prev, id];
    });
  };

  const clearSelection = () => {
    setSelectedParts([]);
  };

  const saveConfig = () => {
    const name = `CONFIG_${new Date().getTime().toString().slice(-4)}`;
    const newConfigs = [...savedConfigs, { name, parts: selectedParts }];
    setSavedConfigs(newConfigs);
    localStorage.setItem('drivetrain_configs', JSON.stringify(newConfigs));
    alert(`CONFIGURATION ${name} SAVED`);
  };

  const loadConfig = (parts: string[]) => {
    setSelectedParts(parts);
    alert('CONFIGURATION LOADED');
  };

  const getComparisonStats = () => {
    const parts = DRIVETRAIN_PARTS.filter(p => selectedParts.includes(p.id));
    if (parts.length === 0) return null;

    // Extract all unique labels
    const labels = Array.from(new Set(parts.flatMap(p => p.stats.map(s => s.label))));
    
    return { parts, labels };
  };

  const parseStatValue = (value: string): number => {
    const numeric = value.replace(/[^0-9.-]/g, '');
    return parseFloat(numeric) || 0;
  };

  const getBestValue = (label: string, parts: Part[]): number => {
    const values = parts.map(p => {
      const stat = p.stats.find(s => s.label === label);
      return stat ? parseStatValue(stat.value) : -Infinity;
    });
    
    // For weight or cost, lower is better. For HP, torque, etc., higher is better.
    const lowerIsBetter = label.toLowerCase().includes('weight') || label.toLowerCase().includes('cost') || label.toLowerCase().includes('price');
    
    if (lowerIsBetter) {
      const filteredValues = values.filter(v => v !== -Infinity);
      return filteredValues.length > 0 ? Math.min(...filteredValues) : 0;
    }
    return Math.max(...values);
  };

  const calculateDiff = (currentValue: number, bestValue: number, label: string): string => {
    if (bestValue === 0 || currentValue === bestValue) return '';
    
    const lowerIsBetter = label.toLowerCase().includes('weight') || label.toLowerCase().includes('cost') || label.toLowerCase().includes('price');
    
    const diff = ((currentValue - bestValue) / bestValue) * 100;
    const sign = diff > 0 ? '+' : '';
    
    return `${sign}${diff.toFixed(1)}%`;
  };

  const comparisonData = getComparisonStats();

  return (
    <div className="grid grid-cols-12 gap-8 h-full overflow-hidden p-8 relative">
      {/* Comparison Modal */}
      {comparisonMode && comparisonData && (
        <div className="fixed inset-0 z-[100] bg-surface/95 backdrop-blur-2xl flex items-center justify-center p-12">
          <div className="w-full max-w-6xl bg-surface-container-low border border-primary-container/30 p-8 flex flex-col h-full shadow-[0_0_100px_rgba(224,30,34,0.1)]">
            <div className="flex justify-between items-center mb-8 border-b border-outline-variant/30 pb-4">
              <div className="flex flex-col">
                <span className="font-headline text-3xl font-black uppercase tracking-tighter italic">COMPARISON_MATRIX</span>
                <span className="font-headline text-[10px] tracking-widest text-primary font-bold">ANALYZING {selectedParts.length} COMPONENTS</span>
              </div>
              <button 
                onClick={() => setComparisonMode(false)}
                className="p-2 hover:bg-primary-container hover:text-white transition-colors border border-outline-variant"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-end mb-4">
              <button 
                onClick={() => {
                  alert('COMPARISON SHARED TO BUILD_LOG');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-white font-headline text-[10px] font-bold tracking-widest uppercase hover:scale-105 transition-all"
              >
                <Sparkles className="w-3 h-3" /> SHARE_TO_FEED
              </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto space-y-8">
              {/* Performance Chart */}
              <div className="bg-surface-container-high/30 p-6 border border-outline-variant/20 h-[300px]">
                <span className="font-headline text-[10px] tracking-widest text-primary font-bold uppercase block mb-4">POWER_DELIVERY_CURVES (ESTIMATED)</span>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateCurveData(comparisonData.parts)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="rpm" stroke="#666" fontSize={10} tickFormatter={(val) => `${val} RPM`} />
                    <YAxis stroke="#666" fontSize={10} tickFormatter={(val) => `${val} HP`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', fontSize: '10px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="STOCK_HP" 
                      name={`${car.name} (STOCK)`}
                      stroke="#666" 
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="3 3"
                    />
                    {comparisonData.parts.map((part, i) => (
                      <Line 
                        key={part.id} 
                        type="monotone" 
                        dataKey={`${part.name}_HP`} 
                        stroke={i === 0 ? '#709775' : i === 1 ? '#d4af37' : i === 2 ? '#e01e22' : '#ffffff'} 
                        strokeWidth={3}
                        dot={false}
                        animationDuration={1500}
                        strokeDasharray={i > 2 ? "5 5" : "0"}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left border border-outline-variant/30 bg-surface-container-high/50 font-headline text-xs tracking-widest uppercase">SPECIFICATION</th>
                    {comparisonData.parts.map(part => (
                      <th key={part.id} className="p-4 text-center border border-outline-variant/30 bg-surface-container-high/50 min-w-[200px]">
                        <div className="flex flex-col items-center gap-2">
                          <img src={part.image} alt={part.name} className="w-16 h-16 object-cover grayscale brightness-75" />
                          <span className="font-headline text-sm font-bold uppercase">{part.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.labels.map(label => {
                    const bestValue = getBestValue(label, comparisonData.parts);
                    const lowerIsBetter = label.toLowerCase().includes('weight') || label.toLowerCase().includes('cost') || label.toLowerCase().includes('price');

                    return (
                      <tr key={label} className="hover:bg-surface-container-high/30 transition-colors">
                        <td className="p-4 border border-outline-variant/30 font-mono text-[11px] text-outline uppercase font-bold">{label}</td>
                        {comparisonData.parts.map(part => {
                          const stat = part.stats.find(s => s.label === label);
                          const currentVal = stat ? parseStatValue(stat.value) : 0;
                          const isBest = currentVal === bestValue;
                          const diff = calculateDiff(currentVal, bestValue, label);

                          return (
                            <td 
                              key={part.id} 
                              className={`p-4 border border-outline-variant/30 text-center transition-colors ${
                                isBest ? 'bg-primary/10' : ''
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <span className={`font-mono text-lg font-bold ${
                                  isBest ? 'text-primary' : stat?.color === 'secondary' ? 'text-secondary' : 'text-white'
                                }`}>
                                  {stat?.value || 'N/A'}
                                </span>
                                {diff && (
                                  <span className={`text-[10px] font-mono font-bold ${
                                    (lowerIsBetter && currentVal > bestValue) || (!lowerIsBetter && currentVal < bestValue) 
                                      ? 'text-red-400' 
                                      : 'text-primary'
                                  }`}>
                                    {diff}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="p-4 border border-outline-variant/30 font-mono text-[11px] text-outline uppercase font-bold">PRICE</td>
                    {comparisonData.parts.map(part => {
                      const bestPrice = Math.min(...comparisonData.parts.map(p => p.price));
                      const isBest = part.price === bestPrice;
                      const diff = calculateDiff(part.price, bestPrice, 'price');
                      return (
                        <td key={part.id} className={`p-4 border border-outline-variant/30 text-center transition-colors ${isBest ? 'bg-primary/10' : ''}`}>
                          <div className="flex flex-col items-center">
                            <span className={`font-mono text-lg font-bold ${isBest ? 'text-primary' : 'text-white'}`}>
                              ${part.price.toLocaleString()}
                            </span>
                            {diff && <span className="text-[10px] font-mono font-bold text-red-400">{diff}</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-4 border border-outline-variant/30 font-mono text-[11px] text-outline uppercase font-bold">ML_CONFIDENCE</td>
                    {comparisonData.parts.map(part => {
                      const bestConfidence = Math.max(...comparisonData.parts.map(p => p.confidence));
                      const isBest = part.confidence === bestConfidence;
                      const diff = calculateDiff(part.confidence, bestConfidence, 'confidence');
                      return (
                        <td key={part.id} className={`p-4 border border-outline-variant/30 text-center transition-colors ${isBest ? 'bg-primary/10' : ''}`}>
                          <div className="flex flex-col items-center">
                            <span className={`font-headline text-2xl font-black italic ${isBest ? 'text-primary' : 'text-secondary'}`}>
                              {part.confidence}%
                            </span>
                            {diff && <span className="text-[10px] font-mono font-bold text-red-400">{diff}</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel: Parts Selection */}
      <div className="col-span-8 flex flex-col gap-6 overflow-hidden">
        <div className="flex justify-between items-end border-b-2 border-primary-container pb-2">
          <div className="flex flex-col">
            <span className="font-headline text-3xl font-black uppercase tracking-tighter">DRIVETRAIN_MODS</span>
            <span className="font-headline text-[10px] tracking-widest text-primary font-bold">CALIBRATING STAGE_3 CONFIGURATION</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              <button 
                onClick={saveConfig}
                className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant hover:border-primary transition-colors font-headline text-[10px] font-bold tracking-widest uppercase"
              >
                <Save className="w-3 h-3" /> SAVE_CFG
              </button>
              <div className="relative group/load">
                <button className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant hover:border-secondary transition-colors font-headline text-[10px] font-bold tracking-widest uppercase">
                  <FolderOpen className="w-3 h-3" /> LOAD_CFG
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant hidden group-hover/load:block z-50 shadow-2xl">
                  {savedConfigs.length === 0 ? (
                    <div className="p-3 text-[10px] text-outline italic">NO_SAVED_CONFIGS</div>
                  ) : (
                    savedConfigs.map((cfg, i) => (
                      <button 
                        key={i}
                        onClick={() => loadConfig(cfg.parts)}
                        className="w-full text-left p-3 hover:bg-primary/20 text-[10px] font-mono border-b border-outline-variant/30 last:border-0"
                      >
                        {cfg.name} ({cfg.parts.length} PARTS)
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-secondary">FILTER: ALL_COMPONENTS</span>
            <Settings2 className="w-4 h-4 text-secondary cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 hide-scrollbar space-y-4 pb-20">
          {DRIVETRAIN_PARTS.map((part) => (
            <div 
              key={part.id}
              onClick={() => togglePartSelection(part.id)}
              className={`bg-surface-container-low p-4 flex gap-6 hover:bg-surface-container-high transition-all cursor-pointer relative group border-l-4 ${
                selectedParts.includes(part.id) ? 'border-primary bg-surface-container-high' : 'border-transparent'
              } ${isRecommended(part) ? 'ring-1 ring-primary/30' : ''}`}
            >
              {isRecommended(part) && (
                <div className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-lg z-10">
                  <Sparkles className="w-2 h-2" /> RECOMMENDED_FOR_{goals.activity}
                </div>
              )}
              <div className="w-32 h-32 bg-surface-container-highest flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                <img 
                  className="object-cover w-full h-full opacity-80 group-hover:scale-110 transition-transform" 
                  src={part.image} 
                  alt={part.name}
                />
                {selectedParts.includes(part.id) && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Check className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-lg font-bold">{part.name}</h3>
                    {selectedParts.includes(part.id) && <span className="text-[8px] bg-primary text-white px-1 font-black">SELECTED</span>}
                  </div>
                  <p className="text-[10px] text-outline leading-tight mt-1 uppercase">{part.description}</p>
                  <div className="mt-4 flex gap-4">
                    {part.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[9px] text-outline font-bold uppercase">{stat.label}</span>
                        <span className={`font-mono font-bold ${stat.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between border-l border-outline-variant/30 pl-4">
                  <div className="text-right">
                    <span className="text-[9px] text-outline font-bold uppercase block">ML_CONFIDENCE</span>
                    <span className="font-headline text-2xl font-black text-secondary italic">{part.confidence}%</span>
                  </div>
              <div className="flex gap-2">
                {part.equipped && (
                  <span className="font-headline text-[11px] font-bold bg-primary-container text-white px-3 py-1">EQUIPPED</span>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWatchlist(part);
                  }}
                  className="p-1 border border-outline text-outline hover:border-secondary hover:text-secondary transition-colors"
                  title="ADD_TO_WATCHLIST"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePartSelection(part.id);
                  }}
                  className={`font-headline text-[11px] font-bold border px-3 py-1 transition-all ${
                    selectedParts.includes(part.id) 
                      ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(224,30,34,0.4)]' 
                      : 'border-outline text-outline hover:border-primary hover:text-primary'
                  }`}
                >
                  {selectedParts.includes(part.id) ? 'DESELECT' : 'COMPARE'}
                </button>
              </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Goal Visualization */}
      <div className="col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-high/60 backdrop-blur-xl p-6 flex flex-col h-full border-l border-primary-container/20">
          <div className="mb-8">
            <span className="font-headline text-[10px] tracking-[0.2em] font-black text-outline uppercase block mb-1">TARGET_OBJECTIVE</span>
            <h2 className="font-headline text-4xl font-black tracking-tighter italic text-primary">1000_HP_LIMIT</h2>
          </div>

          {/* Power Gauge */}
          <div className="flex-1 flex gap-8 items-stretch">
            <div className="w-16 flex flex-col gap-1 items-center relative">
              <div className="flex-1 w-full flex flex-col-reverse gap-1">
                {[...Array(14)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-4 w-full ${i < 5 ? 'bg-primary-container' : i < 7 ? 'bg-primary-container/40' : 'bg-surface-container-highest'}`}
                  />
                ))}
              </div>
              <div className="absolute -right-12 top-0 font-mono text-[10px] text-outline">1000</div>
              <div className="absolute -right-12 top-[50%] font-mono text-[10px] text-primary">742</div>
              <div className="absolute -right-12 bottom-0 font-mono text-[10px] text-outline">000</div>
            </div>
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <span className="font-headline text-[9px] font-bold text-secondary tracking-widest block mb-2 uppercase">CURRENT_OUTPUT</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black font-headline tabular-nums text-white italic">742</span>
                  <span className="text-xl font-bold font-headline text-primary italic">HP</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-outline uppercase">GAP_TO_GOAL</span>
                  <span className="font-mono text-2xl font-bold text-primary">-258 HP</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-outline uppercase">SYSTEM_STRESS</span>
                  <div className="w-full h-1 bg-surface-container-highest mt-2">
                    <div className="w-[68%] h-full bg-secondary"></div>
                  </div>
                  <span className="font-mono text-[9px] text-secondary text-right mt-1">68.2% NORMAL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-3">
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-outline uppercase">SIM_FIDELITY</span>
              <span className="text-white">ULTRA_HIGH</span>
            </div>
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-outline uppercase">ENGINE_LOAD</span>
              <span className="text-white">DYNAMIC_85%</span>
            </div>
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-outline uppercase">TEMP_EST</span>
              <span className="text-white">102°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Tray */}
      {selectedParts.length > 0 && !comparisonMode && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-surface-container-highest/90 backdrop-blur-xl border border-primary/30 p-4 shadow-2xl flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar flex-1">
              {selectedParts.map(id => {
                const part = DRIVETRAIN_PARTS.find(p => p.id === id);
                return part ? (
                  <div key={id} className="flex items-center gap-2 bg-surface-container-low p-1 pr-3 border border-outline-variant/30 shrink-0">
                    <img src={part.image} alt={part.name} className="w-8 h-8 object-cover grayscale" />
                    <span className="text-[10px] font-headline font-bold uppercase truncate max-w-[100px]">{part.name}</span>
                    <button onClick={() => togglePartSelection(id)} className="text-outline hover:text-primary">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex items-center gap-4 shrink-0 border-l border-outline-variant/30 pl-6">
              <button 
                onClick={clearSelection}
                className="text-[10px] font-headline font-bold text-outline hover:text-white uppercase tracking-widest"
              >
                CLEAR
              </button>
              <button 
                disabled={selectedParts.length < 2}
                onClick={() => setComparisonMode(true)}
                className={`px-6 py-2 font-headline font-black italic text-sm tracking-widest transition-all ${
                  selectedParts.length >= 2 
                    ? 'bg-primary text-white hover:scale-105 shadow-[0_0_20px_rgba(224,30,34,0.3)]' 
                    : 'bg-surface-container-high text-outline cursor-not-allowed'
                }`}
              >
                LAUNCH_COMPARISON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FABs */}
      <div className="fixed bottom-14 right-8 flex flex-col gap-4 z-50">
        <button className="bg-primary-container text-white px-10 py-5 font-headline font-black text-xl italic flex items-center gap-4 shadow-[0_10px_30px_rgba(224,30,34,0.4)] hover:shadow-[0_10px_40px_rgba(224,30,34,0.6)] active:scale-95 transition-all group">
          <span className="tracking-widest">SIMULATE_BUILD</span>
          <Bolt className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
