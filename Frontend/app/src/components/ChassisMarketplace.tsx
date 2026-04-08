import React, { useState, useMemo } from 'react';
import { CARS } from '../constants';
import { Car, BuildGoals } from '../types';
import { Search, Filter, DollarSign, Gauge, Weight, ChevronRight, Info, Calculator, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketplaceProps {
  goals: BuildGoals;
  onAddToGarage: (car: Car) => void;
  garageCars: Car[];
}

export const ChassisMarketplace: React.FC<MarketplaceProps> = ({ goals, onAddToGarage, garageCars }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minHp, setMinHp] = useState<number>(0);
  const [maxWeight, setMaxWeight] = useState<number>(3000);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [engineType, setEngineType] = useState<string>('ALL');
  const [minDisplacement, setMinDisplacement] = useState<number>(0);
  const [minIndex, setMinIndex] = useState<number>(0);
  const [maxMileage, setMaxMileage] = useState<number>(200000);
  const [transmission, setTransmission] = useState<string>('ALL');
  const [drivetrain, setDrivetrain] = useState<string>('ALL');
  const [maxOwners, setMaxOwners] = useState<number>(10);
  const [maxAccidents, setMaxAccidents] = useState<number>(5);
  const [minYear, setMinYear] = useState<number>(1980);
  const [bodyStyle, setBodyStyle] = useState<string>('ALL');
  const [fuelType, setFuelType] = useState<string>('ALL');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isScraping, setIsScraping] = useState(false);

  const engineTypes = useMemo(() => {
    const types = new Set(CARS.map(c => c.specs.engine.split('-')[0].split(' ')[0]));
    return ['ALL', ...Array.from(types)];
  }, []);

  const filteredCars = useMemo(() => {
    return CARS.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           car.platform.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesHp = car.specs.hp >= minHp;
      const matchesWeight = car.specs.weight <= maxWeight;
      const matchesPrice = car.price <= maxPrice;
      const matchesEngine = engineType === 'ALL' || car.specs.engine.includes(engineType);
      const matchesDisplacement = car.specs.displacement >= minDisplacement;
      const matchesIndex = car.performance.powerIndex >= minIndex;
      const matchesMileage = car.specs.mileage <= maxMileage;
      const matchesTransmission = transmission === 'ALL' || car.specs.transmission === transmission;
      const matchesDrivetrain = drivetrain === 'ALL' || car.specs.drivetrain === drivetrain;
      const matchesOwners = car.specs.owners <= maxOwners;
      const matchesAccidents = car.specs.accidents <= maxAccidents;
      const matchesYear = car.specs.year >= minYear;
      const matchesBody = bodyStyle === 'ALL' || car.specs.bodyStyle === bodyStyle;
      const matchesFuel = fuelType === 'ALL' || car.specs.fuelType === fuelType;
      
      return matchesSearch && matchesHp && matchesWeight && matchesPrice && 
             matchesEngine && matchesDisplacement && matchesIndex && 
             matchesMileage && matchesTransmission && matchesDrivetrain && 
             matchesOwners && matchesAccidents && matchesYear && matchesBody && matchesFuel;
    });
  }, [searchQuery, minHp, maxWeight, maxPrice, engineType, minDisplacement, minIndex, maxMileage, transmission, drivetrain, maxOwners, maxAccidents, minYear, bodyStyle, fuelType]);

  const handleScrape = () => {
    setIsScraping(true);
    setTimeout(() => setIsScraping(false), 2000);
  };

  const FinanceCalculator = ({ car }: { car: Car }) => {
    const downPayment = car.price * 0.2;
    const loanAmount = car.price - downPayment;
    const monthlyPayment = (loanAmount * 1.05) / 60; // 5% interest over 5 years

    return (
      <div className="bg-surface-container-highest p-6 border border-outline-variant/30 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-4 h-4 text-primary" />
          <span className="font-headline text-xs font-black tracking-widest uppercase">BUILD_FINANCE_ESTIMATE</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] text-outline font-bold uppercase">LIST_PRICE</span>
            <p className="font-headline text-xl font-black italic">${car.price.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-outline font-bold uppercase">DOWN_PAYMENT (20%)</span>
            <p className="font-headline text-xl font-black italic text-secondary">${downPayment.toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[9px] text-outline font-bold uppercase">EST_MONTHLY_PAYMENT</span>
              <p className="font-headline text-2xl font-black italic text-primary">${monthlyPayment.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-outline font-bold uppercase">LOAN_TERM</span>
              <p className="text-xs font-bold uppercase tracking-widest">60_MONTHS @ 5% APR</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-primary/5 border border-primary/20 flex gap-3 items-start">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[9px] text-outline leading-relaxed uppercase font-bold">
            FINANCING SUBJECT TO CREDIT APPROVAL. ESTIMATE DOES NOT INCLUDE TAXES, REGISTRATION, OR MODIFICATION COSTS.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto hide-scrollbar bg-surface-dim">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-12">
          <span className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter italic">CHASSIS_MARKETPLACE</span>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-0.5 w-12 bg-primary" />
            <span className="font-headline text-[10px] tracking-[0.3em] text-outline font-bold uppercase">
              ACQUIRE_NEW_PLATFORMS // ANALYZE_MARKET_VALUATION
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-surface-container-low p-6 border border-outline-variant/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="font-headline text-xs font-black tracking-widest uppercase">SEARCH_FILTERS</span>
                </div>
                <button 
                  onClick={handleScrape}
                  disabled={isScraping}
                  className={`p-2 rounded-full transition-all ${isScraping ? 'bg-primary animate-spin' : 'bg-surface-container-high hover:bg-primary/20'}`}
                  title="SCRAPE_MARKET_DATA"
                >
                  <TrendingUp className={`w-3 h-3 ${isScraping ? 'text-white' : 'text-primary'}`} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">KEYWORDS</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="NAME, PLATFORM..."
                      className="w-full bg-surface-container-high border border-outline-variant/30 p-2 pl-10 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">ENGINE_TYPE</label>
                  <select 
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 p-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                  >
                    {engineTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MIN_DISPLACEMENT</label>
                    <span className="text-[10px] font-bold text-primary">{minDisplacement}L</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minDisplacement}
                    onChange={(e) => setMinDisplacement(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MIN_PERF_INDEX</label>
                    <span className="text-[10px] font-bold text-primary">{minIndex}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={minIndex}
                    onChange={(e) => setMinIndex(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MIN_HP</label>
                    <span className="text-[10px] font-bold text-primary">{minHp} HP</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={minHp}
                    onChange={(e) => setMinHp(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MIN_YEAR</label>
                    <span className="text-[10px] font-bold text-primary">{minYear}</span>
                  </div>
                  <input 
                    type="range"
                    min="1980"
                    max="2024"
                    step="1"
                    value={minYear}
                    onChange={(e) => setMinYear(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">BODY_STYLE</label>
                  <select 
                    value={bodyStyle}
                    onChange={(e) => setBodyStyle(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 p-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                  >
                    <option value="ALL">ALL</option>
                    <option value="COUPE">COUPE</option>
                    <option value="SEDAN">SEDAN</option>
                    <option value="HATCHBACK">HATCHBACK</option>
                    <option value="CONVERTIBLE">CONVERTIBLE</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">FUEL_TYPE</label>
                  <select 
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 p-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                  >
                    <option value="ALL">ALL</option>
                    <option value="GASOLINE">GASOLINE</option>
                    <option value="DIESEL">DIESEL</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MAX_MILEAGE</label>
                    <span className="text-[10px] font-bold text-primary">{maxMileage.toLocaleString()} MI</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={maxMileage}
                    onChange={(e) => setMaxMileage(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">TRANSMISSION</label>
                  <select 
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 p-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                  >
                    <option value="ALL">ALL</option>
                    <option value="MANUAL">MANUAL</option>
                    <option value="AUTOMATIC">AUTOMATIC</option>
                    <option value="DCT">DCT</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">DRIVETRAIN</label>
                  <select 
                    value={drivetrain}
                    onChange={(e) => setDrivetrain(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 p-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                  >
                    <option value="ALL">ALL</option>
                    <option value="RWD">RWD</option>
                    <option value="AWD">AWD</option>
                    <option value="FWD">FWD</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MAX_OWNERS</label>
                    <span className="text-[10px] font-bold text-primary">{maxOwners}</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={maxOwners}
                    onChange={(e) => setMaxOwners(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MAX_ACCIDENTS</label>
                    <span className="text-[10px] font-bold text-primary">{maxAccidents}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={maxAccidents}
                    onChange={(e) => setMaxAccidents(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">MAX_PRICE</label>
                    <span className="text-[10px] font-bold text-primary">${maxPrice.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-surface-container-high p-6 border-l-4 border-secondary shadow-lg">
              <span className="text-[9px] text-secondary font-bold uppercase tracking-widest">CURRENT_BUILD_BUDGET</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="font-headline text-3xl font-black italic">${goals.budget.toLocaleString()}</h4>
              </div>
              <div className="mt-4 h-1 bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-secondary w-2/3" />
              </div>
              <p className="text-[9px] text-outline mt-2 uppercase font-bold">REMAINING_LIQUIDITY: $12,450</p>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-9 space-y-6">
            {isScraping && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/30 p-4 flex items-center gap-4"
              >
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="font-headline text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                  SCRAPING_GLOBAL_AUCTION_DATABASES... // SYNCING_LIVE_LISTINGS
                </span>
              </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => {
                const isOwned = garageCars.some(c => c.id === car.id);
                return (
                  <motion.div 
                    layout
                    key={car.id}
                    onClick={() => setSelectedCar(car)}
                    className={`group relative bg-surface-container-low border-2 transition-all duration-300 cursor-pointer overflow-hidden
                      ${selectedCar?.id === car.id ? 'border-primary' : 'border-outline-variant/20 hover:border-primary/50'}`}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={car.image} 
                        alt={car.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
                      <div className="absolute bottom-3 left-3 flex flex-col gap-1">
                        <span className="px-2 py-1 bg-primary text-white text-[10px] font-black tracking-widest uppercase italic">
                          ${car.price.toLocaleString()}
                        </span>
                        {(() => {
                          const rating = car.price / car.performance.powerIndex;
                          if (rating < 500) return <span className="px-2 py-0.5 bg-green-500 text-white text-[8px] font-black tracking-widest uppercase">GREAT_DEAL</span>;
                          if (rating < 700) return <span className="px-2 py-0.5 bg-secondary text-white text-[8px] font-black tracking-widest uppercase">GOOD_DEAL</span>;
                          return <span className="px-2 py-0.5 bg-surface-container-highest text-outline text-[8px] font-black tracking-widest uppercase">FAIR_DEAL</span>;
                        })()}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-headline text-xl font-black tracking-tighter uppercase italic">
                            <span className="text-primary mr-2">{car.specs.year}</span>
                            {car.name}
                          </h3>
                          <p className="text-[9px] font-bold text-outline uppercase tracking-widest">{car.platform} // {car.specs.bodyStyle}</p>
                        </div>
                        {isOwned && (
                          <span className="text-[8px] font-black px-2 py-0.5 bg-secondary text-white rounded uppercase">OWNED</span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-outline uppercase font-bold">POWER</span>
                          <span className="text-xs font-black italic">{car.specs.hp} HP</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-outline uppercase font-bold">WEIGHT</span>
                          <span className="text-xs font-black italic">{car.specs.weight} KG</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-outline uppercase font-bold">INDEX</span>
                          <span className="text-xs font-black italic text-primary">{car.performance.powerIndex}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-outline-variant/10">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-outline uppercase font-bold">MILEAGE</span>
                          <span className="text-xs font-black italic">{car.specs.mileage.toLocaleString()} MI</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-outline uppercase font-bold">TRANS</span>
                          <span className="text-xs font-black italic">{car.specs.transmission}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredCars.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 text-outline">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-headline text-sm font-bold uppercase tracking-widest">NO_MATCHING_CHASSIS_FOUND</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection Drawer / Finance Modal */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCar(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-container-low w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-outline-variant/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto relative">
                  <img src={selectedCar.image} alt={selectedCar.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2 className="font-headline text-4xl font-black italic uppercase tracking-tighter">{selectedCar.name}</h2>
                    <p className="font-headline text-xs font-bold text-primary tracking-[0.2em] uppercase">{selectedCar.platform} // SPEC_SHEET</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-widest">MARKET_VALUATION</span>
                      <span className="font-headline text-3xl font-black italic text-primary">${selectedCar.price.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedCar(null)}
                      className="p-2 hover:bg-surface-container-high transition-colors"
                    >
                      <DollarSign className="w-6 h-6 text-outline" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Gauge className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">ENGINE_CONFIG</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.specs.engine} // {selectedCar.specs.displacement}L</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Weight className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">CURB_WEIGHT</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.specs.weight} KG</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">MILEAGE</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.specs.mileage.toLocaleString()} MI</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">HISTORY</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.specs.owners} OWNERS // {selectedCar.specs.accidents} ACCIDENTS</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">DRIVETRAIN</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.specs.drivetrain} // {selectedCar.specs.transmission}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">EXTERIOR_COLOR</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.specs.exteriorColor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">INTERIOR_COLOR</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.specs.interiorColor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-[9px] text-outline font-bold uppercase">PERF_INDEX</p>
                          <p className="text-sm font-bold uppercase">{selectedCar.performance.powerIndex}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <FinanceCalculator car={selectedCar} />

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        onAddToGarage(selectedCar);
                        setSelectedCar(null);
                      }}
                      className="flex-1 bg-primary text-white py-4 font-headline text-xs font-black tracking-widest uppercase hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      ACQUIRE_CHASSIS <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedCar(null)}
                      className="px-8 border border-outline-variant hover:bg-surface-container-high transition-all font-headline text-xs font-black tracking-widest uppercase"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
