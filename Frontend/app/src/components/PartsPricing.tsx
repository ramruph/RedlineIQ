import React, { useState } from 'react';
import { DRIVETRAIN_PARTS } from '../constants';
import { DollarSign, TrendingUp, ShoppingCart, Check, AlertCircle, Zap, Target } from 'lucide-react';

const VENDORS = [
  { id: 'apex', name: 'APEX_TUNING', multiplier: 1.0, reliability: 98 },
  { id: 'euro', name: 'EURO_SPEC', multiplier: 1.15, reliability: 92 },
  { id: 'kansei', name: 'KANSEI_PERF', multiplier: 0.9, reliability: 78 },
];

export const PartsPricing: React.FC = () => {
  const [powerGoal, setPowerGoal] = useState(1000);
  const [selectedVendor, setSelectedVendor] = useState('apex');
  const [procuringId, setProcuringId] = useState<string | null>(null);
  const [procuredParts, setProcuredParts] = useState<string[]>([]);

  // Filter parts that help reach the power goal
  const recommendedParts = DRIVETRAIN_PARTS.filter(part => {
    // Simple logic: if goal > 1000, only show high-end parts (price > 4000)
    // If goal < 800, show all
    if (powerGoal > 1200) return part.price > 5000;
    if (powerGoal > 900) return part.price > 3000;
    return true;
  }).map(part => {
    const basePrice = part.price;
    const vendor = VENDORS.find(v => v.id === selectedVendor)!;
    const finalPrice = basePrice * vendor.multiplier;
    
    return {
      ...part,
      finalPrice,
      vendor: vendor.name,
      reliability: vendor.reliability,
    };
  });

  const handleProcure = (id: string) => {
    setProcuringId(id);
    setTimeout(() => {
      setProcuringId(null);
      setProcuredParts(prev => [...prev, id]);
    }, 1500);
  };

  const totalCost = recommendedParts.reduce((sum, p) => sum + p.finalPrice, 0);

  return (
    <div className="pt-8 pb-20 px-8 min-h-screen overflow-y-auto hide-scrollbar">
      <div className="flex justify-between items-end border-b-2 border-primary-container pb-4 mb-8">
        <div className="flex flex-col">
          <span className="font-headline text-4xl font-black uppercase tracking-tighter italic">PARTS_PRICING_MATRIX</span>
          <span className="font-headline text-[10px] tracking-[0.3em] text-primary font-bold">PROCUREMENT_STRATEGY // TARGET: {powerGoal}_HP</span>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <span className="text-[10px] font-bold text-outline uppercase block">TOTAL_ESTIMATED_COST</span>
            <span className="font-headline text-3xl font-black text-white italic">${totalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Configuration & Goal */}
        <div className="col-span-4 space-y-6">
          <div className="bg-surface-container-low p-6 border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-headline text-xl font-bold uppercase italic">TARGET_GOAL</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-outline uppercase">POWER_OBJECTIVE</span>
                  <span className="font-mono text-primary font-bold">{powerGoal} HP</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="1500" 
                  step="50"
                  value={powerGoal}
                  onChange={(e) => setPowerGoal(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2 font-mono text-[9px] text-outline">
                  <span>500 HP</span>
                  <span>1500 HP</span>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/30">
                <span className="text-[10px] font-bold text-outline uppercase block mb-4">PREFERRED_VENDOR</span>
                <div className="space-y-2">
                  {VENDORS.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVendor(v.id)}
                      className={`w-full p-4 flex justify-between items-center transition-all border ${
                        selectedVendor === v.id 
                          ? 'bg-primary/10 border-primary text-white' 
                          : 'bg-surface-container-high border-transparent text-outline hover:border-outline-variant'
                      }`}
                    >
                      <div className="text-left">
                        <span className="font-headline text-sm font-bold block">{v.name}</span>
                        <span className="text-[9px] font-mono">RELIABILITY: {v.reliability}%</span>
                      </div>
                      {selectedVendor === v.id && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="font-headline text-xl font-bold uppercase italic">MARKET_INSIGHT</h3>
            </div>
            <p className="text-[11px] text-outline leading-relaxed uppercase">
              Current market volatility for <span className="text-white">TURBO_COMPONENTS</span> is high. 
              Procurement from <span className="text-secondary">KANSEI_PERF</span> offers significant cost savings but increases logistical risk by <span className="text-primary">22%</span>.
            </p>
          </div>
        </div>

        {/* Right: Parts Comparison Table */}
        <div className="col-span-8">
          <div className="bg-surface-container-low border border-outline-variant/30 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50">
                  <th className="p-4 text-left font-headline text-[10px] tracking-widest uppercase text-outline border-b border-outline-variant/30">COMPONENT</th>
                  <th className="p-4 text-center font-headline text-[10px] tracking-widest uppercase text-outline border-b border-outline-variant/30">GAIN</th>
                  <th className="p-4 text-center font-headline text-[10px] tracking-widest uppercase text-outline border-b border-outline-variant/30">VENDOR</th>
                  <th className="p-4 text-right font-headline text-[10px] tracking-widest uppercase text-outline border-b border-outline-variant/30">PRICE</th>
                  <th className="p-4 text-center font-headline text-[10px] tracking-widest uppercase text-outline border-b border-outline-variant/30">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recommendedParts.map((part) => (
                  <tr key={part.id} className="hover:bg-surface-container-high/30 transition-colors border-b border-outline-variant/10 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-container-highest flex-shrink-0">
                          <img src={part.image} alt={part.name} className="w-full h-full object-cover grayscale opacity-60" />
                        </div>
                        <div>
                          <span className="font-headline text-sm font-bold block uppercase">{part.name}</span>
                          <span className="text-[9px] text-outline font-mono">{part.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-primary font-bold">{part.stats[0]?.value || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-headline text-[10px] font-bold text-white">{part.vendor}</span>
                        <div className="w-16 h-1 bg-surface-container-highest mt-1">
                          <div 
                            className={`h-full ${part.reliability > 90 ? 'bg-secondary' : part.reliability > 80 ? 'bg-primary' : 'bg-outline'}`} 
                            style={{ width: `${part.reliability}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono text-lg font-bold text-white">${part.finalPrice.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleProcure(part.id)}
                        disabled={procuringId === part.id || procuredParts.includes(part.id)}
                        className={`p-2 transition-all active:scale-90 relative ${
                          procuredParts.includes(part.id) 
                            ? 'bg-secondary text-white' 
                            : procuringId === part.id 
                              ? 'bg-surface-container-highest text-outline animate-pulse' 
                              : 'bg-primary-container text-white hover:shadow-[0_0_15px_rgba(224,30,34,0.4)]'
                        }`}
                      >
                        {procuredParts.includes(part.id) ? (
                          <Check className="w-4 h-4" />
                        ) : procuringId === part.id ? (
                          <div className="w-4 h-4 border-2 border-outline border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-4 border-l-2 border-primary flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <div>
                <span className="text-[9px] font-bold text-outline uppercase block">RISK_LEVEL</span>
                <span className="font-headline text-lg font-black italic">MODERATE</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 border-l-2 border-secondary flex items-center gap-4">
              <Zap className="w-6 h-6 text-secondary" />
              <div>
                <span className="text-[9px] font-bold text-outline uppercase block">EFFICIENCY</span>
                <span className="font-headline text-lg font-black italic">+14.2%</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 border-l-2 border-white flex items-center gap-4">
              <DollarSign className="w-6 h-6 text-white" />
              <div>
                <span className="text-[9px] font-bold text-outline uppercase block">SAVINGS_POTENTIAL</span>
                <span className="font-headline text-lg font-black italic">$4,200</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
