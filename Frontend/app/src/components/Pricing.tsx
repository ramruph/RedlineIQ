import React from 'react';
import { DRIVETRAIN_PARTS } from '../constants';
import { CreditCard, TrendingUp, Rss, Wind, Cpu, Droplets } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div className="pt-8 pb-20 px-6 min-h-screen overflow-y-auto hide-scrollbar">
      {/* Top Budget Tracking vs Actual */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-surface-container-low p-6 relative overflow-hidden">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="font-headline text-3xl font-black tracking-tighter uppercase text-on-surface">Budget Allocation</h2>
              <p className="font-label text-[10px] tracking-widest text-outline uppercase">Phase 04: Apex Velocity Build-Out</p>
            </div>
            <div className="text-right">
              <span className="font-headline text-4xl font-black text-primary tracking-tight tabular-nums">$84,200.00</span>
              <p className="font-label text-[10px] tracking-widest text-outline uppercase">Projected Burn Rate</p>
            </div>
          </div>
          {/* Segmented Progress Bar */}
          <div className="flex gap-1 h-3 mb-2">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 ${i < 6 ? 'bg-primary-container shadow-[0_0_10px_rgba(224,30,34,0.4)]' : i < 7 ? 'bg-primary-container/40' : 'bg-surface-container-highest'}`}
              />
            ))}
          </div>
          <div className="flex justify-between font-label text-[9px] text-outline uppercase font-bold">
            <span>Expended: $48,000.00</span>
            <span>Remaining: $36,200.00</span>
          </div>
        </div>
        <div className="bg-surface-container-high p-6 flex flex-col justify-center border-l-4 border-secondary">
          <p className="font-label text-[10px] tracking-[0.2em] text-secondary font-black uppercase mb-1">Total Savings</p>
          <h3 className="font-headline text-4xl font-black text-secondary tracking-tighter tabular-nums">$12,450.20</h3>
          <p className="font-label text-[9px] text-outline uppercase mt-2">Strategic Procurement Delta</p>
          <div className="mt-4 flex items-center gap-2 text-secondary text-xs font-bold font-sans uppercase">
            <TrendingUp className="w-4 h-4" />
            <span>+14.2% Efficiency</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-Time Price Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-low p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Rss className="w-5 h-5 text-primary" />
                <h3 className="font-headline text-xl font-bold uppercase tracking-tight">Active Market Feed</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-secondary/20 text-secondary text-[9px] font-black uppercase tracking-widest border border-secondary/30">Live Telemetry</span>
              </div>
            </div>
            <div className="space-y-4">
              {DRIVETRAIN_PARTS.map((part, i) => (
                <div key={part.id} className="group flex items-center justify-between p-4 bg-surface-container-high/50 hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface text-primary flex items-center justify-center">
                      {i === 0 ? <Wind className="w-6 h-6" /> : i === 1 ? <Cpu className="w-6 h-6" /> : <Droplets className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest">{part.brand}</p>
                      <h4 className="font-headline text-lg font-bold uppercase">{part.name}</h4>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <div>
                      <p className="text-[9px] font-bold text-outline uppercase">Current Low</p>
                      <p className="font-headline text-xl font-black text-on-surface tabular-nums">${part.price.toLocaleString()}</p>
                    </div>
                    <button className="bg-primary-container text-white px-6 py-2 font-sans font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(224,30,34,0.3)]">Procure</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Volatility Index */}
          <div className="bg-surface-container-low p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-xl font-bold uppercase tracking-tight">Market Volatility Index</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary"></div>
                  <span className="text-[9px] font-black uppercase text-outline">Carbon Components</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary"></div>
                  <span className="text-[9px] font-black uppercase text-outline">Electronic Modules</span>
                </div>
              </div>
            </div>
            <div className="relative h-48 w-full border-l border-b border-outline-variant/30 flex items-end justify-around gap-2 px-2">
              {[60, 55, 70, 85, 65, 40].map((h, i) => (
                <div key={i} className="flex-1 bg-surface-container-highest group relative cursor-crosshair">
                  <div className="absolute bottom-0 w-full bg-primary-container/20 border-t border-primary" style={{ height: `${h}%` }}></div>
                  <div className="absolute bottom-0 w-full bg-secondary-container/20 border-t border-secondary" style={{ height: `${100 - h}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[8px] font-black text-outline uppercase tracking-[0.2em]">
              <span>T-MINUS 12M</span>
              <span>T-MINUS 6M</span>
              <span>CURRENT QUARTER</span>
            </div>
          </div>
        </div>

        {/* Vendor Reliability & Logistics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-low p-6">
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight mb-6">Tier-1 Vendors</h3>
            <div className="space-y-6">
              {[
                { name: 'Apex Tuning Solutions', score: 98.2, color: 'secondary' },
                { name: 'Euro-Spec Dynamics', score: 84.5, color: 'secondary' },
                { name: 'Kansei Performance', score: 62.0, color: 'primary' }
              ].map((vendor, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans font-black uppercase text-[11px] text-on-surface">{vendor.name}</span>
                    <span className={`font-sans font-black text-${vendor.color} text-[11px]`}>{vendor.score}%</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    {[...Array(10)].map((_, j) => (
                      <div key={j} className={`flex-1 ${j < vendor.score / 10 ? `bg-${vendor.color}` : 'bg-surface-container-highest'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low p-6">
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight mb-6">Logistics Queue</h3>
            <div className="space-y-2">
              <div className="bg-surface p-4 border-l-2 border-secondary flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-secondary uppercase tracking-widest">In Transit</p>
                  <p className="font-headline text-sm font-bold uppercase">Forged Piston Set (V12)</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-outline uppercase">ETA</p>
                  <p className="font-sans text-xs font-black">2.4 DAYS</p>
                </div>
              </div>
              <div className="bg-surface p-4 border-l-2 border-outline flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-outline uppercase tracking-widest">Pending</p>
                  <p className="font-headline text-sm font-bold uppercase">Carbon Fiber Diffuser</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-outline uppercase">Status</p>
                  <p className="font-sans text-xs font-black">QC HOLD</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border border-outline-variant/30 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-surface-container-high transition-colors">View All Logistics</button>
          </div>

          <div className="relative group h-48 bg-surface overflow-hidden border border-outline-variant/20">
            <img 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2mGaqWbqOe2ofn2sEOWEbWOfZPFdNtpViAeR58gpE-b8-4ee2-i1WryPjob2w2-JF6PfYLf11LJu4HaNE9Cx_YPW-EGs8sGCMxYCRXz-2hOGuMm2UZtLXVvCJPP7DDkHaJIpk4krP_4-pqNOSQlAtWsx8S8TnuE362Fc4IsZ_-Nho_MfTy3O2UlCN2IRXR01awFfaMp6wWCs1lqA_NcvW2yjGFq9LgcOmbzRC4paNgOIbqnGs0G_6V8zPLnh40ZtDsmpihaVM6tY" 
              alt="Titanium Manifold"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="font-label text-[10px] tracking-[0.3em] text-primary font-black uppercase">Component Focus</p>
              <h4 className="font-headline text-2xl font-black uppercase tracking-tighter">Titanium Manifold</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
