import React, { useState, useEffect } from 'react';
import { DRIVETRAIN_PARTS } from '../constants';
import { WatchlistItem, Part } from '../types';
import { ShoppingCart, Trash2, ExternalLink, TrendingDown, TrendingUp, AlertCircle, Search, Plus, Check, X } from 'lucide-react';

export const WatchList: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddSearch, setQuickAddSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('apex_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const addToWatchlist = (part: Part) => {
    if (watchlist.some(item => item.partId === part.id)) {
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
    setWatchlist(updated);
    localStorage.setItem('apex_watchlist', JSON.stringify(updated));
  };

  const removeFromWatchlist = (id: string) => {
    const updated = watchlist.filter(item => item.id !== id);
    setWatchlist(updated);
    localStorage.setItem('apex_watchlist', JSON.stringify(updated));
  };

  const filteredList = watchlist.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quickAddParts = DRIVETRAIN_PARTS.filter(p => 
    p.name.toLowerCase().includes(quickAddSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(quickAddSearch.toLowerCase())
  );

  return (
    <div className="p-8 h-full overflow-y-auto hide-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex flex-col">
            <span className="font-headline text-4xl font-black uppercase tracking-tighter italic">MARKET_WATCHLIST</span>
            <span className="font-headline text-[10px] tracking-[0.3em] text-primary font-bold">REAL_TIME_PRICE_COMPARISON_MATRIX</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH_WATCHLIST..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 p-4 pl-12 font-mono text-xs focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <button 
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="bg-primary text-white px-6 py-4 font-headline text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(112,151,117,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" /> QUICK_ADD_PART
            </button>
          </div>
        </div>

        {showQuickAdd && (
          <div className="mb-12 bg-surface-container-low border border-primary/30 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-xl font-black italic uppercase tracking-widest">ADD_NEW_COMPONENT_TO_TRACKING</h3>
              <button onClick={() => setShowQuickAdd(false)} className="text-outline hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input 
                type="text" 
                placeholder="SEARCH_GLOBAL_PARTS_DATABASE..."
                value={quickAddSearch}
                onChange={(e) => setQuickAddSearch(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 p-4 pl-12 font-mono text-xs focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickAddParts.map(part => {
                const isAdded = watchlist.some(item => item.partId === part.id);
                return (
                  <div key={part.id} className="p-4 bg-surface-container-high border border-outline-variant/20 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <img src={part.image} className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                      <div>
                        <div className="text-[10px] font-bold text-primary uppercase">{part.brand}</div>
                        <div className="text-xs font-headline font-bold uppercase italic">{part.name}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToWatchlist(part)}
                      disabled={isAdded}
                      className={`p-2 border transition-all ${isAdded ? 'bg-primary border-primary text-white' : 'border-outline-variant hover:border-primary hover:text-primary'}`}
                    >
                      {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {filteredList.map((item) => {
            const bestPrice = Math.min(...item.marketPrices.map(p => p.price));
            const priceDiff = item.currentPrice - bestPrice;
            const savingsPercent = ((priceDiff / item.currentPrice) * 100).toFixed(1);

            return (
              <div key={item.id} className="bg-surface-container-low border border-outline-variant/20 p-6 group hover:border-primary/30 transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Part Info */}
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.brand}</span>
                        <span className="text-[8px] bg-surface-container-highest text-outline px-1 font-bold">WATCHING</span>
                      </div>
                      <h3 className="font-headline text-2xl font-black tracking-tighter uppercase italic mb-4">{item.name}</h3>
                    </div>
                    
                    <div className="p-4 bg-surface-container-high/50 border-l-2 border-secondary">
                      <div className="text-[10px] font-bold text-outline uppercase mb-1">APEX_INTERNAL_PRICE</div>
                      <div className="text-3xl font-headline font-bold tabular-nums">${item.currentPrice.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Market Comparison */}
                  <div className="lg:col-span-5 border-l border-outline-variant/20 pl-0 lg:pl-8">
                    <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-6">EXTERNAL_MARKET_SOURCES</div>
                    <div className="space-y-4">
                      {item.marketPrices.map((market, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-surface-container-lowest/50 hover:bg-surface-container-high transition-colors group/market">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold uppercase">{market.source}</span>
                            {market.price < item.currentPrice ? (
                              <TrendingDown className="w-3 h-3 text-secondary" />
                            ) : (
                              <TrendingUp className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`font-mono font-bold ${market.price < item.currentPrice ? 'text-secondary' : 'text-primary'}`}>
                              ${market.price.toLocaleString()}
                            </span>
                            <a href={market.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-primary transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis & Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between border-l border-outline-variant/20 pl-0 lg:pl-8">
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-outline uppercase mb-1">MAX_POTENTIAL_SAVINGS</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-headline font-black text-secondary italic tabular-nums">{savingsPercent}%</span>
                          <span className="text-xs font-bold text-secondary">(-${priceDiff.toLocaleString()})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 p-3 bg-secondary/10 border border-secondary/20 rounded">
                        <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                        <p className="text-[9px] text-secondary font-bold uppercase leading-tight">
                          Price drop detected on eBay. Recommended procurement window is active.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-8 lg:mt-0">
                      <button className="flex-1 bg-primary-container text-white p-3 font-headline font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_20px_rgba(224,30,34,0.3)] transition-all flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> PROCURE
                      </button>
                      <button 
                        onClick={() => removeFromWatchlist(item.id)}
                        className="p-3 border border-outline-variant hover:border-primary hover:text-primary transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant/30">
              <span className="font-headline text-xl text-outline uppercase tracking-widest">NO_PARTS_IN_WATCHLIST</span>
              <button className="mt-4 text-primary font-bold text-[10px] tracking-widest uppercase hover:underline">
                BROWSE_CATALOGUE_TO_ADD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
