import React from 'react';
import { CARS } from '../constants';
import { Car } from '../types';
import { Check, Lock, ChevronRight } from 'lucide-react';

interface CatalogueProps {
  activeCar: Car;
  onSelectCar: (car: Car) => void;
  garageCars: Car[];
  onAddToGarage: (car: Car) => void;
}

export const Catalogue: React.FC<CatalogueProps> = ({ activeCar, onSelectCar, garageCars, onAddToGarage }) => {
  const [activeTab, setActiveTab] = React.useState<'CATALOGUE' | 'GARAGE'>('CATALOGUE');

  const displayedCars = activeTab === 'CATALOGUE' ? CARS : garageCars;

  return (
    <div className="p-8 h-full overflow-y-auto hide-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex flex-col">
            <span className="font-headline text-4xl font-black uppercase tracking-tighter italic">{activeTab === 'CATALOGUE' ? 'CHASSIS_CATALOGUE' : 'MY_GARAGE'}</span>
            <span className="font-headline text-[10px] tracking-[0.3em] text-primary font-bold">
              {activeTab === 'CATALOGUE' ? 'SELECT_ACTIVE_PLATFORM_FOR_OPTIMIZATION' : 'MANAGE_YOUR_COLLECTED_CHASSIS'}
            </span>
          </div>
          
          <div className="flex gap-2 bg-surface-container-low p-1 border border-outline-variant/30">
            <button 
              onClick={() => setActiveTab('CATALOGUE')}
              className={`px-6 py-2 font-headline text-[10px] font-black tracking-widest uppercase transition-all
                ${activeTab === 'CATALOGUE' ? 'bg-primary text-white' : 'text-outline hover:text-white'}`}
            >
              CATALOGUE
            </button>
            <button 
              onClick={() => setActiveTab('GARAGE')}
              className={`px-6 py-2 font-headline text-[10px] font-black tracking-widest uppercase transition-all
                ${activeTab === 'GARAGE' ? 'bg-primary text-white' : 'text-outline hover:text-white'}`}
            >
              MY_GARAGE ({garageCars.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCars.map((car) => {
            const isOwned = garageCars.some(c => c.id === car.id);
            const isActive = activeCar.id === car.id;

            return (
              <div 
                key={car.id}
                onClick={() => isOwned && onSelectCar(car)}
                className={`group relative border-2 transition-all duration-500 cursor-pointer overflow-hidden
                  ${isActive 
                    ? 'border-primary bg-surface-container-high shadow-[0_0_40px_rgba(224,30,34,0.15)]' 
                    : !isOwned && activeTab === 'CATALOGUE'
                      ? 'border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-surface-container-high'
                      : 'border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-surface-container-high'}`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {isActive ? (
                    <div className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full shadow-lg">
                      <Check className="w-3 h-3" />
                      <span className="text-[10px] font-black tracking-widest uppercase">ACTIVE_UNIT</span>
                    </div>
                  ) : isOwned ? (
                    <div className="flex items-center gap-2 bg-secondary text-white px-3 py-1 rounded-full shadow-lg">
                      <span className="text-[10px] font-black tracking-widest uppercase">OWNED</span>
                    </div>
                  ) : null}
                </div>

                {/* Image Container */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="font-headline text-2xl font-black tracking-tighter uppercase italic">{car.name}</h3>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{car.platform} // VER_{car.version}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-primary uppercase block">PERF_INDEX</span>
                      <span className="font-headline text-xl font-black italic">{car.performance.powerIndex}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-outline uppercase">ENGINE</span>
                      <span className="text-xs font-bold truncate">{car.specs.engine}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-outline uppercase">WEIGHT</span>
                      <span className="text-xs font-bold">{car.specs.weight} KG</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    {!isOwned && activeTab === 'CATALOGUE' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToGarage(car);
                        }}
                        className="w-full py-2 bg-surface-container-highest border border-outline-variant hover:border-primary hover:text-primary transition-all font-headline text-[10px] font-black tracking-widest uppercase"
                      >
                        ADD_TO_GARAGE
                      </button>
                    )}
                    {isOwned && !isActive && (
                      <div className="flex items-center justify-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black tracking-widest uppercase">DEPLOY_CHASSIS</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
